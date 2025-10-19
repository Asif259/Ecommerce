"use client";

import { useState, useEffect, use } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Package,
  Edit,
  Save,
  X,
  Trash2,
  Eye,
  Star,
  DollarSign,
  ShoppingCart,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import {
  getProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/utils/products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isLoggedIn, verify } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Unwrap the params Promise
  const resolvedParams = use(params);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    isActive: true,
    discount: 0,
    sku: "",
    images: [] as string[],
    specifications: {} as Record<string, any>,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      verify()
        .then((authenticated) => {
          if (!authenticated) {
            router.push("/admin/login");
          }
        })
        .catch(() => {
          router.push("/admin/login");
        });
    }
  }, [mounted, verify, router]);

  useEffect(() => {
    if (isLoggedIn && resolvedParams.id) {
      fetchProduct();
    }
  }, [isLoggedIn, resolvedParams.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(resolvedParams.id);
      setProduct(data);
      setEditData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        isActive: data.isActive,
        discount: data.discount,
        sku: data.sku || "",
        images: data.images || [],
        specifications: data.specifications || {},
      });
    } catch (err) {
      setError("Error fetching product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!product) return;

    try {
      const updatedProduct = await updateProduct(product._id, editData);
      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (err) {
      setError("Error updating product");
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;

    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteProduct(product._id);
      router.push("/admin/products");
    } catch (err) {
      setError("Error deleting product");
      console.error("Error deleting product:", err);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>Product not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product?.name || "Product"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  SKU: {product?.sku || "No SKU"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProduct}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No images available
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Product Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium">{product.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Description
                    </Label>
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1">{product.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Category
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.category}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        SKU
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.sku}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              sku: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 font-mono text-sm">
                          {product.sku || "No SKU"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                {product?.specifications &&
                Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key}>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <p className="mt-1">{String(value)}</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No specifications available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Stats & Actions */}
          <div className="space-y-6">
            {/* Pricing & Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing & Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Price
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value),
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-2xl font-bold">
                        ৳{product.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Discount
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editData.discount}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            discount: parseInt(e.target.value),
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{product.discount}%</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Stock Quantity
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        value={editData.stock}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            stock: parseInt(e.target.value),
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1">
                        <p
                          className={`text-lg font-bold ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.stock === 0
                            ? "Out of stock"
                            : product.stock < 10
                            ? "Low stock"
                            : "In stock"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    {isEditing ? (
                      <select
                        value={editData.isActive ? "active" : "inactive"}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            isActive: e.target.value === "active",
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <div className="mt-1">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews & Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {product.reviewCount} review
                    {product.reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Product Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Product Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(product.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(product.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
