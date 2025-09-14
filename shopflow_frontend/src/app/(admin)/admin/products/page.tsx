"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { CreateOrUpdateInput, Product, productsRepo } from "@/lib/repos/productsRepo";
import ProductForm, { ProductFormOutput, ProductSchema } from "@/components/admin/ProductForm";
import Pagination from "@/components/common/Pagination";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<Partial<ProductFormOutput> | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>("");

  const token = useAuthStore((s) => s.user?.token);

  useEffect(() => {
    productsRepo
      .list()
      .then(setRows)
      .catch((err) => {
        console.error("Error loading products:", err);
        toast.error("Failed to load products");
      });
  }, []);

  function toRepoPayload(values: ProductFormOutput): CreateOrUpdateInput {
    return {
      title: values.title.trim(),
      category: values.category.trim(),
      price: values.price,
      stock: values.stock, // Ensure stock is passed correctly
      image: imageUrl || values.image, // Use uploaded image URL or existing image
      description: "", // (form doesn’t collect description)
    };
  }

  async function handleFile(file: File): Promise<string> {
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API}/api/products/upload-image`, {
        method: "POST",
        body: fd,
      });
      
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Upload failed");
        throw new Error(data?.error || "Upload failed");
      }
      
      const imageUrl = data.url;
      if (!imageUrl) {
        throw new Error("No image URL returned from server");
      }
      
      setImageUrl(imageUrl);
      return imageUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      throw error;
    }
  }

  async function handleCreate(values: ProductFormOutput): Promise<void> {
    if (!token) {
      toast.error("Please log in");
      return;
    }
    try {
      const created = await productsRepo.create(toRepoPayload(values), token);
      setRows((r) => [created, ...r]);
      setOpen(false);
      toast.success("Product created");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Create failed");
    }
  }

  async function handleUpdate(values: ProductFormOutput): Promise<void> {
    if (!token) {
      toast.error("Please log in");
      return;
    }
    if (!editingId) return;
    try {
      const updated = await productsRepo.update(editingId, toRepoPayload(values), token);
      setRows((r) => r.map((p) => (p.id === editingId ? updated : p)));
      setEditingId(null);
      setDefaultValues(undefined);
      setOpen(false);
      toast.success("Product updated");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Update failed");
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!token) {
      toast.error("Please log in");
      return;
    }
    if (!confirm("Delete this product?")) return;

    try {
      await productsRepo.remove(id, token);
      setRows((r) => r.filter((x) => x.id !== id));
      toast.success("Product deleted");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Delete failed");
    }
  }

  function openCreate() {
    setEditingId(null);
    setDefaultValues(undefined);
    setOpen(true);
  }

  function openEdit(p: Product) {
    const validCategories = ["electronics", "fashion", "home & garden", "sports", "books", "beauty"] as const;
    const category = validCategories.includes(p.category as any) 
      ? p.category as typeof validCategories[number]
      : "electronics";

    setEditingId(p.id);
    setDefaultValues({
      title: p.title,
      category,
      price: p.price,
      stock: p.stock,
      image: p.image,
    });
    setOpen(true);
  }

  const [page, setPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(rows.length / perPage) || 1;
  const paginated = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.title}</td>
                <td className="p-3 capitalize">{product.category}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-md border hover:bg-gray-50"
                      title="Edit"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-md border hover:bg-gray-50"
                      title="Delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 text-lg font-semibold">
              {editingId ? "Edit Product" : "Add Product"}
            </div>
            <ProductForm
              defaultValues={defaultValues}
              onSubmit={editingId ? handleUpdate : handleCreate}
              onCancel={() => {
                setOpen(false);
                setEditingId(null);
                setDefaultValues(undefined);
              }}
              onImageUpload={handleFile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
