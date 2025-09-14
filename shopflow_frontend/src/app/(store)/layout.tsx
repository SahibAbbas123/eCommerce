"use client";

//this is /Users/sahibabc/ecomLanding/ecomlanding/src/app/layout.tsx
// this file is the root layout for the Next.js application
import { Geist, Geist_Mono } from "next/font/google";
import ".././globals.css";
import Header from "../../components/layout/Header";
import { Toaster } from "sonner";
import DevAuthSwitch from "../../components/admin/DevAuthSwitch";
import { useAuthStore } from "../../lib/store/useAuthStore";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Header />
      <Toaster position="top-right" richColors closeButton />
      {children}
      {user?.role === "admin" && <DevAuthSwitch />} {/* Show only for admin users */}
    </>
  );
}