// // components/admin/AdminGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../lib/store/useAuthStore";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Only read what your store actually has
  const user = useAuthStore((s) => s.user);
  // derive admin from the stored user
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // wait one tick so Zustand can hydrate from localStorage
    const id = setTimeout(() => {
      if (!user) {
        // router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        router.replace(`/`);
        return;
      }
      if (!isAdmin) {
        router.replace("/");
        return;
      }
      setChecking(false);
    }, 0);

    return () => clearTimeout(id);
  }, [user, isAdmin, router, pathname]);

  if (checking) {
    return <div className="p-6 text-sm text-gray-600">Checking access…</div>;
  }

  return <>{children}</>;
}
