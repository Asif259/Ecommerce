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

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}
