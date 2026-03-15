"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerDashboardPage() {
  const [data, setData] = useState({
    stats: {
      total_orders: 0,
      pending_orders: 0,
      delivered_orders: 0,
      wishlist_count: 0,
      unread_notifications: 0,
    },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/customer/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading dashboard...</div>;
  }

  const { stats, recentOrders } = data;

  return (
    <div className="text-white max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold mt-2">{stats.total_orders}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Pending Orders</p>
          <h2 className="text-2xl font-bold mt-2">{stats.pending_orders}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Delivered Orders</p>
          <h2 className="text-2xl font-bold mt-2">{stats.delivered_orders}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Wishlist Items</p>
          <h2 className="text-2xl font-bold mt-2">{stats.wishlist_count}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Unread Notifications</p>
          <h2 className="text-2xl font-bold mt-2">{stats.unread_notifications}</h2>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-zinc-400">No recent orders found.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-zinc-800 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">Order #{order.order_id}</p>
                  <p className="text-sm text-zinc-400">
                    Status: {order.order_status}
                  </p>
                </div>

                <div className="text-sm text-zinc-300 mt-2 md:mt-0">
                  ৳ {order.total_price}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}