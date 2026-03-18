'use client';

import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

// TEMP: dummy data (replace with real API later)
import { dummyAdminDashboardData } from "@/assets/assets";

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: ShoppingBasketIcon,
      iconWrap: "bg-[#eff6ff]",
      iconColor: "text-sky-600",
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.revenue,
      icon: CircleDollarSignIcon,
      iconWrap: "bg-[#f5f3ff]",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Orders",
      value: dashboardData.orders,
      icon: TagsIcon,
      iconWrap: "bg-[#faf8ef]",
      iconColor: "text-amber-700",
    },
    {
      title: "Total Stores",
      value: dashboardData.stores,
      icon: StoreIcon,
      iconWrap: "bg-[#eff6ff]",
      iconColor: "text-sky-600",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      // 🔒 later replace with real API:
      // const token = localStorage.getItem("token");
      // const res = await fetch("http://localhost:5000/api/admin/dashboard", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const data = await res.json();

      // ✅ for now:
      setDashboardData(dummyAdminDashboardData);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.42),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.40),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto text-slate-600">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)] mb-8">
            <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
                  <ShieldCheckIcon size={16} />
                  Admin Overview
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                  Admin{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>

                <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                  Track platform activity, monitor growth, and review recent order trends from one place.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                  <SparklesIcon size={28} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Live Orders Loaded</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {dashboardData.allOrders?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {dashboardCardsData.map((card, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(180,160,255,0.08)] hover:shadow-[0_18px_50px_rgba(180,160,255,0.14)] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-3 text-sm">
                    <p className="text-slate-500">{card.title}</p>
                    <b className="text-2xl font-semibold text-slate-800">
                      {card.value}
                    </b>
                  </div>

                  <div className={`rounded-2xl p-3 ${card.iconWrap}`}>
                    <card.icon
                      size={28}
                      className={`${card.iconColor}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Chart */}
          <div className="rounded-[28px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 md:p-6 shadow-[0_10px_35px_rgba(180,160,255,0.08)]">
            <OrdersAreaChart allOrders={dashboardData.allOrders} />
          </div>
        </div>
      </div>
    </RequireRole>
  );
}

// 'use client';

// import { useEffect, useState } from "react";
// import RequireRole from "@/components/RequireRole";
// import Loading from "@/components/Loading";
// import OrdersAreaChart from "@/components/OrdersAreaChart";
// import {
//   CircleDollarSignIcon,
//   ShoppingBasketIcon,
//   StoreIcon,
//   TagsIcon,
// } from "lucide-react";

// // TEMP: dummy data (replace with real API later)
// import { dummyAdminDashboardData } from "@/assets/assets";

// export default function AdminDashboard() {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     products: 0,
//     revenue: 0,
//     orders: 0,
//     stores: 0,
//     allOrders: [],
//   });

//   const dashboardCardsData = [
//     {
//       title: "Total Products",
//       value: dashboardData.products,
//       icon: ShoppingBasketIcon,
//     },
//     {
//       title: "Total Revenue",
//       value: currency + dashboardData.revenue,
//       icon: CircleDollarSignIcon,
//     },
//     {
//       title: "Total Orders",
//       value: dashboardData.orders,
//       icon: TagsIcon,
//     },
//     {
//       title: "Total Stores",
//       value: dashboardData.stores,
//       icon: StoreIcon,
//     },
//   ];

//   const fetchDashboardData = async () => {
//     try {
//       // 🔒 later replace with real API:
//       // const token = localStorage.getItem("token");
//       // const res = await fetch("http://localhost:5000/api/admin/dashboard", {
//       //   headers: { Authorization: `Bearer ${token}` },
//       // });
//       // const data = await res.json();

//       // ✅ for now:
//       setDashboardData(dummyAdminDashboardData);
//     } catch (err) {
//       console.error("Dashboard load failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   if (loading) return <Loading />;

//   return (
//     <RequireRole allowedRoles={["admin"]}>
//       <div className="text-slate-500 p-6">
//         <h1 className="text-2xl">
//           Admin <span className="text-slate-800 font-medium">Dashboard</span>
//         </h1>

//         {/* Summary Cards */}
//         <div className="flex flex-wrap gap-5 my-10 mt-4">
//           {dashboardCardsData.map((card, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg"
//             >
//               <div className="flex flex-col gap-3 text-xs">
//                 <p>{card.title}</p>
//                 <b className="text-2xl font-medium text-slate-700">
//                   {card.value}
//                 </b>
//               </div>
//               <card.icon
//                 size={50}
//                 className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Orders Chart */}
//         <OrdersAreaChart allOrders={dashboardData.allOrders} />
//       </div>
//     </RequireRole>
//   );
// }
