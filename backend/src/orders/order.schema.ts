import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;
}

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  phone: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ default: 'pending' })
  status: string; // pending, confirmed, shipped, delivered, cancelled

  @Prop({ default: 'cash' })
  paymentMethod: string;

  @Prop({ default: 'pending' })
  paymentStatus: string; // pending, paid, failed, refunded

  @Prop()
  paymentPhone: string;

  @Prop()
  transactionId: string;

  @Prop()
  notes: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  shippedAt: Date;

  @Prop()
  deliveredAt: Date;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
export const OrderSchema = SchemaFactory.createForClass(Order);
