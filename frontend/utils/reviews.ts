const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Review {
  _id: string;
  content: string;
  author: string;
  location: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export interface ReviewQueryParams {
  limit?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export async function getFeaturedReviews(limit?: number): Promise<Review[]> {
  try {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/reviews/featured?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch featured reviews");
    }

    const result: ReviewsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }
}

export async function getActiveReviews(limit?: number): Promise<Review[]> {
  try {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/reviews/active?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch active reviews");
    }

    const result: ReviewsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching active reviews:", error);
    return [];
  }
}

export async function getAllReviews(query?: ReviewQueryParams): Promise<{
  reviews: Review[];
  total: number;
}> {
  try {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.isActive !== undefined)
      params.append("isActive", query.isActive.toString());
    if (query?.isFeatured !== undefined)
      params.append("isFeatured", query.isFeatured.toString());

    const response = await fetch(`${API_BASE_URL}/reviews?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const result = await response.json();
    return {
      reviews: result.data,
      total: result.total,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { reviews: [], total: 0 };
  }
}
