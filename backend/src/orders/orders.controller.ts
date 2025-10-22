import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/auth.decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Public()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('customer/:customerEmail')
  @Public()
  findByCustomerEmail(@Param('customerEmail') customerEmail: string) {
    return this.ordersService.orderByCustomerEmail(customerEmail);
  }

  @Get('analytics/revenue-by-month')
  @UseGuards(JwtAuthGuard)
  getRevenueByMonth(@Query('months') months?: number) {
    return this.ordersService.getRevenueByMonth(
      months ? parseInt(months.toString()) : 6,
    );
  }

  @Get('analytics/top-products')
  @UseGuards(JwtAuthGuard)
  getTopProducts(@Query('limit') limit?: number) {
    return this.ordersService.getTopProducts(
      limit ? parseInt(limit.toString()) : 5,
    );
  }

  @Get('analytics/orders-by-day')
  @UseGuards(JwtAuthGuard)
  getOrdersByDayOfWeek() {
    return this.ordersService.getOrdersByDayOfWeek();
  }

  @Get('analytics/orders-by-status')
  @UseGuards(JwtAuthGuard)
  getOrdersByStatus() {
    return this.ordersService.getOrdersByStatus();
  }

  @Get('analytics/monthly')
  @UseGuards(JwtAuthGuard)
  getMonthlyAnalytics(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.ordersService.getMonthlyAnalytics(
      parseInt(month.toString()),
      parseInt(year.toString()),
    );
  }

  @Get('order-number/:orderNumber')
  @Public()
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
