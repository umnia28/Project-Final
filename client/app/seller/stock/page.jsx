"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

export default function SellerStockPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/seller/stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setItems(res.data.items || []);
      } catch (err) {
        console.error("Seller stock fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const handleChange = (productId, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, product_count: value }
          : item
      )
    );
  };

  const handleSave = async (productId, product_count) => {
    try {
      setSavingId(productId);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/seller/stock/${productId}`,
        { product_count: Number(product_count) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert("Stock updated successfully");
    } catch (err) {
      console.error("Stock update error:", err);
      alert(err.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="text-white max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>

      {items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
          No products found.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-lg">{item.product_name}</p>
                <p className="text-sm text-zinc-400">Price: ৳ {item.price}</p>
                <p className="text-sm text-zinc-500">
                  Status: {item.status} | Store: {item.store_name}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={item.product_count}
                  onChange={(e) => handleChange(item.product_id, e.target.value)}
                  className="w-28 p-2 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
                />

                <button
                  onClick={() => handleSave(item.product_id, item.product_count)}
                  disabled={savingId === item.product_id}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition font-semibold"
                >
                  {savingId === item.product_id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}