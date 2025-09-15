import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import CartResetOnLogout from "@/components/cart_reset/CartResetOnLogout";

export const metadata: Metadata = {
  title: "ShopFlow",
  description: "Modern e-commerce with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CartResetOnLogout />
      <body>{children}</body>
    </html>
  );
}
