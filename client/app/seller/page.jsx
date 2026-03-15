"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  TagsIcon,
  StoreIcon,
} from "lucide-react";

export default function SellerDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      total_products: 0,
      total_revenue: 0,
      total_orders: 0,
      total_stores: 0,
    },
    recentOrders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/seller/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(res.data);
      } catch (err) {
        console.error("Seller dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const { stats, recentOrders } = data;

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Revenue",
      value: currency + stats.total_revenue,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: TagsIcon,
    },
    {
      title: "Total Stores",
      value: stats.total_stores,
      icon: StoreIcon,
    },
  ];

  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">
        Seller <span className="text-slate-800 font-medium">Dashboard</span>
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

      <div className="border border-slate-200 rounded-lg p-5 bg-white">
        <h2 className="text-lg font-medium text-slate-700 mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-slate-500">No recent orders found.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-slate-700">
                    Order #{order.order_id}
                  </p>
                  <p className="text-sm text-slate-500">
                    Status: {order.latest_status || order.order_status || "placed"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Customer: {order.customer_full_name || order.customer_username || "N/A"}
                  </p>
                </div>

                <div className="text-sm text-slate-700 font-medium">
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