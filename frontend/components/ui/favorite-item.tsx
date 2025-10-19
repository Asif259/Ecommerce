"use client";

import { FavoriteItem as FavoriteItemType } from "@/types/favorites";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCartStore } from "@/stores/cartStore";

interface FavoriteItemProps {
  item: FavoriteItemType;
  onRemove: (productId: string) => void;
}

export function FavoriteItem({ item, onRemove }: FavoriteItemProps) {
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = () => {
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
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-[#D4C5B9] last:border-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-[#FAF8F5] rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B7E6A]">
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[#3D3D3D] text-sm line-clamp-2">
          {item.name}
        </h3>
        <p className="text-[#7F6244] font-semibold text-sm mt-1">
          ৳{item.price.toFixed(2)}
        </p>

        {/* Add to Cart Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToCart}
          className="mt-2 h-8 text-xs border-[#7F6244] text-[#7F6244] hover:bg-[#7F6244] hover:text-white"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </div>

      {/* Remove Button */}
      <div className="flex flex-col items-end justify-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
