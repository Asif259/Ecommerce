"use client";

import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "./button";
import { CartItem } from "./cart-item";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const total = getTotal();
  const isEmpty = items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#D4C5B9]">
              <h2 className="text-xl font-bold text-[#3D3D3D]">
                Shopping Cart ({items.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-[#FAF8F5]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-24 w-24 text-[#D4C5B9] mb-4" />
                  <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-[#8B7E6A] text-sm mb-6">
                    Add some products to get started!
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-[#7F6244] hover:bg-[#6B5139] text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="border-t border-[#D4C5B9] p-6 space-y-4 bg-[#FAF8F5]">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-[#3D3D3D]">Subtotal</span>
                  <span className="font-bold text-[#7F6244]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-[#7F6244] hover:bg-[#6B5139] text-white py-6 text-base font-semibold"
                  onClick={() => {
                    // TODO: Navigate to checkout page
                    alert("Checkout functionality coming soon!");
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  className="w-full border-[#D4C5B9] text-[#8B7E6A] hover:bg-white"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
