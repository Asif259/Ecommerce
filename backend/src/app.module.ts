import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './utils/email.service';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || 'homedecorandmore001@gmail.com',
          pass: process.env.SMTP_PASS || 'ojwe tsvj mqvg ksbc',
        },
      },
      defaults: {
        from:
          process.env.SMTP_FROM ||
          'Fenian Gadgets <homedecorandmore001@gmail.com>',
      },
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    ReviewsModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
