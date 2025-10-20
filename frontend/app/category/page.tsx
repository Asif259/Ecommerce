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

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({});
  const [categoryProductCounts, setCategoryProductCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
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
    const newCategory =
      selectedCategory?._id === category._id ? null : category;
    setSelectedCategory(newCategory);

    // Scroll to category detail card when a category is selected
    if (newCategory) {
      setTimeout(() => {
        const detailCard = document.getElementById("category-detail-card");
        if (detailCard) {
          detailCard.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    const isSelected = selectedCategory?._id === category._id;
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
                          className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border overflow-hidden group ${
                            isSelected
                              ? "ring-2 ring-[#7F6244] shadow-2xl border-[#7F6244] transform scale-105"
                              : "border-[#D4C5B9]/20 hover:border-[#9CA986]/50"
                          }`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                category.heroImage ||
                                "/placeholder-category.jpg"
                              }
                              alt={category.name}
                              className={`w-full h-full object-cover transition-transform duration-500 ${
                                isSelected
                                  ? "scale-110"
                                  : "group-hover:scale-110"
                              }`}
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
                                {isSelected && (
                                  <Badge className="bg-white text-[#7F6244] hover:bg-white">
                                    Selected
                                  </Badge>
                                )}
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

        {/* Selected Category Details & Products */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {/* Category Detail Card */}
            <Card
              className="mb-8 border-[#9CA986]/30 bg-gradient-to-r from-white to-[#FAF8F5]"
              id="category-detail-card"
            >
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <Badge className="bg-[#7F6244] text-white mr-3">
                        Featured Category
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-[#3D3D3D] mb-4">
                      {selectedCategory.name}
                    </h3>
                    {selectedCategory.description && (
                      <p className="text-[#5A5A5A] text-lg mb-6 leading-relaxed">
                        {selectedCategory.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-[#7F6244]" />
                        <span className="text-[#5A5A5A]">
                          {categoryProductCounts[selectedCategory.name] || 0}{" "}
                          Products
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-[#D4C5B9] fill-current" />
                        <span className="text-[#5A5A5A]">Top Rated</span>
                      </div>
                    </div>
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        selectedCategory.name
                      )}`}
                    >
                      <Button className="bg-[#7F6244] hover:bg-[#6B5139] text-white">
                        View All Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={
                        selectedCategory.heroImage ||
                        "/placeholder-category.jpg"
                      }
                      alt={selectedCategory.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products in Category */}
            <div>
              <h4 className="text-2xl font-bold text-[#3D3D3D] mb-6">
                Featured Products in {selectedCategory.name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isClient &&
                  categoryProducts[selectedCategory.name]?.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/products/${product._id}`}>
                        <Card className="group hover:shadow-2xl transition-all duration-300 border border-[#D4C5B9]/20 hover:border-[#9CA986]/50 cursor-pointer">
                          <div className="aspect-square overflow-hidden rounded-t-lg relative">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#FAF8F5] to-[#D4C5B9]/20 flex items-center justify-center">
                                <Package className="h-16 w-16 text-[#9CA986]" />
                              </div>
                            )}
                            {product.discount > 0 && (
                              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#8B7E6A] to-[#7F6244] text-white border-0">
                                -{product.discount}% OFF
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-[#7F6244] rounded-full w-10 h-10 p-0"
                              variant="secondary"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                          <CardContent className="p-5">
                            <h4 className="font-semibold text-base mb-2 line-clamp-2 text-[#3D3D3D] group-hover:text-[#7F6244] transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-2xl font-bold text-[#3D3D3D]">
                                ৳{product.price.toFixed(2)}
                              </p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#D4C5B9] fill-current" />
                                <span className="ml-1 text-sm font-medium text-[#5A5A5A]">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <Button
                              className="w-full bg-gradient-to-r from-[#7F6244] to-[#9CA986] hover:from-[#6B5139] hover:to-[#8B7E6A] text-white font-semibold"
                              onClick={(e) => e.preventDefault()}
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
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
    </div>
  );
}
