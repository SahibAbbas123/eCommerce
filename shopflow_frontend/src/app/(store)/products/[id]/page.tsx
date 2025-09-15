// src/app/products/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, Star, Heart, ShoppingCart, Share2, Truck, Shield, RefreshCw, 
  ChevronLeft, ChevronRight, Plus, Minus, Check, X, ThumbsUp, ThumbsDown
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
// import { useCartStore } from "../../../lib/store/useCartStore"; // <- import cart store

// --- Mock Data & Types ---
interface Product {
  id: string;
  title: string;
  brand: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount?: number;
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  category?: string;
  subcategory?: string;
  images?: string[];
  colors?: Array<{ name: string; value: string; available: boolean }>;
  sizes?: Array<{ name: string; available: boolean }>;
  features?: string[];
  specifications?: Record<string, string>;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

interface ImageGalleryProps {
  images: string[];
}

interface ProductInfoProps {
  product: Product;
}

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
}

// --- Static Data (for now) ---
const staticSpecifications = {
  "Model": "AG-2025",
  "Brand": "ApparGear",
  "Weight": "250g",
  "Dimensions": "12 x 8 x 5 cm",
  "Material": "Aluminium + Plastic",
  "Color": "Black / Red / Blue",
  "Warranty": "1 Year Manufacturer Warranty",
  "SKU": "AG2025-XL",
  "Category": "Accessories",
  "Subcategory": "Mouse"
};

const staticFeatures = [
  "Ergonomic design for comfort",
  "RGB lighting with multiple modes",
  "High precision optical sensor",
  "Durable buttons with 10 million clicks",
  "Plug and play, no driver required"
];

const staticColors = [
  { name: "Black", value: "#000000", available: true },
  { name: "Red", value: "#FF0000", available: true },
  { name: "Blue", value: "#0000FF", available: false },
];

const staticSizes = [
  { name: "Small", available: true },
  { name: "Medium", available: true },
  { name: "Large", available: false },
];

// --- ImageGallery Component ---
const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img src={images[current]} alt={`Product ${current + 1}`} className="w-full h-full object-cover" />
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${current === i ? 'border-teal-500' : 'border-gray-200'}`}>
            <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- ProductInfo Component (FIXED for Add to Cart) ---
const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/placeholder.png",
      quantity,
    });
    setQuantity(1); // reset quantity after adding
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-gray-500">Price: ${product.price}</p>
      <p className="text-gray-500">{product.inStock ? "In Stock" : "Out of Stock"}</p>
      <p className="text-gray-500">SKU: {staticSpecifications.SKU}</p>
      <p className="text-gray-500">Category: {staticSpecifications.Category} / {staticSpecifications.Subcategory}</p>

      <div className="flex items-center space-x-2">
        <button onClick={() => setQuantity(q => Math.max(q - 1, 1))} className="px-2 py-1 border rounded">
          <Minus className="w-4 h-4" />
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 border rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-teal-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-teal-700 transition"
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </button>
    </div>
  );
};

// --- ProductTabs Component ---
const ProductTabs: React.FC<ProductTabsProps> = ({ product, reviews }) => {
  const [tab, setTab] = useState('description');

  return (
    <div className="mt-8">
      <div className="flex space-x-4 border-b">
        <button onClick={() => setTab('description')} className={`pb-2 ${tab==='description'?'border-b-2 border-teal-600':''}`}>Description</button>
        <button onClick={() => setTab('specs')} className={`pb-2 ${tab==='specs'?'border-b-2 border-teal-600':''}`}>Specifications</button>
        <button onClick={() => setTab('reviews')} className={`pb-2 ${tab==='reviews'?'border-b-2 border-teal-600':''}`}>Reviews</button>
      </div>

      <div className="pt-4">
        {tab === 'description' && (
          <div>
            <p>{product.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold">Features:</h3>
              <ul className="list-disc ml-5 mt-2">
                {staticFeatures.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <h3 className="font-semibold mt-4">Available Colors:</h3>
              <div className="flex space-x-2 mt-2">
                {staticColors.map(c => (
                  <div key={c.name} className={`w-6 h-6 rounded-full border ${c.available ? 'border-gray-400' : 'border-red-400'}`} style={{ backgroundColor: c.value }} title={c.name}></div>
                ))}
              </div>
              <h3 className="font-semibold mt-4">Sizes:</h3>
              <div className="flex space-x-2 mt-2">
                {staticSizes.map(s => (
                  <span key={s.name} className={`px-2 py-1 border rounded ${s.available ? 'border-gray-400' : 'border-red-400 line-through'}`}>{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'specs' && (
          <div>
            {Object.entries(staticSpecifications).map(([k,v]) => (
              <div key={k} className="flex justify-between py-1 border-b">
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => (
              <div key={r.id} className="border-b py-2">
                <div className="flex items-center space-x-2">
                  <img src={r.avatar} className="w-8 h-8 rounded-full" />
                  <span>{r.user}</span>
                </div>
                <p>{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- ProductDetailsPage ---
const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch("https://shopflow-backend.onrender.com/api/products");
        const data: Product[] = await res.json();
        const found = data.find(p => p.id === id);
        setProduct(found || null);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery images={product.images || [product.image || "/placeholder.png"]} />
        <ProductInfo product={product} />
      </div>
      <ProductTabs product={product} reviews={[]} />
    </div>
  );
};

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false};
  }
  static getDerivedStateFromError() { return {hasError: true}; }
  render() {
    if (this.state.hasError) return <p>Something went wrong. <button onClick={() => window.location.reload()}>Refresh</button></p>;
    return this.props.children;
  }
}

// --- Export page ---
export default function Page() {
  return (
    <ErrorBoundary>
      <ProductDetailsPage />
    </ErrorBoundary>
  );
}
