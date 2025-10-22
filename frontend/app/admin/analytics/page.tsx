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
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  PieChart,
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  topProducts: Array<{
    productId: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  ordersByDay: Array<{ day: string; orders: number; revenue: number }>;
  dailyOrders?: Array<{ date: string; orders: number; revenue: number }>;
}

export default function AnalyticsPage() {
  const { isLoggedIn, verify } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    revenueByMonth: [],
    topProducts: [],
    ordersByDay: [],
    dailyOrders: [],
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
  }, [isLoggedIn, selectedMonth, selectedYear]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch monthly analytics and products count
      const [monthlyAnalyticsResponse, productsResponse] = await Promise.all([
        fetch(
          `http://localhost:4000/orders/analytics/monthly?month=${selectedMonth}&year=${selectedYear}`,
          {
            credentials: "include",
          }
        ),
        fetch("http://localhost:4000/products?limit=1"),
      ]);

      const monthlyAnalytics = await monthlyAnalyticsResponse.json();
      const productsData = await productsResponse.json();

      setAnalytics({
        totalRevenue: monthlyAnalytics.totalRevenue || 0,
        totalOrders: monthlyAnalytics.totalOrders || 0,
        totalProducts: productsData.total || 0,
        averageOrderValue: monthlyAnalytics.averageOrderValue || 0,
        ordersByStatus: monthlyAnalytics.ordersByStatus || {},
        revenueByMonth: [], // Not needed for monthly view
        topProducts: monthlyAnalytics.topProducts || [],
        ordersByDay: monthlyAnalytics.ordersByDay || [],
        dailyOrders: monthlyAnalytics.dailyOrders || [],
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

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate years array (current year and 5 years back)
  const years = Array.from(
    { length: 6 },
    (_, i) => currentDate.getFullYear() - i
  );

  const getMonthName = (month: number) => {
    return months.find((m) => m.value === month)?.label || "";
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics & Reports
            </h1>
            <p className="text-gray-600">
              View detailed analytics for {getMonthName(selectedMonth)}{" "}
              {selectedYear}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="flex h-10 w-[120px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {loading && (
              <Badge variant="secondary" className="animate-pulse">
                Refreshing...
              </Badge>
            )}
          </div>
        </div>
      </div>

      {loading && !analytics.totalOrders ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <>
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
                  For {getMonthName(selectedMonth)} {selectedYear}
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
                <div className="text-2xl font-bold">
                  {analytics.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  For {getMonthName(selectedMonth)} {selectedYear}
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
                  For {getMonthName(selectedMonth)} {selectedYear}
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
            {/* Daily Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Daily Revenue Trend
                </CardTitle>
                <CardDescription>
                  Revenue breakdown for {getMonthName(selectedMonth)}{" "}
                  {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {analytics.dailyOrders && analytics.dailyOrders.length > 0 ? (
                    analytics.dailyOrders.map((item) => {
                      const date = new Date(item.date);
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      const dayNumber = date.getDate();
                      return (
                        <div
                          key={item.date}
                          className="flex items-center justify-between py-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <span className="text-sm font-medium">
                                {dayName}, {dayNumber}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {item.orders} orders
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-bold">
                            ৳{item.revenue.toLocaleString()}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders for this month
                    </div>
                  )}
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
                  Distribution of orders for {getMonthName(selectedMonth)}{" "}
                  {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.ordersByStatus).length > 0 ? (
                    Object.entries(analytics.ordersByStatus).map(
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
                    )
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders for this month
                    </div>
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
                  Top performing products in {getMonthName(selectedMonth)}{" "}
                  {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.length > 0 ? (
                    analytics.topProducts.map((product, index) => (
                      <div
                        key={product.productId || `product-${index}`}
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No products sold this month
                    </div>
                  )}
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
                  Orders by day of week in {getMonthName(selectedMonth)}{" "}
                  {selectedYear}
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
        </>
      )}
    </div>
  );
}
