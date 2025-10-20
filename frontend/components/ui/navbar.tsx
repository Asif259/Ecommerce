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
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { CartDrawer } from "./cart-drawer";
import { FavoritesDrawer } from "./favorites-drawer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount } = useCartStore();
  const { getItemCount: getFavoritesCount } = useFavoritesStore();
  const itemCount = mounted ? getItemCount() : 0;
  const favoritesCount = mounted ? getFavoritesCount() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-[#7F6244] text-white shadow-lg transition-all duration-300",
          isScrolled && "shadow-2xl backdrop-blur-lg bg-[#7F6244]/95",
          className
        )}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-12 h-12 flex items-center justify-center"
              >
                <img
                  src="/logo.png"
                  alt="Home Decor And More Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <span className="text-md sm:text-xl lg:text-2xl font-bold text-white group-hover:text-[#D4C5B9] transition-colors">
                Home Decor And More
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                        isActive
                          ? "bg-[#6B5139] text-white shadow-lg"
                          : "text-white/90 hover:bg-[#6B5139]/80 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-[#6B5139] rounded-lg -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B7E6A] group-focus-within:text-[#7F6244] transition-colors" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 pr-4 h-10 bg-white/95 backdrop-blur-sm text-[#3D3D3D] border-[#D4C5B9] focus:border-[#7F6244] focus:ring-2 focus:ring-[#7F6244]/20 rounded-lg transition-all duration-200 hover:bg-white"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Desktop Icons */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavoritesOpen(true)}
                  className="text-white/90 hover:text-white hover:bg-[#6B5139] relative rounded-lg hidden sm:flex"
                >
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8B7E6A] to-[#7F6244] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    >
                      {favoritesCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-[#6B5139] rounded-lg hidden sm:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(true)}
                  className="text-white/90 hover:text-white hover:bg-[#6B5139] relative rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8B7E6A] to-[#7F6244] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/90 hover:text-white hover:bg-[#6B5139] lg:hidden rounded-lg ml-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/10 bg-[#7F6244]/98 backdrop-blur-lg"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                {/* Mobile Navigation Links */}
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isActive
                            ? "bg-[#6B5139] text-white shadow-lg"
                            : "text-white/90 hover:bg-[#6B5139]/80 hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-3"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B7E6A]" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 pr-4 h-11 bg-white/95 text-[#3D3D3D] border-[#D4C5B9] focus:border-[#7F6244] focus:ring-2 focus:ring-[#7F6244]/20 rounded-lg"
                    />
                  </div>
                </motion.div>

                {/* Mobile Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.1 }}
                  className="flex gap-3 pt-3 border-t border-white/10"
                >
                  <Button
                    variant="outline"
                    onClick={() => setIsFavoritesOpen(true)}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white relative rounded-lg"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                    {favoritesCount > 0 && (
                      <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                        {favoritesCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-lg"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </>
  );
}
