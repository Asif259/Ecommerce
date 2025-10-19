"use client";

import { useFavoritesStore } from "@/stores/favoritesStore";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { Button } from "./button";
import { FavoriteItem } from "./favorite-item";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const { items, removeItem, clearFavorites } = useFavoritesStore();
  const { addItem: addToCart } = useCartStore();

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

  const isEmpty = items.length === 0;

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart(
        {
          _id: item.productId,
          name: item.name,
          price: item.price,
          images: item.image ? [item.image] : [],
          stock: 999, // We don't have stock info in favorites, assume available
        },
        1
      );
    });
    toast.success(
      `Added ${items.length} item${items.length > 1 ? "s" : ""} to cart!`
    );
  };

  const handleClearFavorites = () => {
    const count = items.length;
    clearFavorites();
    toast.success(
      `Cleared ${count} item${count > 1 ? "s" : ""} from favorites`
    );
  };

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
                My Favorites ({items.length})
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

            {/* Favorites Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="h-24 w-24 text-[#D4C5B9] mb-4" />
                  <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-[#8B7E6A] text-sm mb-6">
                    Start adding products to your wishlist!
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
                    <FavoriteItem
                      key={item.productId}
                      item={item}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="border-t border-[#D4C5B9] p-6 space-y-4 bg-[#FAF8F5]">
                {/* Add All to Cart Button */}
                <Button
                  className="w-full bg-[#7F6244] hover:bg-[#6B5139] text-white py-6 text-base font-semibold"
                  onClick={handleAddAllToCart}
                >
                  Add All to Cart ({items.length} items)
                </Button>

                {/* Clear Favorites Button */}
                <Button
                  variant="outline"
                  className="w-full border-[#D4C5B9] text-[#8B7E6A] hover:bg-white"
                  onClick={handleClearFavorites}
                >
                  Clear Favorites
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
