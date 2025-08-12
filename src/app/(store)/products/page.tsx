// // this is /Users/sahibabc/ecomLanding/ecomlanding/src/app/products/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// // import { productsRepo, Product } from "../../../../lib/repos/productsRepo";  // Adjusted import
// import { toast } from "sonner";
// // import ProductForm, { ProductFormOutput } from "../../../../components/admin/ProductForm";  // Adjusted path
// // import { useAuthStore } from "../../../../lib/store/useAuthStore";
// // import Pagination from "../../../../components/common/Pagination";  // Adjusted import
// import { Product, productsRepo } from "@/lib/repos/productsRepo";
// import Pagination from "@/components/common/Pagination";
// import { useAuthStore } from "@/lib/store/useAuthStore";
// import ProductForm, { ProductFormOutput } from "@/components/admin/ProductForm";

// export default function AdminProducts() {
//   const [rows, setRows] = useState<Product[]>([]);
//   const [open, setOpen] = useState(false);
//   const token = useAuthStore((state) => state.user?.token);

//   // Fetch all products when the page loads
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
//       price: values.price, // Already coerced to number by Zod
//       stock: values.stock,
//       image: values.image,  // Optional image field
//     };

//     if (isNaN(sanitizedProduct.price) || isNaN(sanitizedProduct.stock)) {
//       toast.error("Price and stock must be valid numbers");
//       return;
//     }

//     try {
//       console.log("Creating product with:", sanitizedProduct);
//       const created = await productsRepo.create(sanitizedProduct, token);  // Using the repo to create a product
//       setRows((r) => [created, ...r]);
//       setOpen(false);  // Close the modal after successful creation
//       toast.success("Product created");
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
//       await productsRepo.remove(id, token);  // Call to delete product
//       setRows((r) => r.filter((x) => x.id !== id));  // Update the list of products after deletion
//       toast.success("Product deleted");
//     } catch (error) {
//       console.error("Delete product failed:", error);
//       toast.error("Failed to delete product");
//     }
//   }

//   // Pagination logic
//   const [page, setPage] = useState(1);
//   const perPage = 8;
//   const totalPages = Math.ceil(rows.length / perPage);
//   const paginatedProducts = rows.slice((page - 1) * perPage, page * perPage);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={() => setOpen(true)}
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm"
//         >
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>

//       {/* Product Table */}
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
//             {paginatedProducts.map((product) => (
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
//                       onClick={() => toast("Edit feature coming soon")}
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

//       {/* Pagination Component */}
//       <Pagination
//         page={page}
//         setPage={setPage}
//         totalPages={totalPages}
//       />

//       {/* Modal for adding product */}
//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
//             <div className="mb-3 text-lg font-semibold">Add Product</div>
//             <ProductForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import ProductGrid from "@/components/categories/ProductGrid";
import SearchBar from "@/components/categories/SearchBar";
import Pagination from "@/components/common/Pagination";
import { productsRepo } from "@/lib/repos/productsRepo";
import React, { useEffect, useMemo, useState } from "react";
// import { productsRepo } from "../../lib/repos/productsRepo"; // note the path
// import ProductGrid from "../../components/categories/ProductGrid";
// import SearchBar from "../../components/categories/SearchBar";
// import Pagination from "../../components/common/Pagination";

type UIProduct = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
};

// Category filter built from fetched data (no hardcoded categories needed)
function CategoryFilter({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
}) {
  return (
    <select
      className="border rounded-lg px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export default function ProductsPage() {
  const [items, setItems] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI state (same as your previous design)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Fetch products once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await productsRepo.list(); // backend GET /api/products
        // Map repo Product -> UIProduct
        const mapped: UIProduct[] = data.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          price: p.price,
          image: p.image,
          inStock: p.stock > 0, // repo maps boolean -> number; here convert back to boolean
        }));
        if (mounted) setItems(mapped);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Build category list from fetched items
  const computedCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // Filter + sort (same rules as your previous version)
  const filtered = useMemo(() => {
    let list = items;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (category) {
      list = list.filter((p) => p.category === category);
    }

    if (inStock) {
      list = list.filter((p) => p.inStock);
    }

    if (priceRange) {
      const [min, max] = priceRange;
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [items, search, category, inStock, sort, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(page * perPage, filtered.length);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, inStock, sort, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex-1 min-w-[180px]">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <CategoryFilter
          value={category}
          onChange={setCategory}
          categories={computedCategories}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock
        </label>

        <select
          className="border rounded-lg px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title">Name: A-Z</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        {loading
          ? "Loading products…"
          : err
          ? err
          : `Showing ${showingFrom}–${showingTo} of ${filtered.length} results`}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {search && (
          <span className="inline-flex items-center bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
            Search: {search}
            <button className="ml-2" onClick={() => setSearch("")}>
              ×
            </button>
          </span>
        )}
        {category && (
          <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {category}
            <button className="ml-2" onClick={() => setCategory("")}>
              ×
            </button>
          </span>
        )}
        {inStock && (
          <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            In Stock
            <button className="ml-2" onClick={() => setInStock(false)}>
              ×
            </button>
          </span>
        )}
        {sort && (
          <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Sorted:{" "}
            {sort === "price-asc"
              ? "Price: Low-High"
              : sort === "price-desc"
              ? "Price: High-Low"
              : "Name: A-Z"}
            <button className="ml-2" onClick={() => setSort("")}>
              ×
            </button>
          </span>
        )}
        {priceRange && (
          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            Price: ${priceRange[0]}–${priceRange[1]}
            <button className="ml-2" onClick={() => setPriceRange(null)}>
              ×
            </button>
          </span>
        )}
        {(search || category || inStock || sort || priceRange) && (
          <button
            className="inline-flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200"
            onClick={() => {
              setSearch("");
              setCategory("");
              setInStock(false);
              setSort("");
              setPriceRange(null);
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Product grid (uses the same component you already had) */}
      <ProductGrid products={paginated} />

      <div className="mt-8">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
