'use client'
import { Suspense, useCallback, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchDbProducts } from "@/lib/features/product/productSlice"

function ShopContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ""
  const router = useRouter()
  const dispatch = useDispatch()

  const products = useSelector((state) => state.product.list || [])

  const loadProducts = useCallback(() => {
    dispatch(fetchDbProducts(search))
  }, [dispatch, search])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Refetch when tab becomes active again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadProducts()
      }
    }

    const handleFocus = () => {
      loadProducts()
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [loadProducts])

  const filteredProducts = search
    ? products.filter((p) =>
        (p.name || p.product_name || "").toLowerCase().includes(search.toLowerCase())
      )
    : products

  return (
    <div className="relative min-h-[70vh] overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-pink-50 via-white to-orange-50" />
      <div className="pointer-events-none absolute -top-20 left-0 -z-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-0 -z-10 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Charis Atelier Collection
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
              {search ? `Results for “${search}”` : "All Products"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600">
              Explore handcrafted beauty, timeless décor, and curated artistic finds.
            </p>
          </div>

          {search && (
            <button
              onClick={() => router.push('/shop')}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <MoveLeftIcon size={16} />
              Back to all products
            </button>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/65 p-5 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl sm:p-7">
          {filteredProducts.length > 0 ? (
            <div className="mx-auto mb-10 grid grid-cols-2 gap-6 sm:flex sm:flex-wrap xl:gap-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.product_id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center">
              <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white/85 via-pink-50/70 to-orange-50/60 px-8 py-12 text-center shadow-[0_15px_40px_rgba(244,114,182,0.08)]">
                <h2 className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-2xl font-semibold text-transparent">
                  No products found
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                  We couldn’t find anything matching your search.
                  Try a different keyword or explore the full collection.
                </p>

                {search && (
                  <button
                    onClick={() => router.push('/shop')}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(236,72,153,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(168,85,247,0.28)]"
                  >
                    <MoveLeftIcon size={16} />
                    View all products
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="rounded-[1.75rem] border border-white/60 bg-white/75 px-8 py-6 text-slate-600 shadow-[0_15px_40px_rgba(168,85,247,0.08)] backdrop-blur-md">
            Loading shop...
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}


/*'use client';

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  // ✅ your dummy products (productDummyData) already stored in redux
  const dummyProducts = useSelector((state) => state.product.list);

  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDb = async () => {
    const res = await fetch(`${API}/api/products?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load products");

    // ✅ map DB fields -> UI fields
    const mapped = (data.products || []).map((p) => ({
      id: String(p.product_id), // keep as string for consistency
      name: p.product_name,
      description: p.product_description || "",
      price: Number(p.price),
      images: [p.thumbnail || "/placeholder.png"], // safe
      category: p.category_name || "Uncategorized",
      inStock: (p.product_count ?? 0) > 0,
      storeId: String(p.store_id),
      store: { name: p.store_name }, // optional if your card expects store.name
      createdAt: p.date_added,
    }));

    setDbProducts(mapped);
  };

  useEffect(() => {
    setLoading(true);
    loadDb().catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [search]);

  // ✅ merge (dummy + db) no duplicates by id
  const mergedProducts = useMemo(() => {
    const map = new Map();
    for (const p of dummyProducts || []) map.set(String(p.id), p);
    for (const p of dbProducts || []) map.set(String(p.id), p);
    return Array.from(map.values());
  }, [dummyProducts, dbProducts]);

  if (loading) return <p className="p-6 text-slate-500">Loading...</p>;

  return (
    <div className="p-6">
      <p className="text-slate-500 mb-4">
        Showing {mergedProducts.length} products (Dummy + DB)
      </p>

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mergedProducts.map((p) => (
          <div key={p.id} className="border rounded-xl p-4">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-slate-500">{p.category}</p>
            <p className="mt-2">৳{Number(p.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
*/