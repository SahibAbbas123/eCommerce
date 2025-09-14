// // src/lib/repos/productsRepo.ts

// export type Product = {
//   id: string;
//   title: string;
//   description?: string;
//   category: string;
//   price: number;
//   image: string;
//   rating: number;
//   // UI expects "stock" as a number; backend has "inStock" (boolean).
//   // We'll map: true -> 1, false -> 0 for display.
//   stock: number;
// };

// type CreateInput = {
//   title: string;
//   category: string;
//   price: number;
//   stock: number; // from the UI form
//   image?: string;
//   description?: string;
// };

// const API_BASE = "http://localhost:5000/api/products";

// function mapFromBackend(p: any): Product {
//   return {
//     id: p.id,
//     title: p.title,
//     description: p.description ?? "",
//     category: p.category,
//     price: Number(p.price),
//     image: p.image,
//     rating: Number(p.rating ?? 0),
//     stock: p.inStock ? 1 : 0, // boolean -> number for your table
//   };
// }

// function mapToBackend(input: CreateInput) {
//   return {
//     title: input.title,
//     description: input.description ?? "",
//     price: input.price,
//     image: input.image ?? "",
//     category: input.category,
//     rating: 0,
//     inStock: Number(input.stock) > 0, // number -> boolean for backend
//   };
// }

// export const productsRepo = {
//   async list(): Promise<Product[]> {
//     const res = await fetch(`${API_BASE}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Failed to fetch products (${res.status})`);
//     }
//     const data = await res.json();
//     if (!Array.isArray(data)) return [];
//     return data.map(mapFromBackend);
//   },

//   async create(input: CreateInput, token: string): Promise<Product> {
//     const res = await fetch(`${API_BASE}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(mapToBackend(input)),
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) {
//       throw new Error(data?.error || `Failed to create product (${res.status})`);
//     }
//     return mapFromBackend(data);
//   },

//   async remove(id: string, token: string): Promise<void> {
//     const res = await fetch(`${API_BASE}/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data?.error || `Failed to delete product (${res.status})`);
//     }
//   },
// };


// src/lib/repos/productsRepo.ts

export type Product = {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  // UI shows a number; backend has boolean inStock. We map both ways.
  stock: number;
};

export type CreateOrUpdateInput = {
  title: string;
  category: string;
  price: number;
  stock: number;        // number in UI
  image?: string;
  description?: string;
};

const API_BASE = "http://localhost:4001/api/products";

function mapFromBackend(p: any): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    category: p.category,
    price: Number(p.price),
    image: p.image ?? "",
    rating: Number(p.rating ?? 0),
    stock: p.inStock ? 1 : 0, // boolean -> number for table/form
  };
}

function mapToBackend(input: CreateOrUpdateInput) {
  if (!input.image?.trim()) {
    throw new Error("Image URL is required");
  }
  
  return {
    title: input.title,
    description: input.description ?? "",
    price: input.price,
    image: input.image.trim(),
    category: input.category,
    rating: 0,
    inStock: Number(input.stock) > 0, // number -> boolean for API
  };
}

export const productsRepo = {
  async list(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}`, { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapFromBackend) : [];
  },

  async create(input: CreateOrUpdateInput, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(mapToBackend(input)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Create failed (${res.status})`);
    return mapFromBackend(data);
  },

  async update(id: string, input: CreateOrUpdateInput, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(mapToBackend(input)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Update failed (${res.status})`);
    return mapFromBackend(data);
  },

  async remove(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || `Delete failed (${res.status})`);
    }
  },
};
