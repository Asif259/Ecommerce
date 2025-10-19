import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ui/conditional-navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fenian Gadgets - Your Trusted Source for Electronics",
  description:
    "Discover the latest and greatest gadgets and electronics at Fenian Gadgets. Quality products at competitive prices with free shipping on orders over $50.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ConditionalNavbar />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FAF8F5",
              color: "#3D3D3D",
              border: "1px solid #D4C5B9",
            },
            success: {
              iconTheme: {
                primary: "#7F6244",
                secondary: "#FAF8F5",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
