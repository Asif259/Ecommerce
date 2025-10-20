"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/utils/products";
import { Package, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  products: Product[];
  loading: boolean;
  query: string;
  isOpen: boolean;
  onProductClick: (productId: string) => void;
  selectedIndex: number;
  className?: string;
}

export function SearchSuggestions({
  products,
  loading,
  query,
  isOpen,
  onProductClick,
  selectedIndex,
  className,
}: SearchSuggestionsProps) {
  if (!isOpen || query.length < 2) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-[#D4C5B9]/20 overflow-hidden z-50 max-h-[400px] overflow-y-auto",
          className
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-[#7F6244] animate-spin" />
            <span className="ml-3 text-[#5A5A5A]">Searching...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="py-2">
            {products.map((product, index) => (
              <button
                key={product._id}
                onClick={() => onProductClick(product._id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F5] transition-colors text-left",
                  selectedIndex === index && "bg-[#FAF8F5]"
                )}
              >
                {/* Product Image */}
                <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-[#FAF8F5] border border-[#D4C5B9]/20">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-[#9CA986]" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3D3D3D] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#8B7E6A]">{product.category}</p>
                </div>

                {/* Product Price */}
                <div className="flex-shrink-0">
                  <p className="text-sm font-bold text-[#7F6244]">
                    ৳{product.price.toFixed(2)}
                  </p>
                  {product.discount > 0 && (
                    <p className="text-xs text-[#8B7E6A] line-through">
                      ৳
                      {(product.price / (1 - product.discount / 100)).toFixed(
                        2
                      )}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Search className="h-12 w-12 text-[#D4C5B9] mb-3" />
            <p className="text-[#5A5A5A] text-sm text-center">
              No products found for "{query}"
            </p>
            <p className="text-[#8B7E6A] text-xs text-center mt-1">
              Try searching with different keywords
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
