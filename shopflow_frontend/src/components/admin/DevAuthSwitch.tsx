// D:\WebEng\eCommerce\shopflow_frontend\src\components\admin\DevAuthSwitch.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useCartStore } from "../../lib/store/useCartStore";

export default function DevAuthSwitch() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const label = useMemo(() => {
    if (!user) return "Guest";
    return `${user.name || user.email} ${
      user.role === "admin" ? "(admin)" : ""
    }`;
  }, [user]);

  const handleAdminLogin = async () => {
    try {
      const success = await login("admin@example.com", "admin123");
      if (success) router.push("/admin");
    } catch (error) {
      console.error("Failed to login as admin:", error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     // logout user
  //     await logout();

  //     // clear Zustand cart state & storage properly
  //     const cartStore = useCartStore.getState();
  //     cartStore.clearCart(); // clear in-memory
  //     useCartStore.persist.clearStorage(); // clear localStorage persist

  //     router.push("/"); // redirect home
  //   } catch (error) {
  //     console.error("Failed to logout:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await logout(); // clears user in Zustand

      // ✅ Clear cart in memory
      // const cartStore = useCartStore.getState();
      // cartStore.clearCart();

      // // ✅ Clear persisted cart storage
      // localStorage.removeItem("cart-wishlist-store");
      useCartStore.getState().resetCart(); // fully clear cart + persist

      router.push("/"); // redirect home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="fixed z-[9999] right-4 bottom-4 flex items-center gap-2 rounded-xl border bg-white/90 backdrop-blur px-3 py-2 shadow-lg">
      <span className="text-xs text-gray-600 hidden sm:inline">
        Dev Auth: {label}
      </span>

      <button
        onClick={handleAdminLogin}
        className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
        title="Login as admin"
      >
        Admin
      </button>

      <button
        onClick={handleLogout}
        className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
}
