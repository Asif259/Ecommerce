import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  // Using Mixed type to support both ObjectId (new) and String (old) for backward compatibility
  @Prop({ type: MongooseSchema.Types.Mixed, ref: 'Category' })
  category: Types.ObjectId | string;

  @Prop()
  categoryName: string; // Denormalized for faster queries - also used for backward compatibility

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  stock: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  discount: number;

  @Prop()
  sku: string;

  @Prop({ type: Object })
  specifications: Record<string, any>;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
