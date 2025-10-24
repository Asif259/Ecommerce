import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
