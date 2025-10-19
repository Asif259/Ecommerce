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
import { Star, Package, Heart, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  getCategories,
  getProductsByCategory,
  Product,
} from "@/utils/products";
import { useClient } from "@/hooks/useClient";
import { HomeBreadcrumb } from "@/components/ui/breadcrumbs";

export default function CategoryPage() {
  const [categories, setCategories] = useState<
    { category: string; count: number; heroImage: string }[]
  >([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const isClient = useClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      // Fetch products for each category
      const categoryPromises = categoriesData.map(async (cat) => {
        try {
          const response = await getProductsByCategory(cat.category);
          return {
            category: cat.category,
            products: response?.products?.slice(0, 4) || [], // Show 4 products per category
          };
        } catch (error) {
          console.error(
            `Error fetching products for category ${cat.category}:`,
            error
          );
          return { category: cat.category, products: [] };
        }
      });

      const resolvedCategories = await Promise.all(categoryPromises);
      const categoryProductsMap: Record<string, Product[]> = {};
      resolvedCategories.forEach(({ category, products }) => {
        categoryProductsMap[category] = products;
      });

      setCategoryProducts(categoryProductsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b border-[#D4C5B9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeBreadcrumb currentPage="Category" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#7F6244] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-white/90">Explore our home decor collections</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#3D3D3D] mb-4">
              All Categories
            </h2>
            <p className="text-[#5A5A5A]">Browse products by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isClient &&
              categories.map((categoryData, index) => {
                const isSelected = selectedCategory === categoryData.category;

                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border overflow-hidden ${
                      isSelected
                        ? "ring-2 ring-[#7F6244] shadow-lg border-[#7F6244]"
                        : "border-[#D4C5B9]/20"
                    }`}
                    onClick={() => handleCategoryClick(categoryData.category)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={categoryData.heroImage}
                        alt={categoryData.category}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">
                          {categoryData.category}
                        </h3>
                        <p className="text-sm text-white/90">
                          {categoryData.count} products
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Selected Category Products */}
        {selectedCategory && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#3D3D3D] capitalize">
                  {selectedCategory} Products
                </h3>
                <p className="text-[#5A5A5A]">
                  {categoryProducts[selectedCategory]?.length || 0} products in
                  this category
                </p>
              </div>
              <Link
                href={`/products?category=${encodeURIComponent(
                  selectedCategory
                )}`}
                className="text-[#7F6244] hover:text-[#6B5139] font-medium flex items-center"
              >
                View all {selectedCategory} products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isClient &&
                categoryProducts[selectedCategory]?.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-lg transition-shadow duration-300 border border-[#D4C5B9]/20"
                  >
                    <div className="aspect-square overflow-hidden rounded-t-lg relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FAF8F5] flex items-center justify-center">
                          <Package className="h-16 w-16 text-[#9CA986]" />
                        </div>
                      )}
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-[#8B7E6A]">
                          -{product.discount}%
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-[#FAF8F5] text-[#7F6244]"
                        variant="secondary"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2 text-[#3D3D3D]">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-bold text-[#3D3D3D]">
                          ৳{product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#D4C5B9] fill-current" />
                          <span className="ml-1 text-sm text-[#5A5A5A]">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <Button className="w-full bg-[#7F6244] hover:bg-[#6B5139]">
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Category Stats */}
        <div className="bg-white rounded-lg p-8 border border-[#D4C5B9]/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">
              Category Overview
            </h2>
            <p className="text-[#5A5A5A]">
              Total products across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9CA986]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-[#7F6244]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D] mb-2">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </h3>
              <p className="text-[#5A5A5A]">Total Products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4C5B9]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-[#8B7E6A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D] mb-2">
                {categories.length}
              </h3>
              <p className="text-[#5A5A5A]">Categories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9CA986]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#7F6244]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D] mb-2">4.8</h3>
              <p className="text-[#5A5A5A]">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
