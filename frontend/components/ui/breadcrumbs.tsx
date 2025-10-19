"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}

              {isLast ? (
                <span className="text-gray-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Convenience component for common breadcrumb patterns
export function HomeBreadcrumb({
  currentPage,
  className,
}: {
  currentPage: string;
  className?: string;
}) {
  return (
    <Breadcrumbs
      items={[{ label: "Home", href: "/home" }, { label: currentPage }]}
      className={className}
    />
  );
}

export function CategoryBreadcrumb({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/home" },
        { label: "Category", href: "/category" },
        { label: category },
      ]}
      className={className}
    />
  );
}

export function ProductBreadcrumb({
  category,
  productName,
  className,
}: {
  category?: string;
  productName: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/home" },
    { label: "Products", href: "/products" },
  ];

  if (category) {
    items.push({
      label: category,
      href: `/products?category=${encodeURIComponent(category)}`,
    });
  }

  items.push({ label: productName });

  return <Breadcrumbs items={items} className={className} />;
}
