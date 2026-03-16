/*"use client";

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
  */

"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  TagsIcon,
  StoreIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  StoreIcon as SellerStoreIcon,
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
      accent: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Total Revenue",
      value: `${currency}${stats.total_revenue}`,
      icon: CircleDollarSignIcon,
      accent: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: TagsIcon,
      accent: "from-violet-500 to-fuchsia-500",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Stores",
      value: stats.total_stores,
      icon: StoreIcon,
      accent: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
          <div className="bg-white rounded-3xl px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
                <SellerStoreIcon size={16} />
                Seller Control Panel
              </div>

              <h1 className="mt-5 text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
                Seller Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500 leading-7">
                Track your store performance, orders, and revenue from one elegant
                dashboard designed to help you grow faster.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[260px]">
              <div className="rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 border border-white/50">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <SparklesIcon size={16} />
                  Revenue
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {currency}{stats.total_revenue}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 p-4 border border-white/50">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <TagsIcon size={16} />
                  Orders
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {stats.total_orders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          {dashboardCardsData.map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${card.accent}`} />

              <div className="p-6 flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h3 className="mt-3 text-3xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400">
                    <ArrowUpRightIcon size={14} />
                    Seller insight
                  </div>
                </div>

                <div className={`shrink-0 rounded-2xl p-3.5 ${card.iconBg} ${card.iconColor}`}>
                  <card.icon size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Recent Orders */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 mt-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400">Analytics</p>
                <h2 className="text-xl font-semibold text-slate-800">
                  Order Activity Overview
                </h2>
              </div>

              <div className="rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-xs text-slate-600">
                Store trend
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <OrdersAreaChart
                allOrders={recentOrders || []}
                title="Orders / Day"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Recent Activity</p>
              <h2 className="text-xl font-semibold text-slate-800">
                Recent Orders
              </h2>
            </div>

            {recentOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No recent orders found.
              </div>
            ) : (
              <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          Order #{order.order_id}
                        </p>

                        <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                          <p>
                            Status:{" "}
                            <span className="font-medium text-slate-700">
                              {order.latest_status || order.order_status || "placed"}
                            </span>
                          </p>
                          <p>
                            Customer:{" "}
                            <span className="font-medium text-slate-700">
                              {order.customer_full_name || order.customer_username || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-3 py-2 text-sm font-semibold shadow-md">
                        {currency} {order.total_price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}