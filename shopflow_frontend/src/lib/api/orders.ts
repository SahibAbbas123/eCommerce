// // this is /Users/sahibabc/ecomLanding/ecomlanding/src/lib/api/orders.ts

import { Order } from "../types/order";

const API_BASE = "https://shopflow-backend.onrender.com/api/orders";

export const ordersApi = {
  // Create order from checkout
  async createOrder(
    token: string,
    payload: {
      items: { productId: string; quantity: number }[];
      address: { name: string; phone: string; email: string; street: string; city: string; zip: string; state?: string; country?: string };
      shipping: "standard" | "express";
      payment: "cod" | "card";
    }
  ) {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to place order");
    return data as {
      id: string;
      date: string;
      status: Order["status"];
      total: number;
      items: { id: string; title: string; price: number; quantity: number }[];
      shippingAddress: { name: string; address: string; city: string; zip: string };
    };
  },

  // User orders with pagination/sorting/filter
  async getOrders(
    params: {
      page: number;
      limit: number;
      sort?: "date" | "total";
      order?: "asc" | "desc";
      status?: Order["status"];
    },
    token: string
  ) {
    const q = new URLSearchParams();
    q.set("page", String(params.page));
    q.set("limit", String(params.limit));
    if (params.sort) q.set("sort", params.sort);
    if (params.order) q.set("order", params.order);
    if (params.status) q.set("status", params.status);

    const res = await fetch(`${API_BASE}/my?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to load orders");
    return data as {
      orders: Order[];
      pagination: { total: number; totalPages: number; currentPage: number; limit: number };
    };
  },

  // Single order detail (if you need it)
  async getOrder(id: string, token: string) {
    const res = await fetch(`${API_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Order not found");
    return data as Order;
  },
};
