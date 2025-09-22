// // lib/repos/ordersRepo.ts

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
};

const API_BASE = "https://shopflow-backend.onrender.com/api/orders";

export const ordersRepo = {
  async list(token: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ([]));
    if (!res.ok) throw new Error(data?.error || "Failed to fetch orders");
    return data as Order[];
  },

  async setStatus(id: string, status: OrderStatus, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to update status");
  },
};
