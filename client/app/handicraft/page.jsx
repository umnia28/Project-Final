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

    if (clean.startsWith("/uploads/")) {
      return `${API}${clean}`;
    }

    if (clean.startsWith("/")) {
      return clean;
    }

    return `${API}/uploads/${clean}`;
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

      const savedDetails = JSON.parse(
        localStorage.getItem("cartProductDetails") || "{}"
      );

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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffdfa_0%,#fbf7f0_55%,#f8f2e9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-[#f6dfff]/30 blur-3xl" />
      <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-[#ffe9d6]/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fff1de]/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#efe6dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-6 shadow-[0_18px_45px_rgba(91,68,46,0.06)] md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[linear-gradient(90deg,#fbf0ff,#fff3ea,#fff8ee)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f5a45]">
            <Sparkles className="h-3.5 w-3.5 text-[#9f77c5]" />
            Curated Collection
          </div>

          <h1 className="mt-5 font-display text-3xl font-medium tracking-tight text-[#2d241c] md:text-5xl">
            Handicraft Products
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7b6c5f] md:text-base">
            Explore handcrafted treasures, artisan-made details, and timeless
            creations that celebrate culture, craftsmanship, and refined design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-[#efe6dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-5 shadow-[0_18px_45px_rgba(91,68,46,0.06)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f1e4ff,#ffe7d5)] text-[#8e6aa8] shadow-sm">
                <Layers3 size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg font-medium text-[#2d241c]">
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
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-[linear-gradient(90deg,#f1e6ff,#fff0e1)] text-[#7b5a9c] shadow-[0_10px_22px_rgba(143,106,184,0.10)]"
                      : "border border-[#eadfce] bg-[#fffdfa] text-[#6f5a45] hover:-translate-y-0.5 hover:bg-[#fff8f2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="rounded-[2rem] border border-[#efe6dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-10 text-center text-[#7b6c5f] shadow-[0_18px_45px_rgba(91,68,46,0.06)]">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-[#efe6dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-10 text-center text-[#7b6c5f] shadow-[0_18px_45px_rgba(91,68,46,0.06)]">
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
                      className="group overflow-hidden rounded-[1.75rem] border border-[#efe6dc] bg-[linear-gradient(180deg,#fffdfa,#fff8f2)] shadow-[0_15px_40px_rgba(91,68,46,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(91,68,46,0.10)]"
                    >
                      <div className="relative h-64 w-full overflow-hidden bg-[linear-gradient(180deg,#fffaf5,#f9f2ea)]">
                        <img
                          src={image}
                          alt={product.product_name || "Product image"}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />

                        <div className="pointer-events-none absolute bottom-3 left-1/2 h-6 w-[58%] -translate-x-1/2 rounded-full bg-[#8b6b47]/10 blur-2xl" />

                        {(product.category_name ||
                          product.category ||
                          product.category_title) && (
                          <span className="absolute right-4 top-4 rounded-full border border-[#eadfce] bg-[#fffdfa]/95 px-3 py-1 text-xs font-medium text-[#6f5a45] shadow-sm backdrop-blur">
                            {product.category_name ||
                              product.category ||
                              product.category_title}
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="line-clamp-1 font-display text-xl font-medium text-[#2d241c]">
                            {product.product_name}
                          </h2>
                        </div>

                        <p className="min-h-[48px] line-clamp-2 text-sm leading-6 text-[#7b6c5f]">
                          {product.product_description || "No description available."}
                        </p>

                        <div className="mt-4">
                          {discount > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-semibold text-[#2d241c]">
                                ৳{finalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-[#b4a89a] line-through">
                                ৳{price.toFixed(2)}
                              </span>
                              <span className="rounded-full bg-[linear-gradient(90deg,#ffe7dd,#fff0ea)] px-2.5 py-1 text-xs font-semibold text-[#b55b50]">
                                -{discount}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-semibold text-[#2d241c]">
                              ৳{price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {product.store_name && (
                          <p className="mt-2 text-xs text-[#9a8b7b]">
                            Store: {product.store_name}
                          </p>
                        )}

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.product_id}
                          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                            addingId === product.product_id
                              ? "bg-[linear-gradient(90deg,#efe2ff,#f7ecff)] text-[#7b5a9c] opacity-80"
                              : "bg-[linear-gradient(90deg,#ffd8bf,#ffecd9)] text-[#9a5e30] shadow-[0_10px_22px_rgba(218,143,85,0.14)] hover:-translate-y-0.5"
                          }`}
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