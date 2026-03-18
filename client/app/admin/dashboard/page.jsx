"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RequireRole from "@/components/RequireRole";
import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
  UserPlusIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from "lucide-react";

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      total_products: 0,
      total_revenue: 0,
      total_orders: 0,
      total_stores: 0,
      pending_vendors: 0,
      unread_notifications: 0,
    },
    recentOrders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(res.data);
      } catch (err) {
        console.error("Admin dashboard load failed:", err);
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
      topBar: "from-[#e8dcc6] via-[#d9c6ef] to-[#bfdaf6]",
      iconBg: "bg-gradient-to-br from-[#f7f1e6] to-[#eaf4ff]",
      iconColor: "text-sky-500",
    },
    {
      title: "Total Revenue",
      value: `${currency}${stats.total_revenue}`,
      icon: CircleDollarSignIcon,
      topBar: "from-[#eadfcf] via-[#d6c1ee] to-[#c7def7]",
      iconBg: "bg-gradient-to-br from-[#f8f3ea] to-[#edf6ff]",
      iconColor: "text-violet-500",
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: TagsIcon,
      topBar: "from-[#e6d9c8] via-[#d7c4ef] to-[#c5def8]",
      iconBg: "bg-gradient-to-br from-[#f6f0e6] to-[#edf5ff]",
      iconColor: "text-purple-500",
    },
    {
      title: "Total Stores",
      value: stats.total_stores,
      icon: StoreIcon,
      topBar: "from-[#efe3d1] via-[#dccccf] to-[#bdd8f4]",
      iconBg: "bg-gradient-to-br from-[#faf5ec] to-[#eaf3ff]",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending Vendors",
      value: stats.pending_vendors,
      icon: UserPlusIcon,
      topBar: "from-[#e9ddca] via-[#dcc7f1] to-[#c3ddf8]",
      iconBg: "bg-gradient-to-br from-[#f8f2e8] to-[#f2ecff]",
      iconColor: "text-indigo-500",
    },
    {
      title: "Unread Notifications",
      value: stats.unread_notifications,
      icon: BellIcon,
      topBar: "from-[#ebe1d2] via-[#d8c7ef] to-[#c6e0fb]",
      iconBg: "bg-gradient-to-br from-[#f9f4eb] to-[#edf6ff]",
      iconColor: "text-sky-600",
    },
  ];

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,220,198,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(191,218,246,0.24),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(217,198,239,0.26),_transparent_24%),linear-gradient(to_bottom,_#fcfaf6,_#f7f1fb,_#f4f9ff)] p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-gradient-to-r from-[#ead9c2] via-[#d8c4ee] to-[#bcd7f3] shadow-[0_20px_60px_rgba(170,185,210,0.18)]">
            <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[#d9c6ef]/35 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[#bfdaf6]/35 blur-3xl" />
            <div className="absolute top-1/2 left-1/3 h-40 w-40 -translate-y-1/2 rounded-full bg-[#e8dcc6]/25 blur-3xl" />

            <div className="relative px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-4 py-2 text-sm text-slate-700 backdrop-blur-sm shadow-sm">
                  <ShieldCheckIcon size={16} />
                  Admin Control Center
                </div>

                <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-slate-700">
                  Admin{" "}
                  <span className="bg-gradient-to-r from-[#b9d8f6] via-[#c9b0eb] to-[#e6d8c3] bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-slate-500 leading-7">
                  Track platform growth, review activity, and monitor the latest
                  store and order updates in one place.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[260px]">
                <div className="rounded-2xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <SparklesIcon size={16} />
                    Revenue
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-700">
                    {currency}
                    {stats.total_revenue}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <TagsIcon size={16} />
                    Orders
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-700">
                    {stats.total_orders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
            {dashboardCardsData.map((card, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[24px] border border-white/60 bg-white/80 backdrop-blur-md shadow-[0_10px_35px_rgba(170,185,210,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(170,185,210,0.18)]"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${card.topBar}`} />

                <div className="p-6 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <h3 className="mt-3 text-3xl font-bold text-slate-700">
                      {card.value}
                    </h3>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400">
                      <ArrowUpRightIcon size={14} />
                      Platform insight
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-2xl p-3.5 ${card.iconBg} ${card.iconColor} shadow-sm`}
                  >
                    <card.icon size={28} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Orders */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 mt-8">
            <div className="rounded-[28px] border border-white/60 bg-white/80 backdrop-blur-md p-5 md:p-6 shadow-[0_12px_40px_rgba(170,185,210,0.10)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Analytics</p>
                  <h2 className="text-xl font-semibold text-slate-700">
                    Order Activity Overview
                  </h2>
                </div>

                <div className="rounded-full bg-gradient-to-r from-[#f6f0e6] via-[#f3ecfb] to-[#edf6ff] px-4 py-2 text-xs text-slate-600 border border-[#e7e1f0]">
                  Recent trend
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-[#fcf8f1] via-[#f5f0fb] to-[#f2f8ff] border border-[#e7e1f0] p-4">
                <OrdersAreaChart
                  allOrders={recentOrders || []}
                  title="Orders / Day"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/60 bg-white/80 backdrop-blur-md p-5 md:p-6 shadow-[0_12px_40px_rgba(170,185,210,0.10)]">
              <div className="mb-4">
                <p className="text-sm text-slate-400">Live Feed</p>
                <h2 className="text-xl font-semibold text-slate-700">
                  Recent Orders
                </h2>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d8cdec] bg-gradient-to-r from-[#faf5ec] via-[#f3ecfb] to-[#eef7ff] p-8 text-center text-slate-500">
                  No recent orders found.
                </div>
              ) : (
                <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
                  {recentOrders.map((order) => (
                    <div
                      key={order.order_id}
                      className="rounded-2xl border border-[#e7e1f0] bg-gradient-to-r from-[#fbf7ef] via-[#f4eefb] to-[#f0f7ff] transition hover:shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-700">
                            Order #{order.order_id}
                          </p>

                          <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                            <p>
                              Status:{" "}
                              <span className="font-medium text-slate-700">
                                {order.latest_status ||
                                  order.order_status ||
                                  "placed"}
                              </span>
                            </p>
                            <p>
                              Customer:{" "}
                              <span className="font-medium text-slate-700">
                                {order.customer_full_name ||
                                  order.customer_username ||
                                  "N/A"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 rounded-xl bg-gradient-to-r from-[#eadfcf] via-[#d9c6ef] to-[#c4def8] text-slate-700 px-3 py-2 text-sm font-semibold shadow-sm">
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
    </RequireRole>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import RequireRole from "@/components/RequireRole";
// import Loading from "@/components/Loading";
// import OrdersAreaChart from "@/components/OrdersAreaChart";
// import {
//   CircleDollarSignIcon,
//   ShoppingBasketIcon,
//   StoreIcon,
//   TagsIcon,
//   UserPlusIcon,
//   BellIcon,
//   ShieldCheckIcon,
//   SparklesIcon,
//   ArrowUpRightIcon,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     stats: {
//       total_products: 0,
//       total_revenue: 0,
//       total_orders: 0,
//       total_stores: 0,
//       pending_vendors: 0,
//       unread_notifications: 0,
//     },
//     recentOrders: [],
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         });

//         setData(res.data);
//       } catch (err) {
//         console.error("Admin dashboard load failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) return <Loading />;

//   const { stats, recentOrders } = data;

//   const dashboardCardsData = [
//     {
//       title: "Total Products",
//       value: stats.total_products,
//       icon: ShoppingBasketIcon,
//       accent: "from-blue-500 to-cyan-500",
//       soft: "bg-blue-50",
//       iconBg: "bg-blue-100",
//       iconColor: "text-blue-600",
//     },
//     {
//       title: "Total Revenue",
//       value: `${currency}${stats.total_revenue}`,
//       icon: CircleDollarSignIcon,
//       accent: "from-emerald-500 to-teal-500",
//       soft: "bg-emerald-50",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       title: "Total Orders",
//       value: stats.total_orders,
//       icon: TagsIcon,
//       accent: "from-violet-500 to-fuchsia-500",
//       soft: "bg-violet-50",
//       iconBg: "bg-violet-100",
//       iconColor: "text-violet-600",
//     },
//     {
//       title: "Total Stores",
//       value: stats.total_stores,
//       icon: StoreIcon,
//       accent: "from-orange-500 to-amber-500",
//       soft: "bg-orange-50",
//       iconBg: "bg-orange-100",
//       iconColor: "text-orange-600",
//     },
//     {
//       title: "Pending Vendors",
//       value: stats.pending_vendors,
//       icon: UserPlusIcon,
//       accent: "from-pink-500 to-rose-500",
//       soft: "bg-pink-50",
//       iconBg: "bg-pink-100",
//       iconColor: "text-pink-600",
//     },
//     {
//       title: "Unread Notifications",
//       value: stats.unread_notifications,
//       icon: BellIcon,
//       accent: "from-slate-700 to-slate-900",
//       soft: "bg-slate-50",
//       iconBg: "bg-slate-200",
//       iconColor: "text-slate-700",
//     },
//   ];

//   return (
//     <RequireRole allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.10),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.10),_transparent_25%),linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)] p-4 md:p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Hero Header */}
//           <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
//             <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
//             <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

//             <div className="relative px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
//                   <ShieldCheckIcon size={16} />
//                   Admin Control Center
//                 </div>

//                 <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight">
//                   Admin Dashboard
//                 </h1>

//                 <p className="mt-3 max-w-2xl text-slate-300 leading-7">
                  
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4 min-w-[260px]">
//                 <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
//                   <div className="flex items-center gap-2 text-slate-300 text-sm">
//                     <SparklesIcon size={16} />
//                     Revenue
//                   </div>
//                   <p className="mt-2 text-2xl font-bold">
//                     {currency}{stats.total_revenue}
//                   </p>
//                 </div>

//                 <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
//                   <div className="flex items-center gap-2 text-slate-300 text-sm">
//                     <TagsIcon size={16} />
//                     Orders
//                   </div>
//                   <p className="mt-2 text-2xl font-bold">{stats.total_orders}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stat cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
//             {dashboardCardsData.map((card, index) => (
//               <div
//                 key={index}
//                 className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300"
//               >
//                 <div className={`h-1.5 w-full bg-gradient-to-r ${card.accent}`} />

//                 <div className="p-6 flex items-start justify-between gap-5">
//                   <div>
//                     <p className="text-sm text-slate-500">{card.title}</p>
//                     <h3 className="mt-3 text-3xl font-bold text-slate-800">
//                       {card.value}
//                     </h3>
//                     <div className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400">
//                       <ArrowUpRightIcon size={14} />
//                       Platform insight
//                     </div>
//                   </div>

//                   <div className={`shrink-0 rounded-2xl p-3.5 ${card.iconBg} ${card.iconColor}`}>
//                     <card.icon size={28} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chart + Orders */}
//           <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 mt-8">
//             <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-sm text-slate-400">Analytics</p>
//                   <h2 className="text-xl font-semibold text-slate-800">
//                     Order Activity Overview
//                   </h2>
//                 </div>

//                 <div className="rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-600">
//                   Recent trend
//                 </div>
//               </div>

//               <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
//                 <OrdersAreaChart
//                   allOrders={recentOrders || []}
//                   title="Orders / Day"
//                 />
//               </div>
//             </div>

//             <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
//               <div className="mb-4">
//                 <p className="text-sm text-slate-400">Live Feed</p>
//                 <h2 className="text-xl font-semibold text-slate-800">
//                   Recent Orders
//                 </h2>
//               </div>

//               {recentOrders.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
//                   No recent orders found.
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
//                   {recentOrders.map((order) => (
//                     <div
//                       key={order.order_id}
//                       className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition p-4"
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div>
//                           <p className="font-semibold text-slate-800">
//                             Order #{order.order_id}
//                           </p>

//                           <div className="mt-2 space-y-1.5 text-sm text-slate-500">
//                             <p>
//                               Status:{" "}
//                               <span className="font-medium text-slate-700">
//                                 {order.latest_status || order.order_status || "placed"}
//                               </span>
//                             </p>
//                             <p>
//                               Customer:{" "}
//                               <span className="font-medium text-slate-700">
//                                 {order.customer_full_name || order.customer_username || "N/A"}
//                               </span>
//                             </p>
//                           </div>
//                         </div>

//                         <div className="shrink-0 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold">
//                           {currency} {order.total_price}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </RequireRole>
//   );
// }