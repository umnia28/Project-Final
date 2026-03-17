'use client';

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const API = "http://localhost:5000";

export default function SellerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/seller/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load orders");
    }

    setItems(data.items || []);
  };

  const confirmItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/seller/orders/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm order item");
      }

      toast.success("Order item confirmed");
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/seller/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Cancelled by seller" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order item");
      }

      toast.success("Order item cancelled");
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  // group rows by order_id (seller can have multiple items in same order)
  const orders = useMemo(() => {
    const map = new Map();

    for (const row of items) {
      if (!map.has(row.order_id)) {
        map.set(row.order_id, {
          order_id: row.order_id,
          date_added: row.date_added,
          payment_status: row.payment_status,
          payment_method: row.payment_method,
          total_price: row.total_price,
          transaction_id: row.transaction_id,
          latest_status: row.latest_status,
          customer: {
            id: row.customer_id,
            username: row.customer_username,
            email: row.customer_email,
          },
          lines: [],
        });
      }

      map.get(row.order_id).lines.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        qty: row.qty,
        price: row.price,
        discount_amount: row.discount_amount,
        seller_status: row.seller_status,
        seller_confirmed_at: row.seller_confirmed_at,
        seller_cancelled_at: row.seller_cancelled_at,
        cancel_reason: row.cancel_reason,
        delivery_status: row.delivery_status,
      });
    }

    return Array.from(map.values());
  }, [items]);

  return (
    <div className="text-slate-700">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="text-slate-500 mt-2">Orders that include your products.</p>

      {loading ? (
        <p className="text-slate-500 mt-6">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-slate-500 mt-6">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.order_id} className="border rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{o.order_id}</p>
                  <p className="text-xs text-slate-500">
                    {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                    {" • "}
                    {o.customer?.username} ({o.customer?.email})
                  </p>
                </div>

                <div className="text-sm text-slate-600 flex gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-slate-100">
                    {o.latest_status || "no status"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100">
                    {o.payment_status}
                  </span>
                  <Link
                    className="px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-900"
                    href={`/orders/${o.order_id}`}
                  >
                    Open Tracking
                  </Link>
                </div>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="text-left py-2">Product</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Discount</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Action</th>
                      <th className="py-2">Delivery</th>
                    </tr>
                  </thead>

                  <tbody>
                    {o.lines.map((l) => (
                      <tr key={l.order_item_id} className="border-t">
                        <td className="py-2">
                          <div>
                            <p>
                              {l.product_name} (#{l.product_id})
                            </p>

                            {l.seller_confirmed_at && (
                              <p className="text-xs text-green-600 mt-1">
                                Confirmed:{" "}
                                {new Date(l.seller_confirmed_at).toLocaleString()}
                              </p>
                            )}

                            {l.seller_cancelled_at && (
                              <p className="text-xs text-red-600 mt-1">
                                Cancelled:{" "}
                                {new Date(l.seller_cancelled_at).toLocaleString()}
                              </p>
                            )}

                            {l.cancel_reason && (
                              <p className="text-xs text-slate-500 mt-1">
                                Reason: {l.cancel_reason}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-2 text-center">{l.qty}</td>

                        <td className="py-2 text-center">
                          ৳{Number(l.price).toLocaleString()}
                        </td>

                        <td className="py-2 text-center">
                          ৳{Number(l.discount_amount).toLocaleString()}
                        </td>

                        <td className="py-2 text-center">
                          {l.delivery_status}
                        </td>

                        <td className="py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${l.seller_status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : l.seller_status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {l.seller_status}
                          </span>
                        </td>

                        <td className="py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => confirmItem(l.order_item_id)}
                              disabled={l.seller_status !== "pending"}
                              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm
                            </button>

                            <button
                              onClick={() => cancelItem(l.order_item_id)}
                              disabled={l.seller_status !== "pending"}
                              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}