import api from "./api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  discount: number;
  sku: string;
  images: string[];
  rating: number;
  reviewCount: number;
  specifications: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive?: boolean;
  discount?: number;
  sku?: string;
  images?: string[];
  specifications?: Record<string, any>;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
  discount?: number;
  sku?: string;
  images?: string[];
  specifications?: Record<string, any>;
}

export interface ProductQueryDto {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface FeaturedProductsResponse {
  products: Product[];
  total: number;
}

// Get all products with optional query parameters
export const getProducts = async (
  query?: ProductQueryDto
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  if (query) {
    if (query.category) params.append("category", query.category);
    if (query.search) params.append("search", query.search);
    if (query.minPrice) params.append("minPrice", query.minPrice.toString());
    if (query.maxPrice) params.append("maxPrice", query.maxPrice.toString());
    if (query.isActive !== undefined)
      params.append("isActive", query.isActive.toString());
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
  }

  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

// Get a single product by ID
export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Create a new product
export const createProduct = async (
  productData: CreateProductDto
): Promise<Product> => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: UpdateProductDto
): Promise<Product> => {
  const response = await api.patch(`/products/${id}`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// Get featured products
export const getFeaturedProducts = async (
  limit?: number
): Promise<FeaturedProductsResponse> => {
  const params = limit ? `?limit=${limit}` : "";
  const response = await api.get(`/products/featured${params}`);
  return response.data;
};

// Get products by category
export const getProductsByCategory = async (
  category: string
): Promise<ProductsResponse> => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

// Get all categories with product counts and hero images
export const getCategories = async (): Promise<
  { category: string; count: number; heroImage: string }[]
> => {
  const response = await api.get("/products/categories");
  return response.data;
};

// Product API class for more advanced usage
export class ProductAPI {
  // Get products with pagination
  static async getProductsPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: Omit<ProductQueryDto, "page" | "limit">
  ): Promise<ProductsResponse> {
    return getProducts({ ...filters, page, limit });
  }

  // Search products
  static async searchProducts(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsResponse> {
    return getProducts({ search: searchTerm, page, limit });
  }

  // Get products by price range
  static async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsResponse> {
    return getProducts({ minPrice, maxPrice, page, limit });
  }

  // Get active products only
  static async getActiveProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsResponse> {
    return getProducts({ isActive: true, page, limit });
  }

  // Get low stock products (stock < 10)
  static async getLowStockProducts(): Promise<Product[]> {
    const response = await getProducts({ limit: 1000 }); // Get all products
    return response.products.filter((product) => product.stock < 10);
  }

  // Get out of stock products
  static async getOutOfStockProducts(): Promise<Product[]> {
    const response = await getProducts({ limit: 1000 }); // Get all products
    return response.products.filter((product) => product.stock === 0);
  }

  // Bulk update products
  static async bulkUpdateProducts(
    updates: Array<{ id: string; data: UpdateProductDto }>
  ): Promise<Product[]> {
    const promises = updates.map(({ id, data }) => updateProduct(id, data));
    return Promise.all(promises);
  }

  // Get product statistics
  static async getProductStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalCategories: number;
    averagePrice: number;
  }> {
    const response = await getProducts({ limit: 1000 }); // Get all products
    const products = response.products;

    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;
    const outOfStockProducts = products.filter((p) => p.stock === 0).length;
    const lowStockProducts = products.filter(
      (p) => p.stock > 0 && p.stock < 10
    ).length;
    const categories = new Set(products.map((p) => p.category)).size;
    const averagePrice =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0;

    return {
      totalProducts: products.length,
      activeProducts,
      inactiveProducts,
      outOfStockProducts,
      lowStockProducts,
      totalCategories: categories,
      averagePrice: Math.round(averagePrice * 100) / 100,
    };
  }
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  ProductAPI,
};
