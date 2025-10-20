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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  ArrowLeft,
  User,
  Shield,
  Mail,
  Calendar,
  Key,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt?: Date;
  lastLogin?: Date;
}

// Helper function to format date with time
const formatDateTime = (date?: Date) => {
  if (!date) return "Never";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// Helper function to get relative time
const getRelativeTime = (date?: Date) => {
  if (!date) return "Never";
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDateTime(date);
};

export default function AdminUsersPage() {
  const { isLoggedIn, verify, user, logout } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  // Initialize with current logged-in user data
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [userCountLoading, setUserCountLoading] = useState(true);

  // Update adminUsers when user data is available
  useEffect(() => {
    if (user) {
      setAdminUsers([
        {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        },
      ]);
    }
  }, [user]);

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

  // Fetch user count from backend
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await api.get("/auth/user-count");
        setUserCount(response.data);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
        setUserCount(0);
      } finally {
        setUserCountLoading(false);
      }
    };

    if (mounted && isLoggedIn) {
      fetchUserCount();
    }
  }, [mounted, isLoggedIn]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newAdmin.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // In a real app, you'd have an API endpoint to create admin users
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAdminUser: AdminUser = {
        id: Date.now().toString(),
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setAdminUsers((prev) => [...prev, newAdminUser]);
      setSuccess("Admin user created successfully!");
      setIsAddingAdmin(false);
      setNewAdmin({
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      });
    } catch (err) {
      setError("Failed to create admin user");
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
              Admin Users Management
            </h1>
            <p className="text-gray-600">
              Manage administrator accounts and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Admin Form */}
      {isAddingAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Admin User
            </CardTitle>
            <CardDescription>
              Create a new administrator account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Admin User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingAdmin(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Admin User
          </CardTitle>
          <CardDescription>
            Manage administrator accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {admin.email}
                      </h4>
                      {admin.id === user?.id && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {admin.role}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-start space-x-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Created At
                          </p>
                          <p className="text-xs">
                            {formatDateTime(admin.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(admin.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Last Login
                          </p>
                          <p className="text-xs">
                            {formatDateTime(admin.lastLogin)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(admin.lastLogin)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCountLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                userCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Active administrator accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                adminUsers.filter((admin) => admin.role === "super-admin")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Users with full access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminUsers.filter((admin) => admin.role === "moderator").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Limited access users
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
