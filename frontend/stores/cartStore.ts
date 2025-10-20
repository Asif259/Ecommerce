import { create } from "zustand";
import { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (
    product: {
      _id: string;
      name: string;
      price: number;
      images?: string[];
      stock: number;
    },
    quantity?: number
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

const CART_STORAGE_KEY = "homedecor-more-cart";

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartFromStorage(),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === product._id
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity of existing item, respecting stock limits
        newItems = state.items.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          quantity: Math.min(quantity, product.stock),
        };
        newItems = [...state.items, newItem];
      }

      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.productId !== productId
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter(
          (item) => item.productId !== productId
        );
        saveCartToStorage(newItems);
        return { items: newItems };
      }

      const newItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
