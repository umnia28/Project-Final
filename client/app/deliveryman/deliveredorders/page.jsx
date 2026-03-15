"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function DeliverymanDeliveredOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/deliveryman/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Delivered orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) => (order.order_status || "").toLowerCase() === "delivered"
    );
  }, [orders]);

  if (loading) {
    return <div className="text-white p-6">Loading delivered orders...</div>;
  }

  return (
    <div className="text-white max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delivered Orders</h1>

      {deliveredOrders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
          No delivered orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {deliveredOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.order_id}</h2>
                  <p className="text-sm text-zinc-400">
                    Status: {order.order_status}
                  </p>
                  {order.delivery_time && (
                    <p className="text-sm text-zinc-500">
                      Delivered at: {new Date(order.delivery_time).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="text-sm text-zinc-300 mt-2 md:mt-0">
                  Total: ৳ {order.total_price}
                </div>
              </div>

              {(order.shipping_address ||
                order.city ||
                order.shipping_state ||
                order.zip_code ||
                order.country) && (
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Delivery Address</p>
                  {order.shipping_address && (
                    <p className="text-sm text-zinc-300">{order.shipping_address}</p>
                  )}
                  {order.city && (
                    <p className="text-sm text-zinc-400">{order.city}</p>
                  )}
                  {order.shipping_state && (
                    <p className="text-sm text-zinc-400">{order.shipping_state}</p>
                  )}
                  {order.zip_code && (
                    <p className="text-sm text-zinc-400">{order.zip_code}</p>
                  )}
                  {order.country && (
                    <p className="text-sm text-zinc-400">{order.country}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}