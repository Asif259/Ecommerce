"use client";

import Link from "next/link";
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
              {index > 0 && <span className="text-[#D4C5B9] mx-2">/</span>}

              {isLast ? (
                <span
                  className="text-[#3D3D3D] font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-[#8B7E6A] hover:text-[#7F6244] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#8B7E6A]">{item.label}</span>
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
      items={[{ label: "Home", href: "/" }, { label: currentPage }]}
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
        { label: "Home", href: "/" },
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
    { label: "Home", href: "/" },
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
