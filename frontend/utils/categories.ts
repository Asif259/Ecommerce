import api from "./api";

export interface Category {
  _id: string;
  name: string;
  heroImage: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  heroImage: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  heroImage?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

// Get all active categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// Get all categories (including inactive) - Admin only
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories/all");
  return response.data;
};

// Get a single category by ID
export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create a new category
export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// Update an existing category
export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  const response = await api.patch(`/categories/${id}`, categoryData);
  return response.data;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export default {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
