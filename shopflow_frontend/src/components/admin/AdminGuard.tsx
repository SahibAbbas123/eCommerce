// // components/admin/AdminGuard.tsx
// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "../../lib/store/useAuthStore";

// export default function AdminGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { user } = useAuthStore((state) => ({
//     user: state.user,
//   }));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user === null) {
//       // If the user is not logged in, redirect to login
//       router.push("/login");
//     } else if (user?.role?.toUpperCase() !== "ADMIN") {
//       // If the user is not an admin, redirect to home
//       router.push("/");
//     } else {
//       setLoading(false); // Allow admin access
//     }
//   }, [user, router]);

//   if (loading) return null; // Show a loading state while checking the user's role

//   return <>{children}</>; // Allow access if user is admin
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuthStore } from "../../lib/store/useAuthStore";

// export default function AdminGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const user = useAuthStore((s) => s.user);
//   const isAdmin = useAuthStore((s) => s.isAdmin);

//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     // Not logged in → go to login and preserve original target
//     if (!user) {
//       router.replace(`/login?next=${encodeURIComponent(pathname)}`);
//       return;
//     }

//     // Logged in but not admin → go home
//     if (!isAdmin) {
//       router.replace("/");
//       return;
//     }

//     // Allowed
//     setChecking(false);
//   }, [user, isAdmin, router, pathname]);

//   if (checking) {
//     // Minimal, non-flashy fallback while we resolve auth state
//     return <div className="p-6 text-sm text-gray-600">Checking access…</div>;
//   }

//   return <>{children}</>;
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuthStore } from "../../lib/store/useAuthStore";

// export default function AdminGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const { user, isAdmin, hasHydrated } = useAuthStore((s) => ({
//     user: s.user,
//     isAdmin: s.isAdmin,
//     hasHydrated: s.hasHydrated,
//   }));

//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     // Wait until localStorage hydration finishes
//     if (!hasHydrated) return;

//     if (!user) {
//       router.replace(`/login?next=${encodeURIComponent(pathname)}`);
//       return;
//     }

//     if (!isAdmin) {
//       router.replace("/");
//       return;
//     }

//     setChecking(false);
//   }, [user, isAdmin, hasHydrated, router, pathname]);

//   if (checking || !hasHydrated) {
//     return <div className="p-6 text-sm text-gray-600">Checking access…</div>;
//   }

//   return <>{children}</>;
// }


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
