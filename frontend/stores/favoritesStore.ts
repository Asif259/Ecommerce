import { create } from "zustand";
import { FavoriteItem } from "@/types/favorites";

interface FavoritesState {
  items: FavoriteItem[];
  addItem: (product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  }) => void;
  removeItem: (productId: string) => void;
  clearFavorites: () => void;
  getItemCount: () => number;
  isFavorite: (productId: string) => boolean;
}

const FAVORITES_STORAGE_KEY = "homedecor-more-favorites";

// Helper function to load favorites from localStorage
const loadFavoritesFromStorage = (): FavoriteItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites from storage:", error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (items: FavoriteItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving favorites to storage:", error);
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: loadFavoritesFromStorage(),

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === product._id
      );

      // If already favorited, don't add again
      if (existingItem) {
        return state;
      }

      // Add new item to favorites
      const newItem: FavoriteItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      };
      const newItems = [...state.items, newItem];

      saveFavoritesToStorage(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.productId !== productId
      );
      saveFavoritesToStorage(newItems);
      return { items: newItems };
    });
  },

  clearFavorites: () => {
    saveFavoritesToStorage([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.length;
  },

  isFavorite: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
