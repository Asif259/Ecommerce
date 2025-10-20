import { useState, useEffect, useCallback, useRef } from "react";
import { getProducts, Product } from "@/utils/products";

interface UseProductSearchResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProductSearch(
  query: string,
  minLength: number = 2
): UseProductSearchResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchProducts = useCallback(async (searchTerm: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await getProducts({
        search: searchTerm,
        isActive: true,
        limit: 8, // Limit suggestions to 8 products
      });

      setProducts(response.products || []);
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name !== "AbortError") {
        console.error("Search error:", err);
        setError("Failed to search products");
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset if query is too short
    if (query.trim().length < minLength) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce search with 300ms delay
    timeoutRef.current = setTimeout(() => {
      searchProducts(query.trim());
    }, 300);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, minLength, searchProducts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { products, loading, error };
}
