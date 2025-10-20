"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isLoggedIn } = useAdminStore();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isApiConfigured = !!apiUrl;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isApiConfigured) {
      setError(
        "API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable."
      );
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Login successful, redirect to admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#D4C5B9]/20">
      <Card className="w-full max-w-md shadow-2xl border-[#9CA986]/20">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 mb-2">
              <img
                src="/logo.png"
                alt="Home Decor And More Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#3D3D3D]">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-[#5A5A5A]">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isApiConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <p className="font-semibold mb-1">API Not Configured</p>
                <p className="text-sm">
                  Set{" "}
                  <code className="bg-destructive/20 px-1 rounded">
                    NEXT_PUBLIC_API_URL
                  </code>{" "}
                  in the Vars section.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !isApiConfigured}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !isApiConfigured}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || !isApiConfigured}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
