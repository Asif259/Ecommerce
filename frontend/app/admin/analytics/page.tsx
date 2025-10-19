"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  PieChart,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  ordersByDay: Array<{ day: string; orders: number }>;
}

export default function AnalyticsPage() {
  const { isLoggedIn, verify } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    revenueByMonth: [],
    topProducts: [],
    ordersByDay: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      verify()
        .then((authenticated) => {
          if (!authenticated) {
            router.push("/admin/login");
          }
        })
        .catch(() => {
          router.push("/admin/login");
        });
    }
  }, [mounted, verify, router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAnalytics();
    }
  }, [isLoggedIn]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch orders stats
      const ordersStatsResponse = await fetch(
        "http://localhost:4000/orders/stats",
        {
          credentials: "include",
        }
      );
      const ordersStats = await ordersStatsResponse.json();

      // Fetch products count
      const productsResponse = await fetch(
        "http://localhost:4000/products?limit=1"
      );
      const productsData = await productsResponse.json();

      // Fetch recent orders for additional analytics
      const ordersResponse = await fetch(
        "http://localhost:4000/orders?limit=100",
        {
          credentials: "include",
        }
      );
      const ordersData = await ordersResponse.json();

      // Process analytics data
      const orders = ordersData.orders || [];
      const ordersByStatus = orders.reduce(
        (acc: Record<string, number>, order: any) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {}
      );

      // Calculate average order value
      const averageOrderValue =
        orders.length > 0
          ? orders.reduce(
              (sum: number, order: any) => sum + order.totalAmount,
              0
            ) / orders.length
          : 0;

      // Mock data for charts (in a real app, you'd have proper analytics endpoints)
      const revenueByMonth = [
        { month: "Jan", revenue: 2500 },
        { month: "Feb", revenue: 3200 },
        { month: "Mar", revenue: 2800 },
        { month: "Apr", revenue: 4100 },
        { month: "May", revenue: 3600 },
        { month: "Jun", revenue: 4800 },
      ];

      const topProducts = [
        { name: "iPhone 15 Pro", sales: 45, revenue: 67500 },
        { name: "MacBook Air M2", sales: 23, revenue: 27600 },
        { name: "AirPods Pro", sales: 67, revenue: 13400 },
        { name: "iPad Pro", sales: 18, revenue: 16200 },
        { name: "Apple Watch", sales: 34, revenue: 13600 },
      ];

      const ordersByDay = [
        { day: "Mon", orders: 12 },
        { day: "Tue", orders: 19 },
        { day: "Wed", orders: 15 },
        { day: "Thu", orders: 22 },
        { day: "Fri", orders: 28 },
        { day: "Sat", orders: 35 },
        { day: "Sun", orders: 18 },
      ];

      setAnalytics({
        totalRevenue: ordersStats.totalRevenue || 0,
        totalOrders: ordersStats.totalOrders || 0,
        totalProducts: productsData.total || 0,
        averageOrderValue,
        ordersByStatus,
        revenueByMonth,
        topProducts,
        ordersByDay,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics & Reports
            </h1>
            <p className="text-gray-600">View detailed analytics and reports</p>
          </div>
        </div>
      </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳{analytics.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳{analytics.averageOrderValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Active products in catalog
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Revenue Trend
              </CardTitle>
              <CardDescription>
                Monthly revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.revenueByMonth.map((item, index) => (
                  <div
                    key={item.month}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">{item.month}</span>
                    </div>
                    <div className="text-sm font-bold">
                      ৳{item.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Orders by Status
              </CardTitle>
              <CardDescription>
                Distribution of orders by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.ordersByStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            status === "pending"
                              ? "bg-yellow-500"
                              : status === "confirmed"
                              ? "bg-blue-500"
                              : status === "shipped"
                              ? "bg-purple-500"
                              : status === "delivered"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium capitalize">
                          {status}
                        </span>
                      </div>
                      <div className="text-sm font-bold">{count}</div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Top Selling Products
              </CardTitle>
              <CardDescription>
                Best performing products by sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sales
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold">
                      ৳{product.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders by Day */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Orders by Day of Week
              </CardTitle>
              <CardDescription>
                Average orders per day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.ordersByDay.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{item.day}</span>
                    </div>
                    <div className="text-sm font-bold">{item.orders}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>
              Download detailed reports and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Export Sales Report</Button>
              <Button variant="outline">Export Product Analytics</Button>
              <Button variant="outline">Export Customer Data</Button>
              <Button variant="outline">Export Financial Summary</Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
