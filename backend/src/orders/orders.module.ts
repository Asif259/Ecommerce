import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './order.schema';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from '../utils/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    AuthModule,
  ],

  controllers: [OrdersController],
  providers: [OrdersService, EmailService],
  exports: [OrdersService],
})
export class OrdersModule {}
