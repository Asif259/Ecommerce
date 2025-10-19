import { create } from "zustand";
import api from "@/utils/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AdminState {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verify: () => Promise<boolean>;
}

const useAuthStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: async (email: string, password: string) => {
    try {
      await api.post("/auth/login", { email, password });
      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100));
      // After successful login, verify to get user data
      const response = await api.get("/auth/verify");
      if (response.data.user) {
        const userData = {
          id: response.data.user.userId,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        set({ isLoggedIn: true, user: userData });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },
  logout: () => set({ isLoggedIn: false, user: null }),
  verify: async () => {
    try {
      const response = await api.get("/auth/verify");
      if (response.data.user) {
        const userData = {
          id: response.data.user.userId,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        set({ isLoggedIn: true, user: userData });
        return true;
      }
    } catch (error: any) {
      // Silently handle authentication errors - don't log them as they're expected
      if (error.response && error.response.status === 401) {
        // User not authenticated - this is normal for unauthenticated users
      } else {
        console.log("Auth check failed:", error);
      }
      set({ isLoggedIn: false, user: null });
      return false;
    }
    set({ isLoggedIn: false, user: null });
    return false;
  },
}));

export const useAdminStore = useAuthStore;
