'use client';

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { Sparkles, Layers3, ShoppingBag } from "lucide-react";

const API = "http://localhost:5000";

export default function HandicraftProductsPage() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingId, setAddingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/products?search=Hand`);
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

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "/placeholder.png";

    const clean = url.trim().replace(/^"+|"+$/g, "");
    if (!clean) return "/placeholder.png";

    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    if (clean.startsWith("/")) {
      return `${API}${clean}`;
    }

    return `${API}/${clean}`;
  };

  const getImageFromProduct = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const item of product.images) {
        if (typeof item === "string") {
          const parsed = normalizeImageUrl(item);
          if (parsed) return parsed;
        }

        if (item && typeof item === "object") {
          const possible =
            item.image_url ||
            item.url ||
            item.image ||
            item.src ||
            item.path;

          const parsed = normalizeImageUrl(possible);
          if (parsed) return parsed;
        }
      }
    }

    if (typeof product.images === "string" && product.images.trim() !== "") {
      const raw = product.images.trim();

      if (raw.startsWith("{") && raw.endsWith("}")) {
        const parsedItems = raw
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^"+|"+$/g, ""))
          .filter(Boolean);

        if (parsedItems.length > 0) {
          return normalizeImageUrl(parsedItems[0]);
        }
      }

      return normalizeImageUrl(raw);
    }

    return normalizeImageUrl(
      product.image_url ||
        product.image ||
        product.product_image ||
        product.thumbnail ||
        product.poster ||
        product.cover_url
    );
  };

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

  const handleAddToCart = (product) => {
    try {
      setAddingId(product.product_id);

      dispatch(
        addToCart({
          productId: product.product_id,
        })
      );

      const savedDetails = JSON.parse(localStorage.getItem("cartProductDetails") || "{}");

      savedDetails[product.product_id] = {
        id: product.product_id,
        name: product.product_name,
        price: Number(product.price || 0),
        category:
          product.category_name || product.category || product.category_title || "",
        images: [getImageFromProduct(product)],
      };

      localStorage.setItem("cartProductDetails", JSON.stringify(savedDetails));

      toast.success("Added to cart ✅");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Could not add to cart");
    } finally {
      setTimeout(() => setAddingId(null), 300);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-orange-50 px-4 py-8">
      <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-purple-200/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8 rounded-[2rem] border border-white/60 bg-white/65 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Curated Collection
          </div>

          <h1 className="mt-5 text-3xl font-semibold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text md:text-5xl">
            Handicraft Products
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Explore handcrafted treasures, artisan-made details, and timeless creations that celebrate culture, craftsmanship, and elegant design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-[0_15px_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow">
                <Layers3 size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Categories
                </h2>
                <p className="text-xs text-slate-400">
                  Browse by style
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow-md"
                      : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="rounded-[2rem] border border-white/60 bg-white/70 p-10 text-center text-slate-500 shadow-[0_15px_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-white/60 bg-white/70 p-10 text-center text-slate-500 shadow-[0_15px_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
                No matching products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const image = getImageFromProduct(product);
                  const price = Number(product.price || 0);
                  const discount = Number(product.discount || 0);
                  const finalPrice =
                    discount > 0 ? price - (price * discount) / 100 : price;

                  return (
                    <div
                      key={product.product_id}
                      className="group overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 shadow-[0_15px_40px_rgba(244,114,182,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(236,72,153,0.14)] backdrop-blur-xl"
                    >
                      <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-pink-50 via-white to-orange-50">
                        <img
                          src={image}
                          alt={product.product_name || "Product image"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                        {(product.category_name || product.category || product.category_title) && (
                          <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                            {product.category_name || product.category || product.category_title}
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="line-clamp-1 text-lg font-semibold text-slate-800">
                            {product.product_name}
                          </h2>
                        </div>

                        <p className="min-h-[44px] line-clamp-2 text-sm leading-6 text-slate-500">
                          {product.product_description || "No description available."}
                        </p>

                        <div className="mt-4">
                          {discount > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-bold text-slate-900">
                                ৳{finalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-400 line-through">
                                ৳{price.toFixed(2)}
                              </span>
                              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                                -{discount}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-slate-900">
                              ৳{price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {product.store_name && (
                          <p className="mt-2 text-xs text-slate-400">
                            Store: {product.store_name}
                          </p>
                        )}

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.product_id}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-3 font-medium text-white shadow-[0_12px_30px_rgba(236,72,153,0.20)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                        >
                          <ShoppingBag size={16} />
                          {addingId === product.product_id ? "Adding..." : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}