"use client";

import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore();

  const total = getTotal();
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[#7F6244] hover:text-[#6B5139] mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-[#3D3D3D]">Shopping Cart</h1>
          <p className="text-[#8B7E6A] mt-2">
            {isEmpty
              ? "Your cart is empty"
              : `${items.length} items in your cart`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty Cart State */
          <Card className="border-[#D4C5B9]/20">
            <CardContent className="py-20 text-center">
              <ShoppingBag className="h-32 w-32 text-[#D4C5B9] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#3D3D3D] mb-4">
                Your cart is empty
              </h2>
              <p className="text-[#8B7E6A] mb-8">
                Looks like you haven't added anything to your cart yet
              </p>
              <Link href="/products">
                <Button className="bg-[#7F6244] hover:bg-[#6B5139] text-white px-8 py-6 text-base">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-[#D4C5B9]/20 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative w-32 h-32 flex-shrink-0 bg-[#FAF8F5] rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#8B7E6A]">
                              <ShoppingBag className="h-12 w-12" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-[#3D3D3D] mb-2">
                            {item.name}
                          </h3>
                          <p className="text-[#7F6244] font-bold text-xl mb-4">
                            ${item.price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                className="h-9 w-9 p-0 border-[#D4C5B9] hover:bg-[#FAF8F5]"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-base font-semibold text-[#3D3D3D] min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                className="h-9 w-9 p-0 border-[#D4C5B9] hover:bg-[#FAF8F5]"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.productId)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-[#8B7E6A] mb-2">
                            Subtotal
                          </p>
                          <p className="text-2xl font-bold text-[#3D3D3D]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-[#D4C5B9]/20 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#3D3D3D] mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[#5A5A5A]">
                      <span>Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A5A5A]">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-[#5A5A5A]">
                      <span>Tax</span>
                      <span className="font-semibold">
                        ${(total * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-[#D4C5B9] pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#3D3D3D]">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-[#7F6244]">
                          ${(total * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#7F6244] hover:bg-[#6B5139] text-white py-6 text-base font-semibold mb-4"
                    onClick={() => {
                      // TODO: Navigate to checkout page
                      alert("Checkout functionality coming soon!");
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full border-[#D4C5B9] text-[#7F6244] hover:bg-[#FAF8F5]"
                    >
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-[#D4C5B9]">
                    <p className="text-sm text-[#8B7E6A] mb-3">We Accept:</p>
                    <div className="flex gap-2 flex-wrap">
                      {["Visa", "Mastercard", "PayPal", "Apple Pay"].map(
                        (method) => (
                          <div
                            key={method}
                            className="px-3 py-2 bg-[#FAF8F5] rounded border border-[#D4C5B9] text-xs font-medium text-[#5A5A5A]"
                          >
                            {method}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
