"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Layers3 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const API = "http://localhost:5000";

export default function PotteryProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/products?search=Pottery`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set();

    products.forEach((p) => {
      const cat = p.category_name || p.category || p.category_title;
      if (cat) unique.add(cat);
    });

    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = (
        product.category_name ||
        product.category ||
        product.category_title ||
        ""
      ).toLowerCase();

      return (
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase()
      );
    });
  }, [products, selectedCategory]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffdfa_0%,#fbf7f0_55%,#f8f2e9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-[#f6dfff]/30 blur-3xl" />
      <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-[#ffe9d6]/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fff1de]/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* HERO */}
        <div className="mb-8 rounded-[2rem] border border-[#efe6dc] bg-white/90 p-6 shadow">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-wider text-[#6f5a45]">
            <Sparkles className="h-3.5 w-3.5 text-[#9f77c5]" />
            Curated Collection
          </div>

          <h1 className="mt-5 text-3xl font-medium text-[#2d241c] md:text-5xl">
            Pottery Products
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[#7b6c5f] md:text-base">
            Explore handcrafted pottery, sculpted forms, and timeless ceramic pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="rounded-[2rem] border border-[#efe6dc] bg-white p-5 shadow">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-[#8e6aa8]">
                <Layers3 size={18} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-[#2d241c]">
                  Categories
                </h2>
                <p className="text-xs text-[#9a8b7b]">Browse by style</p>
              </div>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                    selectedCategory === cat
                      ? "bg-purple-100 text-[#7b5a9c]"
                      : "border bg-white text-[#6f5a45]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* PRODUCTS */}
          <section>
            {loading ? (
              <div className="p-10 text-center text-[#7b6c5f]">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-[#7b6c5f]">
                No matching products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.product_id || product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}