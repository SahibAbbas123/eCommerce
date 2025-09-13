// "use client";

// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";  // Icons for edit and delete
// import { productsRepo } from "../../../../lib/repos/productsRepo";  // Correct path for productsRepo
// import ProductForm, { ProductFormOutput } from "../../../../components/admin/ProductForm";  // Correct path for ProductForm
// import { useAuthStore } from "../../../../lib/store/useAuthStore";  // Correct path for useAuthStore
// import { toast } from "sonner";  // Toast notification for success/error

// export default function AdminProducts() {
//   const [rows, setRows] = useState<any[]>([]);  // List of products
//   const [open, setOpen] = useState(false);  // Modal open/close state
//   const token = useAuthStore((state) => state.user?.token);  // Get token from the auth store

//   // Fetch products when page loads
//   useEffect(() => {
//     productsRepo.list()
//       .then(setRows)
//       .catch((err) => {
//         console.error("Error loading products:", err);
//         toast.error("Failed to load products");
//       });
//   }, []);

//   // Handle product creation
//   async function handleCreate(values: ProductFormOutput) {
//     console.log("handleCreate values:", values);

//     if (!token) {
//       toast.error("Please log in to create a product");
//       return;
//     }

//     const sanitizedProduct = {
//       title: values.title.trim(),
//       category: values.category.trim(),
//       price: values.price,
//       stock: values.stock,
//       image: values.image,  // Optional image URL
//     };

//     try {
//       const created = await productsRepo.create(sanitizedProduct, token);  // Create product API call
//       setRows((r) => [created, ...r]);  // Update product list
//       setOpen(false);  // Close the modal
//       toast.success("Product created successfully");
//     } catch (error) {
//       console.error("Create product failed:", error);
//       toast.error("Failed to create product");
//     }
//   }

//   // Handle product deletion
//   async function handleDelete(id: string) {
//     if (!token) {
//       toast.error("Please log in to delete a product");
//       return;
//     }

//     try {
//       await productsRepo.remove(id, token);  // Delete product API call
//       setRows((r) => r.filter((x) => x.id !== id));  // Remove deleted product from list
//       toast.success("Product deleted successfully");
//     } catch (error) {
//       console.error("Delete product failed:", error);
//       toast.error("Failed to delete product");
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Products</h1>
//         <button
//           onClick={() => setOpen(true)}  // Open modal for adding product
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm"
//         >
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>

//       <div className="rounded-xl border bg-white overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-left">
//             <tr>
//               <th className="p-3">Title</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((p: any) => (
//               <tr key={p.id} className="border-t">
//                 <td className="p-3">{p.title}</td>
//                 <td className="p-3">{p.category}</td>
//                 <td className="p-3">${p.price.toFixed(2)}</td>
//                 <td className="p-3">{p.stock}</td>
//                 <td className="p-3">
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="p-2 rounded-md border hover:bg-gray-50"
//                       title="Edit"
//                       onClick={() => toast("Edit feature coming soon")}  // Placeholder for edit functionality
//                     >
//                       <Pencil className="w-4 h-4" />
//                     </button>
//                     <button
//                       className="p-2 rounded-md border hover:bg-gray-50"
//                       title="Delete"
//                       onClick={() => handleDelete(p.id)}  // Delete product
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {rows.length === 0 && (
//               <tr>
//                 <td className="p-6 text-center text-gray-500" colSpan={5}>
//                   No products available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for Add Product */}
//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
//             <div className="mb-3 text-lg font-semibold">Add Product</div>
//             <ProductForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />  {/* ProductForm for adding product */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// // import { productsRepo, Product, CreateOrUpdateInput } from "../../../lib/repos/productsRepo";
// import { toast } from "sonner";
// // import ProductForm, { ProductFormOutput } from "../../../components/admin/ProductForm";
// // import { useAuthStore } from "../../../lib/store/useAuthStore";
// // import Pagination from "../../../components/common/Pagination";
// import { useAuthStore } from "@/lib/store/useAuthStore";
// import Pagination from "@/components/common/Pagination";
// import ProductForm, { ProductFormOutput } from "@/components/admin/ProductForm";
// import { CreateOrUpdateInput, Product, productsRepo } from "@/lib/repos/productsRepo";

// export default function AdminProducts() {
//   const [rows, setRows] = useState<Product[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [defaultValues, setDefaultValues] = useState<Partial<ProductFormOutput> | undefined>(undefined);

//   const token = useAuthStore((s) => s.user?.token);

//   useEffect(() => {
//     productsRepo.list()
//       .then(setRows)
//       .catch((err) => {
//         console.error("Error loading products:", err);
//         toast.error("Failed to load products");
//       });
//   }, []);

//   function toRepoPayload(values: ProductFormOutput): CreateOrUpdateInput {
//     return {
//       title: values.title.trim(),
//       category: values.category.trim(),
//       price: values.price,
//       stock: values.stock,
//       image: values.image,
//       description: "", // your current form doesn’t collect description
//     };
//   }

//   async function handleCreate(values: ProductFormOutput) {
//     if (!token) return toast.error("Please log in");
//     try {
//       const created = await productsRepo.create(toRepoPayload(values), token);
//       setRows((r) => [created, ...r]);
//       setOpen(false);
//       toast.success("Product created");
//     } catch (e: any) {
//       console.error(e);
//       toast.error(e?.message || "Create failed");
//     }
//   }

//   async function handleUpdate(values: ProductFormOutput) {
//     if (!token) return toast.error("Please log in");
//     if (!editingId) return;
//     try {
//       const updated = await productsRepo.update(editingId, toRepoPayload(values), token);
//       setRows((r) => r.map((p) => (p.id === editingId ? updated : p)));
//       setEditingId(null);
//       setDefaultValues(undefined);
//       setOpen(false);
//       toast.success("Product updated");
//     } catch (e: any) {
//       console.error(e);
//       toast.error(e?.message || "Update failed");
//     }
//   }

//   function openCreate() {
//     setEditingId(null);
//     setDefaultValues(undefined);
//     setOpen(true);
//   }

//   function openEdit(p: Product) {
//     setEditingId(p.id);
//     setDefaultValues({
//       title: p.title,
//       category: p.category,
//       price: p.price,
//       stock: p.stock,
//       image: p.image,
//     });
//     setOpen(true);
//   }

//   async function handleDelete(id: string) {
//     if (!token) return toast.error("Please log in");
//     if (!confirm("Delete this product?")) return;
//     try {
//       await productsRepo.remove(id, token);
//       setRows((r) => r.filter((x) => x.id !== id));
//       toast.success("Product deleted");
//     } catch (e: any) {
//       console.error(e);
//       toast.error(e?.message || "Delete failed");
//     }
//   }

//   // Pagination
//   const [page, setPage] = useState(1);
//   const perPage = 8;
//   const totalPages = Math.ceil(rows.length / perPage) || 1;
//   const paginated = rows.slice((page - 1) * perPage, page * perPage);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={openCreate}
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm"
//         >
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>

//       <div className="rounded-xl border bg-white overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-left">
//             <tr>
//               <th className="p-3">Title</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((product) => (
//               <tr key={product.id} className="border-t">
//                 <td className="p-3">{product.title}</td>
//                 <td className="p-3">{product.category}</td>
//                 <td className="p-3">${product.price.toFixed(2)}</td>
//                 <td className="p-3">{product.stock}</td>
//                 <td className="p-3">
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="p-2 rounded-md border hover:bg-gray-50"
//                       title="Edit"
//                       onClick={() => openEdit(product)}
//                     >
//                       <Pencil className="w-4 h-4" />
//                     </button>
//                     <button
//                       className="p-2 rounded-md border hover:bg-gray-50"
//                       title="Delete"
//                       onClick={() => handleDelete(product.id)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {rows.length === 0 && (
//               <tr>
//                 <td className="p-6 text-center text-gray-500" colSpan={5}>
//                   No products available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination page={page} setPage={setPage} totalPages={totalPages} />

//       {/* Modal (same design, same ProductForm for create/edit) */}
//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
//             <div className="mb-3 text-lg font-semibold">
//               {editingId ? "Edit Product" : "Add Product"}
//             </div>
//             <ProductForm
//               defaultValues={defaultValues}
//               onSubmit={editingId ? handleUpdate : handleCreate}
//               onCancel={() => {
//                 setOpen(false);
//                 setEditingId(null);
//                 setDefaultValues(undefined);
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
// import { productsRepo, Product, CreateOrUpdateInput } from "../../../lib/repos/productsRepo";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { CreateOrUpdateInput, Product, productsRepo } from "@/lib/repos/productsRepo";
import ProductForm, { ProductFormOutput } from "@/components/admin/ProductForm";
import Pagination from "@/components/common/Pagination";
// import ProductForm, { ProductFormOutput } from "../../../components/admin/ProductForm";
// import { useAuthStore } from "../../../lib/store/useAuthStore";
// import Pagination from "../../../components/common/Pagination";

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<Partial<ProductFormOutput> | undefined>(undefined);

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
      stock: values.stock,
      image: values.image,
      description: "", // (form doesn’t collect description)
    };
  }

  // ✅ Promise<void> and never return a toast result
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

  // ✅ Promise<void> and never return a toast result
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

  // unchanged logic; just ensure we don't return toast value
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
    setEditingId(p.id);
    setDefaultValues({
      title: p.title,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,
    });
    setOpen(true);
  }

  // Pagination
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
                <td className="p-3">{product.category}</td>
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

      {/* Modal (same ProductForm for create/edit) */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
