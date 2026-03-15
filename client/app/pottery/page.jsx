'use client';

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/features/cart/cartSlice";

const API = "http://localhost:5000";

export default function PotteryProductsPage() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingId, setAddingId] = useState(null);

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
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Pottery Products
          </h1>
          <p className="text-slate-500 mt-2">
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white border rounded-2xl p-5 h-fit shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Categories
            </h2>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-slate-500 shadow-sm">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-slate-500 shadow-sm">
                No matching products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const image = getImageFromProduct(product);
                  const price = Number(product.price || 0);
                  const discount = Number(product.discount || 0);
                  const finalPrice =
                    discount > 0 ? price - (price * discount) / 100 : price;

                  return (
                    <div
                      key={product.product_id}
                      className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-full h-56 bg-slate-100 overflow-hidden">
                        <img
                          src={image}
                          alt={product.product_name || "Product image"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-lg font-semibold text-slate-800 line-clamp-1">
                            {product.product_name}
                          </h2>

                          {(product.category_name || product.category || product.category_title) && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap">
                              {product.category_name || product.category || product.category_title}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                          {product.product_description || "No description available."}
                        </p>

                        <div className="mt-4">
                          {discount > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl font-bold text-slate-900">
                                ৳{finalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-400 line-through">
                                ৳{price.toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
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
                          <p className="text-xs text-slate-400 mt-2">
                            Store: {product.store_name}
                          </p>
                        )}

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.product_id}
                          className="w-full mt-4 bg-slate-900 text-white py-2.5 rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
                        >
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