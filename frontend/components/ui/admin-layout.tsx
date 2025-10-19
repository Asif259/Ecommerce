"use client";

import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useAdminStore } from "@/stores/adminStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, isLoggedIn, verify, user } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if current page is login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoginPage) {
      console.log("[AdminLayout] Verifying authentication...");
      verify()
        .then((authenticated) => {
          console.log("[AdminLayout] Verification result:", authenticated);
          setHasVerified(true);
          if (!authenticated) {
            console.log(
              "[AdminLayout] Not authenticated, redirecting to login"
            );
            router.push("/admin/login");
          }
        })
        .catch((error) => {
          console.log("[AdminLayout] Verification error:", error);
          setHasVerified(true);
          router.push("/admin/login");
        });
    } else if (mounted && isLoginPage) {
      // Skip verification for login page
      setHasVerified(true);
    }
  }, [mounted, verify, router, isLoginPage]);

  // Immediate redirect if not logged in after verification (skip for login page)
  useEffect(() => {
    if (mounted && hasVerified && !isLoggedIn && !isLoginPage) {
      console.log(
        "[AdminLayout] User not logged in after verification, redirecting immediately"
      );
      router.push("/admin/login");
    }
  }, [mounted, hasVerified, isLoggedIn, router, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
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

  // If not logged in after verification, show loading while redirect happens (skip for login page)
  if (hasVerified && !isLoggedIn && !isLoginPage) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // For login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        user={user ? { email: user.email } : undefined}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-56"
        }`}
      >
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
