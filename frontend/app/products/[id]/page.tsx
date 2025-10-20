"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Star,
  ShoppingCart,
  Heart,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProduct, getProducts, Product } from "@/utils/products";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { HomeBreadcrumb } from "@/components/ui/breadcrumbs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();
  const {
    addItem: addToFavorites,
    removeItem: removeFromFavorites,
    isFavorite,
  } = useFavoritesStore();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productId = params.id as string;

        // Fetch product details
        const productData = await getProduct(productId);
        setProduct(productData);

        // Fetch related products from the same category
        const relatedData = await getProducts({
          category: productData.category,
          isActive: true,
          limit: 4,
        });

        // Filter out the current product
        const filtered = relatedData.products.filter(
          (p) => p._id !== productId
        );
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductData();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock > 0 && quantity <= product.stock) {
      addItem(
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
        },
        quantity
      );
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Insufficient stock");
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

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

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <div className="bg-white py-3 border-b border-[#D4C5B9]/20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-6 bg-[#FAF8F5] rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-[#FAF8F5] rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-[#FAF8F5] rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-[#FAF8F5] rounded w-1/2 animate-pulse"></div>
              <div className="h-24 bg-[#FAF8F5] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <Package className="h-24 w-24 text-[#D4C5B9] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">
              Product Not Found
            </h2>
            <p className="text-[#8B7E6A] mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button className="bg-[#7F6244] hover:bg-[#6B5139]">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finalPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumbs */}
      <div className="bg-white py-3 border-b border-[#D4C5B9]/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#8B7E6A] hover:text-[#7F6244]">
              Home
            </Link>
            <span className="text-[#D4C5B9]">/</span>
            <Link
              href="/products"
              className="text-[#8B7E6A] hover:text-[#7F6244]"
            >
              Products
            </Link>
            <span className="text-[#D4C5B9]">/</span>
            <span className="text-[#3D3D3D] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-[#7F6244] hover:text-[#6B5139] mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-lg overflow-hidden border border-[#D4C5B9]/20"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#FAF8F5]">
                  <Package className="h-32 w-32 text-[#9CA986]" />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#7F6244]"
                        : "border-[#D4C5B9]/20 hover:border-[#D4C5B9]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Name */}
            <h1 className="text-4xl font-bold text-[#3D3D3D]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-[#D4C5B9] fill-[#D4C5B9]"
                        : "text-[#D4C5B9]/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#5A5A5A]">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#7F6244]">
                ৳{finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-2xl text-[#8B7E6A] line-through">
                    ৳{product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">
                Description
              </h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#3D3D3D]">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#D4C5B9] rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="hover:bg-[#FAF8F5]"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 font-semibold text-[#3D3D3D]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="hover:bg-[#FAF8F5]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-[#8B7E6A]">
                  Max: {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className="flex-1 bg-[#7F6244] hover:bg-[#6B5139] text-white py-6 text-lg disabled:opacity-50"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleToggleFavorite}
                variant="outline"
                className="border-[#D4C5B9] hover:bg-[#FAF8F5] py-6 px-6"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-[#7F6244]"
                  }`}
                />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D4C5B9]">
              <div className="flex flex-col items-center text-center p-4">
                <Truck className="h-8 w-8 text-[#7F6244] mb-2" />
                <span className="text-sm font-medium text-[#3D3D3D]">
                  Fast Delivery
                </span>
                <span className="text-xs text-[#8B7E6A]">2-5 days</span>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Shield className="h-8 w-8 text-[#7F6244] mb-2" />
                <span className="text-sm font-medium text-[#3D3D3D]">
                  Secure Payment
                </span>
                <span className="text-xs text-[#8B7E6A]">100% Safe</span>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Package className="h-8 w-8 text-[#7F6244] mb-2" />
                <span className="text-sm font-medium text-[#3D3D3D]">
                  Easy Returns
                </span>
                <span className="text-xs text-[#8B7E6A]">7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <Card className="mb-16 border-[#D4C5B9]/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#3D3D3D] mb-6">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-[#D4C5B9]/20"
                      >
                        <span className="font-medium text-[#3D3D3D] capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-[#5A5A5A]">{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-[#3D3D3D] mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  href={`/products/${relatedProduct._id}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-[#D4C5B9]/20 h-full">
                    <div className="aspect-square overflow-hidden rounded-t-lg relative bg-[#FAF8F5]">
                      {relatedProduct.images &&
                      relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-[#9CA986]" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2 text-[#3D3D3D]">
                        {relatedProduct.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-[#7F6244]">
                          ৳{relatedProduct.price.toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#D4C5B9] fill-current" />
                          <span className="ml-1 text-sm text-[#5A5A5A]">
                            {relatedProduct.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
