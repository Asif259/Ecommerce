"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Package,
  ArrowLeft,
  Home,
  Mail,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface OrderDetails {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentPhone?: string;
  transactionId?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err) {
      setError("Error fetching order details");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F6244] mx-auto"></div>
          <p className="mt-4 text-[#8B7E6A]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#3D3D3D] mb-4">
            {error || "Order not found"}
          </h1>
          <Link href="/">
            <Button className="bg-[#7F6244] hover:bg-[#6B5139] text-white">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#3D3D3D] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-[#8B7E6A] mb-2">
            Thank you for your purchase, {order.customerName}
          </p>
          <p className="text-[#8B7E6A]">
            Your order has been successfully placed and is being processed.
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-[#D4C5B9]/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-[#3D3D3D]">
                <Package className="h-5 w-5 mr-2 text-[#7F6244]" />
                Order Summary
              </CardTitle>
              <CardDescription>Order #{order.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    Order Confirmed
                  </span>
                </div>
                <span className="text-sm text-green-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#3D3D3D]">Items Ordered</h3>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-[#D4C5B9]/20"
                  >
                    <div>
                      <span className="font-medium text-[#3D3D3D]">
                        {item.name}
                      </span>
                      <span className="text-sm text-[#8B7E6A] ml-2">
                        (Qty: {item.quantity})
                      </span>
                    </div>
                    <span className="font-semibold text-[#7F6244]">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-[#D4C5B9] pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-[#3D3D3D]">Total</span>
                  <span className="text-[#7F6244]">
                    ৳{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="flex items-center text-[#3D3D3D]">
                  <MapPin className="h-5 w-5 mr-2 text-[#7F6244]" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-[#5A5A5A]">
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="flex items-center text-[#3D3D3D]">
                  <CreditCard className="h-5 w-5 mr-2 text-[#7F6244]" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-[#5A5A5A]">
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod === "cash"
                      ? "Cash on Delivery"
                      : order.paymentMethod === "mobile-banking"
                      ? "Mobile Banking (Bkash/Nagad)"
                      : "Credit/Debit Card"}
                  </p>
                  {order.paymentMethod === "mobile-banking" && (
                    <>
                      {order.paymentPhone && (
                        <p>
                          <span className="font-medium">Payment Phone:</span>{" "}
                          {order.paymentPhone}
                        </p>
                      )}
                      {order.transactionId && (
                        <p>
                          <span className="font-medium">Transaction ID:</span>{" "}
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {order.transactionId}
                          </span>
                        </p>
                      )}
                    </>
                  )}
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span className="text-orange-600 font-medium">Pending</span>
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-[#D4C5B9]/20 mb-8">
            <CardHeader>
              <CardTitle className="text-[#3D3D3D]">What's Next?</CardTitle>
              <CardDescription>
                Here's what happens with your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#7F6244] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3D3D3D]">
                      Order Processing
                    </h4>
                    <p className="text-sm text-[#8B7E6A]">
                      We'll prepare your items for shipment within 1-2 business
                      days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3D3D3D]">Shipping</h4>
                    <p className="text-sm text-[#8B7E6A]">
                      Your order will be shipped and you'll receive tracking
                      information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3D3D3D]">Delivery</h4>
                    <p className="text-sm text-[#8B7E6A]">
                      Your order will arrive at your specified address.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Alert className="border-blue-200 bg-blue-50 mb-8">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              A confirmation email has been sent to{" "}
              <strong>{order.customerEmail}</strong> with your order details and
              tracking information.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/products">
            <Button className="w-full sm:w-auto bg-[#7F6244] hover:bg-[#6B5139] text-white">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#D4C5B9] text-[#8B7E6A] hover:bg-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
