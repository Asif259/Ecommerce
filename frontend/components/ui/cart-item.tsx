"use client";

import { CartItem as CartItemType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const subtotal = item.price * item.quantity;

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
        <h3 className="font-medium text-[#3D3D3D] text-sm truncate">
          {item.name}
        </h3>
        <p className="text-[#7F6244] font-semibold text-sm mt-1">
          ${item.price.toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrease}
            className="h-7 w-7 p-0 border-[#D4C5B9] hover:bg-[#FAF8F5]"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium text-[#3D3D3D] min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrease}
            className="h-7 w-7 p-0 border-[#D4C5B9] hover:bg-[#FAF8F5]"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-[#3D3D3D]">${subtotal.toFixed(2)}</p>
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
