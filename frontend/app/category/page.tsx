"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Package,
  Heart,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getProductsByCategory, Product } from "@/utils/products";
import { getCategories, Category } from "@/utils/categories";
import { useClient } from "@/hooks/useClient";
import { HomeBreadcrumb } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { Footer } from "@/components/ui/footer";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({});
  const [categoryProductCounts, setCategoryProductCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const isClient = useClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories from backend
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      // Fetch products for each category to get counts
      const categoryPromises = categoriesData.map(async (cat) => {
        try {
          const response = await getProductsByCategory(cat.name);
          return {
            categoryName: cat.name,
            products: response?.products?.slice(0, 4) || [], // Show 4 products per category
            count: response?.total || response?.products?.length || 0,
          };
        } catch (error) {
          console.error(
            `Error fetching products for category ${cat.name}:`,
            error
          );
          return { categoryName: cat.name, products: [], count: 0 };
        }
      });

      const resolvedCategories = await Promise.all(categoryPromises);
      const categoryProductsMap: Record<string, Product[]> = {};
      const categoryCountsMap: Record<string, number> = {};

      resolvedCategories.forEach(({ categoryName, products, count }) => {
        categoryProductsMap[categoryName] = products;
        categoryCountsMap[categoryName] = count;
      });

      setCategoryProducts(categoryProductsMap);
      setCategoryProductCounts(categoryCountsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    // Redirect to products page with category filter
    window.location.href = `/products?category=${encodeURIComponent(
      category.name
    )}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b border-[#D4C5B9]/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeBreadcrumb currentPage="Categories" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#7F6244] to-[#6B5139] text-white py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Shop by Category
              </h1>
            </div>
            <p className="text-white/90 text-lg">
              Explore our carefully curated home decor collections
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-24 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F6244]"></div>
            <p className="mt-4 text-[#5A5A5A]">Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl font-bold text-[#3D3D3D] mb-4">
                  All Categories
                </h2>
                <p className="text-[#5A5A5A] text-lg">
                  Browse products by category
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isClient &&
                  categories.map((category, index) => {
                    const productCount =
                      categoryProductCounts[category.name] || 0;

                    return (
                      <motion.div
                        key={category._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          id="category-card"
                          className="cursor-pointer transition-all duration-300 hover:shadow-2xl border overflow-hidden group border-[#D4C5B9]/20 hover:border-[#9CA986]/50"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                category.heroImage ||
                                "/placeholder-category.jpg"
                              }
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="font-bold text-xl mb-1">
                                {category.name}
                              </h3>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-white/90">
                                  {productCount}{" "}
                                  {productCount === 1 ? "product" : "products"}
                                </p>
                              </div>
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
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {/* Category Stats */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl p-8 border border-[#9CA986]/20 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#3D3D3D] mb-2">
                Category Overview
              </h2>
              <p className="text-[#5A5A5A] text-lg">
                Explore our complete collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#9CA986]/20 to-[#9CA986]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-[#7F6244]" />
                </div>
                <h3 className="text-3xl font-bold text-[#3D3D3D] mb-2">
                  {Object.values(categoryProductCounts).reduce(
                    (sum, count) => sum + count,
                    0
                  )}
                </h3>
                <p className="text-[#5A5A5A] font-medium">Total Products</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4C5B9]/40 to-[#D4C5B9]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-[#8B7E6A]" />
                </div>
                <h3 className="text-3xl font-bold text-[#3D3D3D] mb-2">
                  {categories.length}
                </h3>
                <p className="text-[#5A5A5A] font-medium">Active Categories</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#9CA986]/20 to-[#9CA986]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-[#7F6244] fill-current" />
                </div>
                <h3 className="text-3xl font-bold text-[#3D3D3D] mb-2">4.8</h3>
                <p className="text-[#5A5A5A] font-medium">Average Rating</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
