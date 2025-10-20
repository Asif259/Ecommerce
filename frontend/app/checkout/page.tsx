"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/utils/api";

interface ShippingAddress {
  fullName: string;
  address: string;
  upazila: string;
  district: string;
  phone: string;
}

interface OrderData {
  customerEmail?: string;
  customerName: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  paymentPhone?: string;
  transactionId?: string;
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    upazila: "",
    district: "",
    phone: "",
  });

  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    name: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const subtotal = getTotal();

  // Fixed shipping fee
  const shipping = 120;
  const total = subtotal + shipping;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerInfoChange = (
    field: keyof typeof customerInfo,
    value: string
  ) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      customerInfo.email,
      customerInfo.name,
      shippingAddress.fullName,
      shippingAddress.address,
      shippingAddress.upazila,
      shippingAddress.district,
      shippingAddress.phone,
    ];

    // Add payment details validation for mobile banking
    if (paymentMethod === "mobile-banking") {
      requiredFields.push(paymentPhone, transactionId);
    }

    if (requiredFields.some((field) => !field.trim())) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!customerInfo.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData: OrderData = {
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        totalAmount: total,
        shippingAddress,
        paymentMethod,
        notes: notes.trim() || undefined,
        // Add payment details for mobile banking
        ...(paymentMethod === "mobile-banking" && {
          paymentPhone,
          transactionId,
        }),
      };

      const response = await api.post("/orders", orderData);

      if (response.data) {
        setSuccess("Order placed successfully!");
        clearCart();

        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(
            `/checkout/success?orderId=${response.data._id}&orderNumber=${response.data.orderNumber}`
          );
        }, 2000);
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#FAF8F5] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F6244] mx-auto"></div>
          <p className="mt-4 text-[#8B7E6A]">Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#FAF8F5] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#3D3D3D] mb-4">
            Your cart is empty
          </h1>
          <Link href="/products">
            <Button className="bg-[#7F6244] hover:bg-[#6B5139] text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#FAF8F5] to-white py-12 relative">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <Loader2 className="h-16 w-16 text-[#7F6244] animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">
              Processing Your Order
            </h2>
            <p className="text-[#8B7E6A] text-lg">
              Please wait while we process your order...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-[#7F6244] hover:text-[#6B5139] mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-[#3D3D3D]">Checkout</h1>
          <p className="text-[#8B7E6A] mt-2">Complete your order securely</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="flex items-center text-[#3D3D3D]">
                  <User className="h-5 w-5 mr-2 text-[#7F6244]" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Please provide your contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#5A5A5A]">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8B7E6A]" />
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          handleCustomerInfoChange("email", e.target.value)
                        }
                        className="pl-10 border-[#D4C5B9] focus:border-[#7F6244]"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#5A5A5A]">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#8B7E6A]" />
                      <Input
                        id="name"
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) =>
                          handleCustomerInfoChange("name", e.target.value)
                        }
                        className="pl-10 border-[#D4C5B9] focus:border-[#7F6244]"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="flex items-center text-[#3D3D3D]">
                  <MapPin className="h-5 w-5 mr-2 text-[#7F6244]" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#5A5A5A]">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-[#8B7E6A]" />
                    <Input
                      id="fullName"
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="pl-10 border-[#D4C5B9] focus:border-[#7F6244]"
                      placeholder="আপনার পূর্ণ নাম / Your Full Name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#5A5A5A]">
                    Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#8B7E6A]" />
                    <Input
                      id="address"
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="pl-10 border-[#D4C5B9] focus:border-[#7F6244]"
                      placeholder="House/Road/Village (বাড়ি/রোড/গ্রাম)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upazila" className="text-[#5A5A5A]">
                      Upazila/Thana *
                    </Label>
                    <Input
                      id="upazila"
                      type="text"
                      value={shippingAddress.upazila}
                      onChange={(e) =>
                        handleInputChange("upazila", e.target.value)
                      }
                      className="border-[#D4C5B9] focus:border-[#7F6244]"
                      placeholder="উপজেলা/থানা"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-[#5A5A5A]">
                      District *
                    </Label>
                    <Input
                      id="district"
                      type="text"
                      value={shippingAddress.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                      className="border-[#D4C5B9] focus:border-[#7F6244]"
                      placeholder="জেলা / District"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#5A5A5A]">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-[#8B7E6A]" />
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="pl-10 border-[#D4C5B9] focus:border-[#7F6244]"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#8B7E6A] mt-1">
                    Enter your mobile number for delivery contact
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="flex items-center text-[#3D3D3D]">
                  <CreditCard className="h-5 w-5 mr-2 text-[#7F6244]" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-[#D4C5B9] rounded-lg cursor-pointer hover:bg-[#FAF8F5]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#7F6244] focus:ring-[#7F6244]"
                    />
                    <div>
                      <div className="font-medium text-[#3D3D3D]">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-[#8B7E6A]">
                        Pay when your order arrives
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-[#D4C5B9] rounded-lg cursor-pointer hover:bg-[#FAF8F5]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile-banking"
                      checked={paymentMethod === "mobile-banking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#7F6244] focus:ring-[#7F6244]"
                    />
                    <div>
                      <div className="font-medium text-[#3D3D3D]">
                        bKash / Nagad / Rocket
                      </div>
                      <div className="text-sm text-[#8B7E6A]">
                        Pay via mobile banking (বিকাশ/নগদ/রকেট)
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions for Bkash/Nagad */}
            {paymentMethod === "mobile-banking" && (
              <Card className="border-[#D4C5B9]/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#3D3D3D]">
                    <CheckCircle className="h-5 w-5 mr-2 text-red-500" />
                    <span className="text-red-600">
                      Mobile Banking Payment Instruction
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Instructions */}
                  <div className="space-y-4">
                    <p className="text-[#5A5A5A]">
                      <strong>প্রিয় গ্রাহক,</strong>
                    </p>
                    <p className="text-[#5A5A5A]">
                      আমাদের শপ থেকে অর্ডার করার জন্য ধন্যবাদ! আপনার অর্ডার
                      কনফার্ম করতে নিচের ধাপগুলো অনুসরণ করুন 👇
                    </p>

                    <div className="space-y-3">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-600 mb-2">
                          বিকাশে/নগদ সেন্ড মানি করুন
                        </h4>
                        <ul className="space-y-1 text-sm text-[#5A5A5A]">
                          <li>
                            • বিকাশ/নগদ সেন্ড মানি নাম্বার:{" "}
                            <strong>01853376599</strong>
                          </li>
                          <li>
                            • টাইপ করুন: <strong>৳{total.toFixed(0)}</strong>
                          </li>
                          <li>
                            • পেমেন্টের সময় "রেফারেন্স" ঘরে আপনার নাম দিন
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-600 mb-2">
                          পেমেন্ট করার পর ইনফরমেশন দিন
                        </h4>
                        <ul className="space-y-1 text-sm text-[#5A5A5A]">
                          <li>
                            • আপনার মোবাইল নাম্বার (যে নাম্বার থেকে পেমেন্ট
                            করেছেন)
                          </li>
                          <li>• TrxID (Transaction ID)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-white p-6 rounded-lg border border-[#D4C5B9] shadow-sm">
                        <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <span className="text-[#8B7E6A] text-sm">
                            QR Code
                          </span>
                        </div>
                        <p className="text-sm text-[#8B7E6A] mb-2">
                          স্ক্যান করে পেমেন্ট বিকাশ করুন
                        </p>
                        <p className="font-bold text-[#3D3D3D]">01853376599</p>
                        <p className="text-xs text-[#8B7E6A] mt-2">
                          পেমেন্ট করতে বিকাশ অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold">
                        বিকাশ পেমেন্ট
                      </Button>
                    </div>
                  </div>

                  {/* Payment Details Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentPhone" className="text-[#5A5A5A]">
                        Your payment phone number *
                      </Label>
                      <Input
                        id="paymentPhone"
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="border-[#D4C5B9] focus:border-[#7F6244]"
                        placeholder="পেমেন্ট মোবাইল নাম্বার দিন"
                        required={paymentMethod === "mobile-banking"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionId" className="text-[#5A5A5A]">
                        TrxID (Transaction ID) *
                      </Label>
                      <Input
                        id="transactionId"
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="border-[#D4C5B9] focus:border-[#7F6244]"
                        placeholder="ট্রানজ্যাকশন আইডি দিন"
                        required={paymentMethod === "mobile-banking"}
                      />
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 text-[#7F6244] focus:ring-[#7F6244]"
                        required={paymentMethod === "mobile-banking"}
                      />
                      <span className="text-xs text-[#5A5A5A]">
                        Home Decor & More holds no responsibility for payments,
                        by proceeding you accept all of our{" "}
                        <Link
                          href="/terms"
                          className="text-[#7F6244] hover:underline"
                        >
                          terms and conditions
                        </Link>
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Notes */}
            <Card className="border-[#D4C5B9]/20">
              <CardHeader>
                <CardTitle className="text-[#3D3D3D]">Order Notes</CardTitle>
                <CardDescription>
                  Any special instructions for your order?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4C5B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F6244] focus:border-[#7F6244] resize-none"
                  rows={3}
                  placeholder="ডেলিভারীর জন্য বিশেষ নির্দেশনা, উপহার বার্তা ইত্যাদি লিখুন"
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-[#D4C5B9]/20">
              <CardContent className="pt-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 text-[#7F6244] focus:ring-[#7F6244]"
                    required
                  />
                  <div className="text-sm text-[#5A5A5A]">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#7F6244] hover:underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#7F6244] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-[#D4C5B9]/20 sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#3D3D3D]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg border border-[#D4C5B9]/20 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#FAF8F5] flex items-center justify-center">
                            <span className="text-[#8B7E6A] text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#3D3D3D] truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-[#8B7E6A]">
                          Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold text-[#7F6244]">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-[#D4C5B9] pt-4 space-y-3">
                  <div className="flex justify-between text-[#5A5A5A]">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A5A5A]">
                    <span>Shipping</span>
                    <span className="font-semibold">৳{shipping}</span>
                  </div>
                  <div className="border-t border-[#D4C5B9] pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#3D3D3D]">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-[#7F6244]">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7F6244] hover:bg-[#6B5139] text-white py-6 text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-[#8B7E6A] text-center">
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
