"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import {
  PackageIcon,
  Clock3Icon,
  CheckCircle2Icon,
  HeartIcon,
  BellIcon,
} from "lucide-react";

export default function CustomerDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_orders: 0,
      pending_orders: 0,
      delivered_orders: 0,
      wishlist_count: 0,
      unread_notifications: 0,
    },
    recentOrders: [],
  });

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

        setDashboardData(res.data);
      } catch (err) {
        console.error("Customer dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  const { stats, recentOrders } = dashboardData;

  const dashboardCardsData = [
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: PackageIcon,
    },
    {
      title: "Pending Orders",
      value: stats.pending_orders,
      icon: Clock3Icon,
    },
    {
      title: "Delivered Orders",
      value: stats.delivered_orders,
      icon: CheckCircle2Icon,
    },
    {
      title: "Wishlist Items",
      value: stats.wishlist_count,
      icon: HeartIcon,
    },
    {
      title: "Unread Notifications",
      value: stats.unread_notifications,
      icon: BellIcon,
    },
  ];

  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">
        Customer <span className="text-slate-800 font-medium">Dashboard</span>
      </h1>

      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg bg-white"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-slate-700">{card.value}</b>
            </div>
            <card.icon
              size={50}
              className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
            />
          </div>
        ))}
      </div>

      <div className="border border-slate-200 rounded-lg bg-white p-5">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No recent orders found.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col md:flex-row md:items-center md:justify-between border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-slate-800">Order #{order.order_id}</p>
                  <p className="text-sm text-slate-500 capitalize">
                    Status: {order.order_status}
                  </p>
                  {order.date_added && (
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(order.date_added).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="text-sm text-slate-700 mt-2 md:mt-0 font-medium">
                  {currency} {order.total_price}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}