"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import {
  BellIcon,
  CheckCircle2Icon,
  Clock3Icon,
  PackageIcon,
  TruckIcon,
  BoxIcon,
} from "lucide-react";
import axios from "axios";

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
    { title: "Total Assigned", value: dashboardData.total_assigned, icon: BoxIcon },
    { title: "Confirmed Orders", value: dashboardData.confirmed_orders, icon: Clock3Icon },
    { title: "Shipped Orders", value: dashboardData.shipped_orders, icon: PackageIcon },
    { title: "Out For Delivery", value: dashboardData.out_for_delivery_orders, icon: TruckIcon },
    { title: "Delivered Orders", value: dashboardData.delivered_orders, icon: CheckCircle2Icon },
    { title: "Unread Notifications", value: dashboardData.unread_notifications, icon: BellIcon },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/deliveryman/dashboard", {
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
    <div className="text-slate-500">
      <h1 className="text-2xl">
        Delivery <span className="text-slate-800 font-medium">Dashboard</span>
      </h1>

      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg"
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

        {dashboardData.recentOrders.length === 0 ? (
          <p className="text-slate-500">No recent assigned orders.</p>
        ) : (
          <div className="space-y-3">
            {dashboardData.recentOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-slate-700">Order #{order.order_id}</p>
                  <p className="text-sm text-slate-500 capitalize">
                    Status: {order.order_status}
                  </p>
                  <p className="text-sm text-slate-500">
                    {[order.address, order.city].filter(Boolean).join(", ")}
                  </p>
                </div>

                <div className="text-sm text-slate-700 font-medium">
                  ৳{Number(order.total_price || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}