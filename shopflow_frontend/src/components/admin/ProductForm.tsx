"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for form validation
export const ProductSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  category: z.enum(
    ["electronics", "fashion", "home & garden", "sports", "books", "beauty"],
    "Invalid category"
  ),
  price: z.coerce.number().positive("Price must be > 0"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  image: z.string().optional(), // Image can be a URL or empty
});

// Types for form input and output based on Zod schema
export type ProductFormInput = z.input<typeof ProductSchema>;
export type ProductFormOutput = z.output<typeof ProductSchema>;

export default function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  onImageUpload,
}: {
  defaultValues?: Partial<ProductFormInput>;
  onSubmit: (values: ProductFormOutput) => Promise<void> | void;
  onCancel: () => void;
  onImageUpload: (file: File) => Promise<string>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, any, ProductFormOutput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      category: "electronics", // Default category
      price: "",
      stock: "",
      image: "", // Optional image URL
      ...defaultValues,
    },
  });

  const imageSource = watch("image");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await onImageUpload(file);
    setValue("image", imageUrl);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Title</label>
        <input
          {...register("title")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        {errors.title && (
          <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Category</label>
        <select
          {...register("category")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm capitalize"
        >
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home & garden">Home & Garden</option>
          <option value="sports">Sports</option>
          <option value="books">Books</option>
          <option value="beauty">Beauty</option>
        </select>
        {errors.category && (
          <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        <div className="mt-2 text-sm text-gray-500">
          Or paste an image URL below:
        </div>
        <input
          {...register("image")}
          placeholder="Image URL"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        {errors.image && (
          <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>
        )}
        {imageSource && (
          <div className="mt-2">
            <img
              src={imageSource}
              alt="Preview"
              className="max-h-40 rounded-md"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.price && (
            <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.stock && (
            <p className="text-xs text-red-600 mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md border text-sm"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          className="px-3 py-1.5 rounded-md bg-teal-600 text-white text-sm"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
