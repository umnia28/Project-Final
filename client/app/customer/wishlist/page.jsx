"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerWishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/customer/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/customer/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  if (loading) return <div className="text-white p-6">Loading wishlist...</div>;

  return (
    <div className="text-white max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => (
            <div
              key={item.product_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <img
                src={item.image_url || "/placeholder.png"}
                alt={item.product_name}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{item.product_name}</h2>
                <p className="text-pink-400 font-bold mb-1">৳ {item.price}</p>

                {item.discount > 0 && (
                  <p className="text-sm text-zinc-400 mb-1">Discount: ৳ {item.discount}</p>
                )}

                <p className="text-sm text-zinc-400 mb-4">
                  {item.product_count > 0 ? "In Stock" : "Out of Stock"}
                </p>

                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}