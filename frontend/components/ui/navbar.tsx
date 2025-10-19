"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  Grid3X3,
  Search,
  ShoppingCart,
  User,
  Heart,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./cart-drawer";
import { useState } from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Products",
      href: "/products",
      icon: Package,
    },
    {
      label: "Category",
      href: "/category",
      icon: Grid3X3,
    },
  ];

  return (
    <nav className={cn("bg-[#7F6244] text-white shadow-lg", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-lg flex items-center justify-center">
              <span className="text-[#7F6244] font-bold text-lg">HD</span>
            </div>
            <span className="text-xl font-bold text-white">
              Home Decor And More
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-[#6B5139] text-white"
                      : "text-white/90 hover:bg-[#6B5139] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B7E6A]" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 h-10 bg-white text-[#3D3D3D] border-[#D4C5B9] focus:border-[#7F6244] focus:ring-[#7F6244]"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-[#6B5139]"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-[#6B5139]"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="text-white/90 hover:text-white hover:bg-[#6B5139] relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B7E6A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium",
                    isActive
                      ? "bg-[#6B5139] text-white"
                      : "text-white/90 hover:bg-[#6B5139] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Search */}
          <div className="px-2 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B7E6A]" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 h-10 bg-white text-[#3D3D3D] border-[#D4C5B9] focus:border-[#7F6244] focus:ring-[#7F6244]"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
