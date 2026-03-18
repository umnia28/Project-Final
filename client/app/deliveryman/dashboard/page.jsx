"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import {
  CheckCircle2Icon,
  Clock3Icon,
  PackageIcon,
  TruckIcon,
  BoxIcon,
  BellIcon,
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000";

export default function DeliveryDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    total_assigned: 0,
    confirmed_orders: 0,
    shipped_orders: 0,
    out_for_delivery_orders: 0,
    delivered_orders: 0,
    unread_notifications: 0,
    recentOrders: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Assigned",
      value: dashboardData.total_assigned,
      icon: BoxIcon,
      iconClass: "text-[#7a5db4] bg-[#f3edff]",
      borderClass: "from-[#f4dec2] via-[#ddd6fe] to-[#bae6fd]",
    },
    {
      title: "Confirmed Orders",
      value: dashboardData.confirmed_orders,
      icon: Clock3Icon,
      iconClass: "text-[#9a6b2f] bg-[#fff3e2]",
      borderClass: "from-[#fff1db] via-[#f8f3ff] to-[#eef8ff]",
    },
    {
      title: "Shipped Orders",
      value: dashboardData.shipped_orders,
      icon: PackageIcon,
      iconClass: "text-sky-600 bg-sky-100",
      borderClass: "from-[#eef8ff] via-[#f8f3ff] to-[#fff1db]",
    },
    {
      title: "Out For Delivery",
      value: dashboardData.out_for_delivery_orders,
      icon: TruckIcon,
      iconClass: "text-sky-700 bg-sky-100",
      borderClass: "from-[#dff4ff] via-[#eef3ff] to-[#f7ebff]",
    },
    {
      title: "Delivered Orders",
      value: dashboardData.delivered_orders,
      icon: CheckCircle2Icon,
      iconClass: "text-emerald-700 bg-emerald-100",
      borderClass: "from-[#eefcf4] via-[#f8f3ff] to-[#eef8ff]",
    },
    {
      title: "Unread Notifications",
      value: dashboardData.unread_notifications,
      icon: BellIcon,
      iconClass: "text-[#7a5db4] bg-[#f3edff]",
      borderClass: "from-[#f8f1ff] via-[#eef8ff] to-[#fff1db]",
    },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/deliveryman/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setDashboardData({
          total_assigned: res.data?.stats?.total_assigned || 0,
          confirmed_orders: res.data?.stats?.confirmed_orders || 0,
          shipped_orders: res.data?.stats?.shipped_orders || 0,
          out_for_delivery_orders: res.data?.stats?.out_for_delivery_orders || 0,
          delivered_orders: res.data?.stats?.delivered_orders || 0,
          unread_notifications: res.data?.stats?.unread_notifications || 0,
          recentOrders: res.data?.recentOrders || [],
        });
      } catch (err) {
        console.error("Delivery dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(221,214,254,0.28),_transparent_22%),linear-gradient(to_bottom,_#fffdf9,_#f7fbff,_#faf7ff)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-[30px] bg-gradient-to-r from-[#f4dec2] via-[#ddd6fe] to-[#bae6fd] p-[2px] shadow-[0_18px_45px_rgba(181,190,222,0.22)]">
          <div className="rounded-[30px] bg-white/75 px-6 py-7 backdrop-blur-md md:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              Delivery Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track assigned deliveries, current progress, and recent orders.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCardsData.map((card, index) => (
            <div
              key={index}
              className={`rounded-[28px] bg-gradient-to-r ${card.borderClass} p-[2px] shadow-[0_12px_32px_rgba(170,180,210,0.14)]`}
            >
              <div className="flex items-center justify-between rounded-[28px] bg-white/80 px-5 py-5 backdrop-blur-md">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <b className="text-3xl font-semibold text-slate-800">{card.value}</b>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconClass}`}
                >
                  <card.icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[30px] border border-white/70 bg-white/75 p-5 shadow-[0_16px_40px_rgba(170,180,210,0.16)] backdrop-blur-md md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Recent Orders</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest orders assigned to this delivery account.
              </p>
            </div>
          </div>

          {dashboardData.recentOrders.length === 0 ? (
            <div className="rounded-[24px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] p-6 text-slate-500">
              No recent assigned orders.
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="rounded-[24px] border border-white/70 bg-gradient-to-r from-[#fffaf2] via-white to-[#f4f8ff] p-4 shadow-[0_10px_25px_rgba(180,190,220,0.1)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d7c9f4] bg-[#f3edff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a5db4]">
                        <PackageIcon className="h-3.5 w-3.5" />
                        Order #{order.order_id}
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-slate-600 capitalize">
                          Status: <span className="font-medium">{order.order_status}</span>
                        </p>
                        <p className="text-sm text-slate-500">
                          {[order.address, order.city].filter(Boolean).join(", ") || "No address found"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-700">
                      ৳ {Number(order.total_price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}