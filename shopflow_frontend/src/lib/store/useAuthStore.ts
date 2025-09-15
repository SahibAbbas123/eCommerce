// D:\WebEng\eCommerce\shopflow_frontend\src\lib\store\useAuthStore.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

interface User {
  email: string;
  name?: string;
  avatarUrl?: string;
  password?: string;
  addresses?: Address[];
  role?: "user" | "admin";
  token?: string; // <-- Add token here
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name?: string
  ) => Promise<boolean>;
  logout: () => void;
  setAvatar: (dataUrl: string) => void;
  removeAvatar: () => void;
  addAddress: (a: Omit<Address, "id">) => void;
  editAddress: (id: string, a: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  changePassword: (current: string, next: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      register: async (email, password, name) => {
        if (!email || !password || !name) {
          console.log("Register failed: missing input");
          return false;
        }
        try {
          const res = await fetch("https://shopflow-backend.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          });
          const data = await res.json();
          if (!res.ok) {
            console.error("Register failed:", data.error);
            return false;
          }
          set({
            user: {
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              token: data.token,
            },
          });
          return true;
        } catch (error) {
          console.error("Register error:", error);
          return false;
        }
      },

      login: async (email, password) => {
        if (!email || !password) return false;
        try {
          const res = await fetch("https://shopflow-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) {
            console.error("Login failed:", data.error);
            return false;
          }
          set({
            user: {
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              token: data.token, // <-- save token here
            },
          });
          return true;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      changePassword: async (current, next) => {
        // implement backend call here if needed
        return false;
      },

      logout: () => set({ user: null }),

      setAvatar: (avatarUrl) =>
        set((state) =>
          state.user ? { user: { ...state.user, avatarUrl } } : {}
        ),

      removeAvatar: () =>
        set((state) =>
          state.user ? { user: { ...state.user, avatarUrl: undefined } } : {}
        ),

      addAddress: (a) =>
        set((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  addresses: [
                    ...(state.user.addresses ?? []),
                    { ...a, id: crypto.randomUUID() },
                  ],
                },
              }
            : {}
        ),

      editAddress: (id, a) =>
        set((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  addresses: (state.user.addresses ?? []).map((addr) =>
                    addr.id === id ? { ...a, id } : addr
                  ),
                },
              }
            : {}
        ),

      deleteAddress: (id) =>
        set((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  addresses: (state.user.addresses ?? []).filter(
                    (addr) => addr.id !== id
                  ),
                },
              }
            : {}
        ),
    }),
    {
      name: "auth-store",
      version: 1,
      migrate: (persistedState: any) => {
        return {
          user: persistedState.user ? {
            email: persistedState.user.email,
            name: persistedState.user.name,
            role: persistedState.user.role,
            token: persistedState.user.token,
            addresses: persistedState.user.addresses || [],
            avatarUrl: persistedState.user.avatarUrl,
          } : null
        }
      },
    }
  )
);

