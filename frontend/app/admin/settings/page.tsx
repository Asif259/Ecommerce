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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  ArrowLeft,
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Key,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

export default function SettingsPage() {
  const { isLoggedIn, verify, user, logout } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] =
    useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      emailNotifications: true,
      orderAlerts: true,
      lowStockAlerts: true,
      systemUpdates: false,
    },
    store: {
      storeName: "Home Decor & More",
      storeDescription: "Beautiful home decor, furniture, and accessories",
      currency: "BDT",
      timezone: "Asia/Dhaka",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      loginAttempts: 5,
    },
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
    if (isLoggedIn && user) {
      setSettings((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [isLoggedIn, user]);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength - 1, 4)] || "Very Weak",
      color: colors[Math.min(strength - 1, 4)] || "bg-red-500",
    };
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, you'd have an API endpoint to update admin profile
      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordChange = () => {
    // Validation
    if (!settings.currentPassword) {
      setError("Current password is required");
      return false;
    }

    if (!settings.newPassword) {
      setError("New password is required");
      return false;
    }

    if (settings.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }

    if (settings.newPassword === settings.currentPassword) {
      setError("New password must be different from current password");
      return false;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(settings.newPassword);
    const hasLowerCase = /[a-z]/.test(settings.newPassword);
    const hasNumbers = /\d/.test(settings.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswordChange()) {
      return;
    }

    setShowPasswordChangeDialog(true);
  };

  const confirmPasswordChange = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setShowPasswordChangeDialog(false);

    try {
      // Debug logging
      console.log("Password change request data:", {
        email: settings.email,
        passwordLength: settings.currentPassword.length,
        newPasswordLength: settings.newPassword.length,
      });

      await api.post("/auth/change-password", {
        email: settings.email,
        password: settings.currentPassword,
        newPassword: settings.newPassword,
      });
      setSuccess(
        "Password changed successfully! Please log in again with your new password."
      );
      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Auto logout after successful password change
      setTimeout(() => {
        logout();
        router.push("/admin/login");
      }, 2000);
    } catch (err: any) {
      console.error("Password change error:", err);
      if (err.response?.status === 401) {
        setError("Current password is incorrect");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid request");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save notification preferences
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess("Notification preferences saved!");
    } catch (err) {
      setError("Failed to save notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStore = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save store settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess("Store settings saved!");
    } catch (err) {
      setError("Failed to save store settings");
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your profile and store settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto">
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

        {/* Profile Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={user?.role || "admin"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                    placeholder="Enter your current password"
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
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {settings.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getPasswordStrength(settings.newPassword).color
                          }`}
                          style={{
                            width: `${
                              (getPasswordStrength(settings.newPassword)
                                .strength /
                                5) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 min-w-[80px]">
                        {getPasswordStrength(settings.newPassword).label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Password must contain at least 6 characters with
                      uppercase, lowercase, and numbers
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={settings.confirmPassword}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {settings.confirmPassword &&
                  settings.newPassword !== settings.confirmPassword && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                {settings.confirmPassword &&
                  settings.newPassword === settings.confirmPassword && (
                    <p className="text-xs text-green-500">Passwords match</p>
                  )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !settings.currentPassword ||
                    !settings.newPassword ||
                    !settings.confirmPassword
                  }
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {key === "emailNotifications" &&
                        "Receive notifications via email"}
                      {key === "orderAlerts" && "Get notified about new orders"}
                      {key === "lowStockAlerts" &&
                        "Alert when products are low in stock"}
                      {key === "systemUpdates" &&
                        "Receive system update notifications"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
              <Button onClick={handleSaveNotifications} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Notifications"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Store Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Store Settings
            </CardTitle>
            <CardDescription>Configure your store preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.store.storeName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        store: { ...prev.store, storeName: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.store.currency}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        store: { ...prev.store, currency: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <textarea
                  id="storeDescription"
                  value={settings.store.storeDescription}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      store: {
                        ...prev.store,
                        storeDescription: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveStore} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Store Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {settings.security.twoFactorAuth ? "Disable" : "Enable"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          sessionTimeout: parseInt(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          loginAttempts: parseInt(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">
                    Logout from all devices
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sign out from all devices and invalidate all sessions
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={logout}>
                  Logout Everywhere
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Confirmation Dialog */}
      {showPasswordChangeDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Password Change
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change your password? You will be logged
              out and need to log in again with your new password.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowPasswordChangeDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPasswordChange}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Changing..." : "Confirm Change"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
