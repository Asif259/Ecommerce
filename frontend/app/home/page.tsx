"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Shield,
  ArrowRight,
  Heart,
  ShoppingCart,
  Sparkles,
  Home as HomeIcon,
  Palette,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Github,
  Linkedin,
  Instagram,
  Mail,
} from "lucide-react";
import Link from "next/link";
import {
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  Product,
} from "@/utils/products";
import {
  getCategories as getCategoriesAPI,
  Category,
} from "@/utils/categories";
import { useClient } from "@/hooks/useClient";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProductCounts, setCategoryProductCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const isClient = useClient();
  const testimonialRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { addItem } = useCartStore();
  const {
    addItem: addToFavorites,
    removeItem: removeFromFavorites,
    isFavorite,
  } = useFavoritesStore();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoPlay) {
      testimonialRef.current = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % 3);
      }, 5000);
    }
    return () => {
      if (testimonialRef.current) {
        clearInterval(testimonialRef.current);
      }
    };
  }, [autoPlay]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allProductsResponse, featuredResponse, categoriesData] =
        await Promise.all([
          getProducts({ limit: 12, isActive: true }),
          getFeaturedProducts(8),
          getCategoriesAPI(),
        ]);

      setProducts(allProductsResponse.products);
      setFeaturedProducts(featuredResponse.products || featuredResponse);

      // Take first 8 categories for homepage
      const limitedCategories = categoriesData.slice(0, 8);
      setCategories(limitedCategories);

      // Fetch product counts for each category
      const countPromises = limitedCategories.map(async (cat) => {
        try {
          const response = await getProductsByCategory(cat.name);
          return {
            categoryName: cat.name,
            count: response?.total || response?.products?.length || 0,
          };
        } catch (error) {
          return { categoryName: cat.name, count: 0 };
        }
      });

      const resolvedCounts = await Promise.all(countPromises);
      const countsMap: Record<string, number> = {};
      resolvedCounts.forEach(({ categoryName, count }) => {
        countsMap[categoryName] = count;
      });
      setCategoryProductCounts(countsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addItem(
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
        },
        1
      );
      setAddedToCart(product._id);
      setTimeout(() => setAddedToCart(null), 2000);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Product is out of stock");
    }
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
      toast.success(`${product.name} removed from favorites`);
    } else {
      addToFavorites({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
      });
      toast.success(`${product.name} added to favorites!`);
    }
  };

  const testimonials = [
    {
      id: 1,
      content:
        "Absolutely love the quality and design! The furniture pieces transformed my living room into a cozy sanctuary.",
      author: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
    },
    {
      id: 2,
      content:
        "Exceptional customer service and fast delivery. The wall art pieces are stunning and exactly what I was looking for!",
      author: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
    },
    {
      id: 3,
      content:
        "Beautiful products that make my house feel like home. I've recommended them to all my friends!",
      author: "Emily Davis",
      location: "Austin, TX",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Cart Notification Toast */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-0 left-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hero Section with Landscape Design */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#FAF8F5] overflow-hidden"
      >
        {/* Landscape Hero Image Container */}
        <div className="relative w-full h-[calc(100vh-4rem)]">
          {/* Hero Image */}
          <img
            src="/hero-image.png"
            alt="Home Decor And More - Beautiful Interior"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3D3D3D]/80 via-[#3D3D3D]/50 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-left"
                >
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Transform Your Space
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Home Decor And More
                  </h1>
                  <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                    Discover curated collections that transform houses into
                    homes. From elegant furniture to stunning accents, find
                    everything you need to express your style.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href="/products">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="bg-[#7F6244] hover:bg-[#6B5139] text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          Shop Collection
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/category">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-white text-white hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                        >
                          Browse Rooms
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-white">
                        10K+
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">
                        Products
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-white">
                        50K+
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">
                        Happy Homes
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-white">
                        4.9★
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">
                        Rating
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Featured Product Badge */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-6 right-6 hidden lg:block"
          >
            <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-xs">
              <p className="text-sm font-semibold text-[#3D3D3D]">
                Modern Living Room Set
              </p>
              <p className="text-xs text-[#8B7E6A]">Starting at ৳1,299</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Categories Section with Images */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-b from-[#FAF8F5] to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#3D3D3D] mb-4">
              Shop by Category
            </h2>
            <p className="text-[#5A5A5A] text-lg">
              Find exactly what you need for every room
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/category">
                <Button className="bg-[#7F6244] text-white hover:bg-[#6B5139] transition-colors font-semibold px-6 py-2 rounded-lg">
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {isClient &&
              categories.map((category, index) => {
                const productCount = categoryProductCounts[category.name] || 0;
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href="/category" className="group block">
                      <Card className="overflow-hidden border border-[#D4C5B9]/20 hover:border-[#9CA986]/50 transition-all duration-300 hover:shadow-2xl">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={
                              category.heroImage || "/placeholder-category.jpg"
                            }
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="font-bold text-lg mb-1">
                              {category.name}
                            </h3>
                            <p className="text-sm text-white/90">
                              {productCount}{" "}
                              {productCount === 1 ? "item" : "items"}
                            </p>
                          </div>
                          {category.description && (
                            <div className="absolute top-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-xs line-clamp-2">
                                {category.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Features Section with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white border-y border-[#D4C5B9]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3D3D3D] mb-4">
              Why Choose Us
            </h2>
            <p className="text-[#5A5A5A] text-lg">
              Everything you need for a beautiful home
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Premium Quality",
                description:
                  "Handpicked items crafted with care and attention to detail",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Complimentary delivery on orders over ৳50",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                description: "30-day hassle-free return policy",
              },
              {
                icon: Palette,
                title: "Design Experts",
                description: "Free consultation with our interior specialists",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="feature-card group text-center transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#9CA986]/20 to-[#D4C5B9]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-[#7F6244]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#3D3D3D]">
                  {feature.title}
                </h3>
                <p className="text-[#5A5A5A]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Featured Products Section with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#3D3D3D] mb-4">
                Featured Collections
              </h2>
              <p className="text-[#5A5A5A] text-lg">
                Curated pieces to elevate your space
              </p>
            </div>
            <Link
              href="/products"
              className="text-[#7F6244] hover:text-[#6B5139] font-semibold flex items-center group"
            >
              View all
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isClient &&
              featuredProducts.map((product, index) => (
                <div key={product._id} className="product-card">
                  <Card className="group hover:shadow-2xl transition-all duration-300 border border-[#D4C5B9]/20 overflow-hidden bg-white hover:border-[#9CA986]/30 relative">
                    <Link href={`/products/${product._id}`}>
                      <div className="aspect-square overflow-hidden relative cursor-pointer">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#FAF8F5] to-[#D4C5B9]/20 flex items-center justify-center">
                            <HomeIcon className="h-16 w-16 text-[#9CA986]" />
                          </div>
                        )}
                        {product.discount > 0 && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#8B7E6A] to-[#7F6244] text-white px-3 py-1 border-0">
                            -{product.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(product);
                      }}
                      className="absolute top-3 right-3 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg hover:scale-110 z-10"
                      variant="secondary"
                    >
                      <Heart
                        className={`h-5 w-5 text-red-500 ${
                          isFavorite(product._id) ? "fill-red-500" : ""
                        }`}
                      />
                    </Button>
                    <CardContent className="p-5">
                      <Link href={`/products/${product._id}`}>
                        <h4 className="font-semibold text-base mb-2 line-clamp-2 text-[#3D3D3D] group-hover:text-[#7F6244] transition-colors cursor-pointer">
                          {product.name}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-[#3D3D3D]">
                            ৳{product.price.toFixed(2)}
                          </p>
                          {product.discount > 0 && (
                            <p className="text-sm text-[#8B7E6A] line-through">
                              ৳
                              {(
                                product.price /
                                (1 - product.discount / 100)
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#D4C5B9] fill-current" />
                          <span className="ml-1 text-sm font-medium text-[#5A5A5A]">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={
                            product.stock === 0 || addedToCart === product._id
                          }
                          className="w-full bg-gradient-to-r from-[#7F6244] to-[#9CA986] hover:from-[#6B5139] hover:to-[#8B7E6A] text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {addedToCart === product._id
                            ? "Added!"
                            : product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Testimonials Section with Carousel & Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-b from-white to-[#FAF8F5]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#3D3D3D] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-[#5A5A5A] text-lg">
              Real stories from happy homeowners
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#D4C5B9]/20"
                >
                  <CardContent className="p-12">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonials[activeTestimonial].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-6 w-6 text-[#D4C5B9] fill-current"
                          />
                        )
                      )}
                    </div>
                    <p className="text-2xl text-[#5A5A5A] mb-8 leading-relaxed italic">
                      "{testimonials[activeTestimonial].content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#9CA986]/20 to-[#D4C5B9]/30 rounded-full flex items-center justify-center mr-6">
                        <span className="text-2xl font-bold text-[#7F6244]">
                          {testimonials[activeTestimonial].author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-[#3D3D3D]">
                          {testimonials[activeTestimonial].author}
                        </p>
                        <p className="text-lg text-[#8B7E6A]">
                          {testimonials[activeTestimonial].location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setAutoPlay(false);
                  setActiveTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  );
                }}
                className="border-[#D4C5B9] text-[#7F6244] hover:bg-[#9CA986]/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAutoPlay(false);
                      setActiveTestimonial(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? "bg-[#7F6244] w-8"
                        : "bg-[#D4C5B9] hover:bg-[#9CA986]"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setAutoPlay(false);
                  setActiveTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  );
                }}
                className="border-[#D4C5B9] text-[#7F6244] hover:bg-[#9CA986]/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoPlay(!autoPlay)}
                className="border-[#D4C5B9] text-[#7F6244] hover:bg-[#9CA986]/10 ml-4"
              >
                {autoPlay ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Animated Footer with Wave Effect */}
      <footer className="relative bg-gradient-to-b from-[#3D3D3D] to-[#2a2a2a] text-white overflow-hidden">
        {/* Animated Wave Background */}
        <div className="absolute inset-x-0 bottom-0 z-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{
                d: "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(156, 169, 134, 0.2)"
            />
            <motion.path
              initial={{
                d: "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(127, 98, 68, 0.3)"
            />
            <motion.path
              initial={{
                d: "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,234.7C96,213,192,171,288,170.7C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(212, 197, 185, 0.15)"
            />
          </svg>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 mb-4"
            >
              <img
                src="/logo.png"
                alt="Home Decor And More Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Home Decor And More
            </h3>
            <p className="text-white/60 text-center max-w-md">
              Transform your house into a home with our curated collection of
              beautiful decor and furniture.
            </p>
          </motion.div>

          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-6 mb-12"
          >
            {[
              { Icon: Github, href: "https://github.com", label: "GitHub" },
              {
                Icon: Linkedin,
                href: "https://linkedin.com",
                label: "LinkedIn",
              },
              {
                Icon: Instagram,
                href: "https://instagram.com",
                label: "Instagram",
              },
              {
                Icon: Mail,
                href: "mailto:info@feniangadgets.com",
                label: "Email",
              },
            ].map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${index * 0.1}s` }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#7F6244] hover:border-[#7F6244] transition-all duration-300 group"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </motion.a>
            ))}
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { name: "Home", href: "/home" },
              { name: "Products", href: "/products" },
              { name: "Categories", href: "/category" },
              { name: "About", href: "#about" },
              { name: "Contact", href: "#contact" },
            ].map((link, index) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white font-medium text-lg transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9CA986] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Fenian Gadgets. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-2">
              Made with{" "}
              <Heart className="inline w-3 h-3 text-red-400 fill-current" /> for
              beautiful homes
            </p>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#9CA986]/20 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute top-20 right-20 w-32 h-32 bg-[#7F6244]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-[#D4C5B9]/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </footer>
    </div>
  );
}
