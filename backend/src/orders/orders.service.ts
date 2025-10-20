import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate products and check stock
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }
    }

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    const orderData = {
      ...createOrderDto,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
    };

    const order = new this.orderModel(orderData);
    const savedOrder = await order.save();

    // Update product stock
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    return savedOrder;
  }

  async findAll(
    query: OrderQueryDto,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, customerEmail, orderNumber } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (customerEmail) {
      filter.customerEmail = customerEmail;
    }

    if (orderNumber) {
      filter.orderNumber = orderNumber;
    }

    const orders = await this.orderModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.orderModel.countDocuments(filter);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updateData: any = { ...updateOrderDto };

    // Handle status changes and set timestamps automatically
    if (updateOrderDto.status === 'confirmed' && !updateData.confirmedAt) {
      updateData.confirmedAt = new Date();
    }

    if (updateOrderDto.status === 'shipped' && !updateData.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (updateOrderDto.status === 'delivered' && !updateData.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const result = {
      totalOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
    };

    stats.forEach((stat) => {
      result.totalOrders += stat.count;
      result.totalRevenue += stat.totalAmount;

      switch (stat._id) {
        case 'pending':
          result.pendingOrders = stat.count;
          break;
        case 'shipped':
          result.shippedOrders = stat.count;
          break;
        case 'delivered':
          result.deliveredOrders = stat.count;
          break;
        case 'cancelled':
          result.cancelledOrders = stat.count;
          break;
      }
    });

    return result;
  }

  async getRevenueByMonth(
    months: number = 6,
  ): Promise<Array<{ month: string; revenue: number; orders: number }>> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const revenue = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return revenue.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: Math.round(item.revenue * 100) / 100,
      orders: item.orders,
    }));
  }

  async getTopProducts(limit: number = 5): Promise<
    Array<{
      productId: string;
      name: string;
      sales: number;
      revenue: number;
      image?: string;
    }>
  > {
    const topProducts = await this.orderModel.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Try to fetch product images from products collection
    const productsWithImages = await Promise.all(
      topProducts.map(async (product) => {
        try {
          const productDetails = await this.productsService.findOne(
            product._id.toString(),
          );
          return {
            productId: product._id.toString(),
            name: product.name,
            sales: product.sales,
            revenue: Math.round(product.revenue * 100) / 100,
            image: productDetails.images?.[0] || undefined,
          };
        } catch {
          return {
            productId: product._id.toString(),
            name: product.name,
            sales: product.sales,
            revenue: Math.round(product.revenue * 100) / 100,
          };
        }
      }),
    );

    return productsWithImages;
  }

  async getOrdersByDayOfWeek(): Promise<
    Array<{ day: string; orders: number; revenue: number }>
  > {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersByDay = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize all days with 0
    const result = dayNames.map((day, index) => ({
      day,
      orders: 0,
      revenue: 0,
    }));

    // Fill in actual data
    ordersByDay.forEach((item) => {
      const dayIndex = item._id === 1 ? 0 : item._id - 1; // MongoDB dayOfWeek: 1=Sunday
      result[dayIndex] = {
        day: dayNames[dayIndex],
        orders: item.orders,
        revenue: Math.round(item.revenue * 100) / 100,
      };
    });

    // Reorder to start from Monday
    const reordered = [
      result[1], // Mon
      result[2], // Tue
      result[3], // Wed
      result[4], // Thu
      result[5], // Fri
      result[6], // Sat
      result[0], // Sun
    ];

    return reordered;
  }

  async getOrdersByStatus(): Promise<Record<string, number>> {
    const statusCounts = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {};
    statusCounts.forEach((item) => {
      result[item._id] = item.count;
    });

    return result;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}
