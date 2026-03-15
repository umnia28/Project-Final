"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerMyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/customer/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading orders...</div>;
  }

  return (
    <div className="text-white max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.order_id}</h2>
                  <p className="text-sm text-zinc-400">
                    Status: {order.order_status}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Payment: {order.payment_status}
                  </p>
                </div>

                <div className="text-sm text-zinc-300 md:text-right">
                  <p>Total: ৳ {order.total_price}</p>
                  {order.date_added && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {new Date(order.date_added).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {(order.shipping_address ||
                order.city ||
                order.shipping_state ||
                order.zip_code ||
                order.country) && (
                <div className="mb-4 bg-zinc-800 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Shipping Address</p>
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

              {order.items && order.items.length > 0 && (
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.order_item_id}
                      className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url || "/placeholder.png"}
                          alt={item.product_name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-zinc-400">
                            Quantity: {item.qty}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-300">৳ {item.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}