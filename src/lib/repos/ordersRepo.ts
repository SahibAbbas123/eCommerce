// // lib/repos/ordersRepo.ts
// export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
// export type Order = {
//   id: string;
//   customer: string;
//   total: number;
//   status: OrderStatus;
//   date: string;
// };

// let _orders: Order[] = [
//   { id: "ORD-1001", customer: "Jane Doe", total: 199, status: "processing", date: "2025-08-06" },
//   { id: "ORD-1002", customer: "John Smith", total: 79, status: "shipped", date: "2025-08-07" },
// ];

// export const ordersRepo = {
//   async list() { return [..._orders]; },
//   async setStatus(id: string, status: OrderStatus) {
//     _orders = _orders.map((o) => (o.id === id ? { ...o, status } : o));
//   },
// };


export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
};

const API_BASE = "http://localhost:4001/api/orders";

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
