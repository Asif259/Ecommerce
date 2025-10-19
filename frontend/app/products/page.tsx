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
import { Input } from "@/components/ui/input";
import {
  Star,
  Package,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  ShoppingCart,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  getProducts,
  getCategories,
  Product,
  ProductAPI,
} from "@/utils/products";
import { useClient } from "@/hooks/useClient";
import { HomeBreadcrumb } from "@/components/ui/breadcrumbs";
import { useCartStore } from "@/stores/cartStore";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [allProductsCount, setAllProductsCount] = useState(0);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const isClient = useClient();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, sortBy]);

  // Separate effect for categories and total count to prevent unnecessary re-fetching
  useEffect(() => {
    const fetchCategoriesAndTotal = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);

        // Get total count of all active products
        const allProductsResponse = await getProducts({
          isActive: true,
          limit: 1,
        });
        setAllProductsCount(allProductsResponse.total || 0);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setAllProductsCount(0);
      }
    };

    if (categories.length === 0) {
      fetchCategoriesAndTotal();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams: any = {
        limit: 32,
        page: currentPage,
        isActive: true,
      };

      // Add category filter only if a specific category is selected (not null)
      if (selectedCategory !== null && selectedCategory.trim() !== "") {
        queryParams.category = selectedCategory.trim();
        console.log("Filtering by category:", selectedCategory);
      } else {
        console.log("Showing all products");
      }

      const productsResponse = await getProducts(queryParams);

      console.log("Products response:", productsResponse);
      console.log(
        "Number of products returned:",
        productsResponse.products?.length
      );
      console.log("Total products:", productsResponse.total);
      console.log("Current page:", currentPage);
      console.log("Limit:", queryParams.limit);

      setProducts(productsResponse.products || []);
      setTotalPages(Math.ceil((productsResponse.total || 0) / 32));
      setTotalProducts(productsResponse.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set fallback values
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      fetchData(); // Reload with current category filter
      return;
    }

    try {
      setIsSearching(true);

      // Use the main products API with search parameter instead of separate search API
      const searchQuery: any = {
        search: term.trim(),
        page: currentPage,
        limit: 32,
        isActive: true,
      };

      // Add category filter if a specific category is selected
      if (selectedCategory !== null && selectedCategory.trim() !== "") {
        searchQuery.category = selectedCategory.trim();
      }

      const response = await getProducts(searchQuery);
      setSearchResults(response.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Clear search when changing category
    setSearchTerm("");
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
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
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b border-[#D4C5B9]/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeBreadcrumb currentPage="Products" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#7F6244] text-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-white/90">
            Discover our complete collection of home decor
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-3 lg:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-[#D4C5B9]/20">
              <h3 className="font-semibold mb-3 text-[#3D3D3D]">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B7E6A]" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="pl-10 border-[#D4C5B9] focus:border-[#7F6244] focus:ring-[#7F6244]"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-lg border border-[#D4C5B9]/20">
              <h3 className="font-semibold mb-3 text-[#3D3D3D]">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === null
                      ? "bg-[#9CA986]/20 text-[#7F6244] border border-[#7F6244]"
                      : "hover:bg-[#FAF8F5] border border-transparent text-[#3D3D3D]"
                  }`}
                >
                  All Products ({allProductsCount})
                </button>
                {isClient &&
                  categories.map((categoryData, index) => (
                    <button
                      key={categoryData.category}
                      onClick={() =>
                        handleCategoryChange(categoryData.category)
                      }
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === categoryData.category
                          ? "bg-[#9CA986]/20 text-[#7F6244] border border-[#7F6244]"
                          : "hover:bg-[#FAF8F5] border border-transparent text-[#3D3D3D]"
                      }`}
                    >
                      {categoryData.category} ({categoryData.count})
                    </button>
                  ))}
              </div>

              {/* Selected Category Info */}
              {selectedCategory !== null && (
                <div className="mt-4 p-3 bg-[#9CA986]/10 border border-[#9CA986]/30 rounded-md">
                  <p className="text-sm text-[#7F6244]">
                    <strong>Filtered by:</strong> {selectedCategory}
                  </p>
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="text-xs text-[#7F6244] hover:text-[#6B5139] underline mt-1"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="bg-white p-4 rounded-lg border border-[#D4C5B9]/20">
              <h3 className="font-semibold mb-3 text-[#3D3D3D]">Price Range</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        min: Number(e.target.value),
                      })
                    }
                    className="text-sm border-[#D4C5B9] focus:border-[#7F6244] focus:ring-[#7F6244]"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className="text-sm border-[#D4C5B9] focus:border-[#7F6244] focus:ring-[#7F6244]"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full bg-[#7F6244] hover:bg-[#6B5139]"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-[#D4C5B9]/20">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-[#7F6244] hover:bg-[#6B5139]"
                        : "border-[#D4C5B9] text-[#7F6244]"
                    }
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-[#7F6244] hover:bg-[#6B5139]"
                        : "border-[#D4C5B9] text-[#7F6244]"
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-[#5A5A5A]">
                  {totalProducts} products found
                  {selectedCategory !== null && (
                    <span className="text-[#7F6244] ml-1 font-medium">
                      in "{selectedCategory}"
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#5A5A5A]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-[#D4C5B9] rounded-md px-3 py-1 text-sm text-[#3D3D3D] focus:border-[#7F6244] focus:ring-[#7F6244]"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="createdAt">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="animate-pulse border border-[#D4C5B9]/20"
                  >
                    <div className="aspect-square bg-[#FAF8F5] rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-[#FAF8F5] rounded mb-2"></div>
                      <div className="h-4 bg-[#FAF8F5] rounded w-16"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-[#D4C5B9]/20"
                  >
                    <div className="aspect-square overflow-hidden rounded-t-lg relative flex items-center justify-center bg-[#FAF8F5]">
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
                    <CardContent className="p-4 flex flex-col">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2 flex-shrink-0 text-[#3D3D3D]">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mb-2 flex-shrink-0">
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
                      <div className="mt-auto">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            product.stock === 0 || addedToCart === product._id
                          }
                          className="w-full bg-[#7F6244] hover:bg-[#6B5139] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {addedToCart === product._id
                            ? "Added!"
                            : product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-lg transition-shadow duration-300 border border-[#D4C5B9]/20"
                  >
                    <div className="flex">
                      <div className="w-32 h-32 overflow-hidden rounded-l-lg">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#FAF8F5] flex items-center justify-center">
                            <Package className="h-8 w-8 text-[#9CA986]" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2 text-[#3D3D3D]">
                              {product.name}
                            </h4>
                            <p className="text-[#5A5A5A] text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-4">
                              <p className="text-xl font-bold text-[#3D3D3D]">
                                ৳{product.price.toFixed(2)}
                              </p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#D4C5B9] fill-current" />
                                <span className="ml-1 text-sm text-[#5A5A5A]">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="opacity-0 group-hover:opacity-100 transition-opacity border-[#D4C5B9] text-[#7F6244] hover:bg-[#FAF8F5]"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={
                                product.stock === 0 ||
                                addedToCart === product._id
                              }
                              size="sm"
                              className="bg-[#7F6244] hover:bg-[#6B5139] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              {addedToCart === product._id
                                ? "Added!"
                                : product.stock === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-thin scrollbar-thumb-[#D4C5B9] scrollbar-track-transparent">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex-shrink-0 border-[#D4C5B9] text-[#7F6244] hover:bg-[#FAF8F5]"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`flex-shrink-0 ${
                        currentPage === i + 1
                          ? "bg-[#7F6244] hover:bg-[#6B5139]"
                          : "border-[#D4C5B9] text-[#7F6244] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex-shrink-0 border-[#D4C5B9] text-[#7F6244] hover:bg-[#FAF8F5]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
