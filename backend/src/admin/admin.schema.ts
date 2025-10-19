import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ default: 'admin' }) role: string;
  @Prop() lastLogin: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
