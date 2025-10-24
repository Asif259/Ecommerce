"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Star,
} from "lucide-react";

interface SidebarProps {
  user?: {
    email?: string;
  };
  onLogout: () => void | Promise<void>;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

// Utility component to add proper spacing for mobile header
export function MobileHeaderSpacer() {
  return <div className="h-16 lg:h-0" />;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: ImageIcon,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar({
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  // Handle window resize for better tablet behavior
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);

      // Close mobile sidebar on desktop
      if (width >= 1024) {
        setIsMobileOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle escape key to close mobile sidebar
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMobileOpen]);

  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile header bar with menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
              onClick={toggleMobileSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="text-lg font-bold text-[#7F6244]">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg",
          // Desktop (lg+): always show, position based on collapsed state
          "lg:translate-x-0 lg:top-0 lg:h-full",
          // Mobile/Tablet: positioned below header bar
          "top-16 h-[calc(100vh-4rem)] lg:top-0 lg:h-full",
          // Mobile: show when open, hide when closed
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Width based on collapsed state and screen size
          isCollapsed ? "w-16 md:w-16 lg:w-16" : "w-56 md:w-56 lg:w-56"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Desktop Header - hidden on mobile */}
          <div
            className={cn(
              "hidden lg:flex items-center border-b border-gray-200",
              isCollapsed ? "justify-center p-3" : "justify-between p-4"
            )}
          >
            {!isCollapsed ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-[#7F6244]">Admin</span>
              </div>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Desktop collapse/expand button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hover:bg-gray-100"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>


          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className={cn("space-y-1", isCollapsed ? "p-2" : "p-4")}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "size-5" : "size-5 mr-3"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div
            className={cn(
              "border-t border-gray-200",
              isCollapsed ? "p-2" : "p-4"
            )}
          >
            {!isCollapsed && user?.email && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Admin
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {user.email.split("@")[0]}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className={cn(
                "w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                isCollapsed ? "justify-center p-3" : "justify-start px-3 py-2.5"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut
                className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "size-5" : "size-5 mr-2"
                )}
              />
              {!isCollapsed && <span className="truncate">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
