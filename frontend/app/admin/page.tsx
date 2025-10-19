"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { ProductAPI } from "@/utils/products";
import { useAdminStore } from "@/stores/adminStore";

export default function AdminDashboard() {
  const { isLoggedIn, user } = useAdminStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  // Fetch dashboard statistics
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardStats();
    }
  }, [isLoggedIn]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch products stats using the new API
      const productStats = await ProductAPI.getProductStats();

      // Fetch orders stats
      const ordersStatsResponse = await fetch(
        "http://localhost:4000/orders/stats",
        {
          credentials: "include",
        }
      );
      const ordersStats = await ordersStatsResponse.json();

      // Fetch orders for pending count
      const ordersResponse = await fetch(
        "http://localhost:4000/orders?limit=100",
        {
          credentials: "include",
        }
      );
      const ordersData = await ordersResponse.json();

      setStats({
        totalProducts: productStats.totalProducts,
        totalOrders: ordersStats.totalOrders || 0,
        totalRevenue: ordersStats.totalRevenue || 0,
        pendingOrders:
          ordersData.orders?.filter((order: any) => order.status === "pending")
            .length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              {user?.email}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-gray-500">Active products in store</p>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-gray-500">All time orders</p>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ৳{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">All time revenue</p>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Orders
            </CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-gray-500">Orders awaiting processing</p>
            <div className="flex items-center mt-2 text-xs text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>Needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/admin/products">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Package className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Manage Products</div>
                      <div className="text-xs text-gray-500">
                        Add, edit, or remove products
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">View Orders</div>
                      <div className="text-xs text-gray-500">
                        Process and track orders
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Manage Categories</div>
                      <div className="text-xs text-gray-500">
                        Category hero images
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">View Analytics</div>
                      <div className="text-xs text-gray-500">
                        Sales and performance data
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Manage Users</div>
                      <div className="text-xs text-gray-500">
                        User accounts and permissions
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
              <Link href="/admin/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500">
                      Configure your store settings
                    </div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Online</p>
                    <p className="text-xs text-gray-500">
                      All services running normally
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard Updated</p>
                    <p className="text-xs text-gray-500">
                      Statistics refreshed successfully
                    </p>
                    <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Orders</p>
                    <p className="text-xs text-gray-500">
                      {stats.pendingOrders} orders pending review
                    </p>
                    <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Added</p>
                    <p className="text-xs text-gray-500">
                      New product "Wireless Headphones" added
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
