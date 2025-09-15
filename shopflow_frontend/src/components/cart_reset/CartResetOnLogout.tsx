// /src/components/CartResetOnLogout.tsx
"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect } from "react";
// import { useAuthStore } from "../lib/store/useAuthStore";
// import { useCartStore } from "../lib/store/useCartStore";

export default function CartResetOnLogout() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      // user logged out → clear cart
      const cartStore = useCartStore.getState();
      cartStore.clearCart();              // clear memory
      useCartStore.persist.clearStorage(); // clear localStorage persist
    }
  }, [user]);

  return null;
}
