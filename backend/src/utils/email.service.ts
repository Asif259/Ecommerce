import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(order: any): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: order.customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: this.generateOrderReceiptHTML(order),
      });

      this.logger.log(
        `Order confirmation email sent to ${order.customerEmail} for order ${order.orderNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmation email: ${error.message}`,
      );

      // Provide specific error guidance based on error type
      if (error.code === 'EAUTH') {
        this.logger.error(
          'Authentication failed. Please check your SMTP credentials.',
        );
        this.logger.error(
          'For Gmail, make sure you are using an App Password, not your regular password.',
        );
      } else if (error.code === 'ECONNECTION') {
        this.logger.error(
          'Connection failed. Please check your SMTP host and port settings.',
        );
      }

      // Don't throw the error to prevent order creation from failing
      // The order should still be created even if email fails
    }
  }

  private generateOrderReceiptHTML(order: any): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsHTML = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #7E6244;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #7E6244;
            margin-bottom: 10px;
          }
          .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .order-info h3 {
            margin-top: 0;
            color: #7E6244;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .info-value {
            color: #333;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .items-table th {
            background-color: #7E6244;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .total-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: right;
          }
          .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #7E6244;
            margin-top: 10px;
          }
          .shipping-info {
            background-color: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .shipping-info h3 {
            margin-top: 0;
            color: #7E6244;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-pending {
            background-color: #fff3cd;
            color: #856404;
          }
          .status-confirmed {
            background-color: #d4edda;
            color: #155724;
          }
          .status-shipped {
            background-color: #cce5ff;
            color: #004085;
          }
          .status-delivered {
            background-color: #d1ecf1;
            color: #0c5460;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Home Decor and More</div>
            <p>Thank you for your order!</p>
          </div>

          <div class="order-info">
            <h3>Order Details</h3>
            <div class="info-row">
              <span class="info-label">Order Number:</span>
              <span class="info-value">${order.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${orderDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span class="info-value">${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${order.customerEmail}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">
                <span class="status-badge status-${order.status}">${order.status}</span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${order.paymentMethod}</span>
            </div>
            ${
              order.paymentPhone
                ? `
            <div class="info-row">
              <span class="info-label">Payment Phone:</span>
              <span class="info-value">${order.paymentPhone}</span>
            </div>
            `
                : ''
            }
            ${
              order.transactionId
                ? `
            <div class="info-row">
              <span class="info-label">Transaction ID:</span>
              <span class="info-value">${order.transactionId}</span>
            </div>
            `
                : ''
            }
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="total-section">
            <div style="font-size: 18px; font-weight: bold;">
              Total Amount: <span class="total-amount">৳${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="shipping-info">
            <h3>Shipping Address</h3>
            <p><strong>${order.shippingAddress.fullName}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.upazila}, ${order.shippingAddress.district}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            ${
              order.trackingNumber
                ? `
            <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            `
                : ''
            }
          </div>

          ${
            order.notes
              ? `
          <div class="shipping-info">
            <h3>Order Notes</h3>
            <p>${order.notes}</p>
          </div>
          `
              : ''
          }

          <div class="footer">
            <p>Thank you for choosing Home Decor and More!</P>
            <p>If you have any questions about your order, please contact us.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusUpdateHTML(order: any, previousStatus: string): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const statusMessages = {
      pending: {
        title: 'Order Received',
        message:
          'Thank you for your order! We have received your order and are processing it.',
        color: '#856404',
        bgColor: '#fff3cd',
      },
      confirmed: {
        title: 'Order Confirmed',
        message:
          'Great news! Your order has been confirmed and is being prepared for shipment.',
        color: '#155724',
        bgColor: '#d4edda',
      },
      shipped: {
        title: 'Order Shipped',
        message:
          'Your order is on its way! It has been shipped and should arrive soon.',
        color: '#004085',
        bgColor: '#cce5ff',
      },
      delivered: {
        title: 'Order Delivered',
        message:
          'Your order has been successfully delivered! Thank you for choosing Home Decor and More.',
        color: '#0c5460',
        bgColor: '#d1ecf1',
      },
      cancelled: {
        title: 'Order Cancelled',
        message:
          'Your order has been cancelled. If you have any questions, please contact us.',
        color: '#721c24',
        bgColor: '#f8d7da',
      },
    };

    const currentStatus =
      statusMessages[order.status] || statusMessages.pending;
    const trackingInfo = order.trackingNumber
      ? `
      <div class="tracking-info">
        <h3>Tracking Information</h3>
        <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
        <p>You can use this tracking number to monitor your package delivery status.</p>
      </div>
    `
      : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #7E6244;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #7E6244;
            margin-bottom: 10px;
          }
          .status-banner {
            background-color: ${currentStatus.bgColor};
            color: ${currentStatus.color};
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border-left: 5px solid ${currentStatus.color};
          }
          .status-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .status-message {
            font-size: 16px;
            margin-bottom: 0;
          }
          .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .order-info h3 {
            margin-top: 0;
            color: #7E6244;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .info-value {
            color: #333;
          }
          .status-change {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
          }
          .status-change .arrow {
            font-size: 18px;
            color: #7E6244;
            margin: 0 10px;
          }
          .tracking-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .tracking-info h3 {
            margin-top: 0;
            color: #7E6244;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background-color: #7E6244;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Home Decor and More</div>
            <p>Order Status Update</p>
          </div>

          <div class="status-banner">
            <div class="status-title">${currentStatus.title}</div>
            <div class="status-message">${currentStatus.message}</div>
          </div>

          <div class="status-change">
            <strong>Status Changed:</strong>
            <span style="color: #666;">${previousStatus}</span>
            <span class="arrow">→</span>
            <span style="color: ${currentStatus.color}; font-weight: bold;">${order.status}</span>
          </div>

          <div class="order-info">
            <h3>Order Details</h3>
            <div class="info-row">
              <span class="info-label">Order Number:</span>
              <span class="info-value">${order.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${orderDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span class="info-value">${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value">৳${order.totalAmount.toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${order.paymentMethod}</span>
            </div>
          </div>

          ${trackingInfo}

          <div class="footer">
            <p>Thank you for choosing Home Decor and More!</p>
            <p>If you have any questions about your order, please contact us.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderStatusUpdate(
    order: any,
    previousStatus: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: order.customerEmail,
        subject: `Order Status Update - ${order.orderNumber}`,
        html: this.generateStatusUpdateHTML(order, previousStatus),
      });

      this.logger.log(
        `Order status update email sent to ${order.customerEmail} for order ${order.orderNumber} (${previousStatus} → ${order.status})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order status update email: ${error.message}`,
      );

      // Provide specific error guidance based on error type
      if (error.code === 'EAUTH') {
        this.logger.error(
          'Authentication failed. Please check your SMTP credentials.',
        );
        this.logger.error(
          'For Gmail, make sure you are using an App Password, not your regular password.',
        );
      } else if (error.code === 'ECONNECTION') {
        this.logger.error(
          'Connection failed. Please check your SMTP host and port settings.',
        );
      }

      // Don't throw the error to prevent order update from failing
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test the connection by sending a test email to a dummy address
      // This will verify the SMTP configuration
      await this.mailerService.sendMail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>This is a test email to verify SMTP configuration.</p>',
      });

      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error(`Email service connection failed: ${error.message}`);

      // Provide specific error guidance
      if (error.code === 'EAUTH') {
        this.logger.error(
          'Authentication failed. Please check your SMTP credentials.',
        );
        this.logger.error(
          'For Gmail, make sure you are using an App Password, not your regular password.',
        );
      } else if (error.code === 'ECONNECTION') {
        this.logger.error(
          'Connection failed. Please check your SMTP host and port settings.',
        );
      }

      return false;
    }
  }
}
