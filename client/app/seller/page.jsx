
// "use client";

// import { useEffect, useState } from "react";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import OrdersAreaChart from "@/components/OrdersAreaChart";
// import {
//   CircleDollarSignIcon, ShoppingBasketIcon, TagsIcon, StoreIcon,
//   SparklesIcon, ArrowUpRightIcon, StoreIcon as SellerStoreIcon, User, TrendingUp,
// } from "lucide-react";

// const statusStyles = {
//   placed:     { bg: "linear-gradient(135deg,#fce7f3,#fecdd3)", text: "#9f1239", dot: "#f43f5e" },
//   processing: { bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", text: "#7e22ce", dot: "#a855f7" },
//   shipped:    { bg: "linear-gradient(135deg,#fce7f3,#e9d5ff)", text: "#6b21a8", dot: "#c084fc" },
//   delivered:  { bg: "linear-gradient(135deg,#e9d5ff,#fed7aa)", text: "#7c3aed", dot: "#a855f7" },
//   cancelled:  { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" },
// };

// function StatusBadge({ status }) {
//   const s = statusStyles[status?.toLowerCase()] || { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" };
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 5,
//       background: s.bg, color: s.text,
//       fontSize: 10, fontFamily: "sans-serif", fontWeight: 600,
//       letterSpacing: "0.08em", textTransform: "uppercase",
//       padding: "3px 9px", borderRadius: 999,
//     }}>
//       <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
//       {status || "placed"}
//     </span>
//   );
// }

// export default function SellerDashboard() {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     stats: { total_products: 0, total_revenue: 0, total_orders: 0, total_stores: 0 },
//     recentOrders: [],
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/seller/dashboard", {
//           headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
//         });
//         setData(res.data);
//       } catch (err) { console.error("Seller dashboard load failed:", err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, []);

//   if (loading) return <Loading />;
//   const { stats, recentOrders } = data;

//   const dashboardCardsData = [
//     { title: "Total Products", value: stats.total_products,               icon: ShoppingBasketIcon,   gradFrom: "#fce7f3", gradTo: "#e9d5ff", iconColor: "#be185d", border: "#f9a8d4"  },
//     { title: "Total Revenue",  value: `${currency}${stats.total_revenue}`, icon: CircleDollarSignIcon, gradFrom: "#e9d5ff", gradTo: "#ddd6fe", iconColor: "#7c3aed", border: "#c4b5fd" },
//     { title: "Total Orders",   value: stats.total_orders,                  icon: TagsIcon,             gradFrom: "#fdf4ff", gradTo: "#fce7f3", iconColor: "#a855f7", border: "#e9d5ff" },
//     { title: "Total Stores",   value: stats.total_stores,                  icon: StoreIcon,            gradFrom: "#fce7f3", gradTo: "#fed7aa", iconColor: "#c2410c", border: "#fdba74" },
//   ];

//   return (
//     <div style={{ position: "relative", minHeight: "100vh", padding: "40px 24px", fontFamily: "Georgia,serif", overflow: "hidden" }}>
//       <div style={{ position: "fixed", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.14),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//       <div style={{ position: "fixed", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//       <div style={{ position: "fixed", bottom: 0, left: "40%", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

//       <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>

//         {/* hero */}
//         <div style={{
//           marginBottom: 44, padding: 1.5,
//           background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//           borderRadius: 28,
//         }}>
//           <div style={{
//             background: "#fffaf7", borderRadius: 27,
//             padding: "38px 44px",
//             display: "flex", flexWrap: "wrap",
//             alignItems: "center", justifyContent: "space-between", gap: 32,
//           }}>
//             <div>
//               <div style={{
//                 display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
//                 padding: "5px 18px",
//                 background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//                 borderRadius: 999, fontFamily: "sans-serif",
//                 fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
//               }}>
//                 <SellerStoreIcon size={11} strokeWidth={2} />
//                 Seller Control Panel
//               </div>
//               <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#1c1917", lineHeight: 1.2 }}>
//                 Seller Dashboard
//               </h1>
//               <p style={{ margin: "12px 0 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 440, lineHeight: 1.75 }}>
//                 Track your store performance, orders, and revenue from one elegant dashboard.
//               </p>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 240 }}>
//               {[
//                 { icon: SparklesIcon, label: "Revenue", value: `${currency}${stats.total_revenue}`, from: "#fce7f3", to: "#e9d5ff", border: "#f9a8d4", color: "#be185d" },
//                 { icon: TagsIcon,     label: "Orders",  value: stats.total_orders,                   from: "#e9d5ff", to: "#fed7aa", border: "#c4b5fd", color: "#7e22ce" },
//               ].map(({ icon: Icon, label, value, from, to, border, color }) => (
//                 <div key={label} style={{ background: `linear-gradient(135deg,${from},${to})`, border: `1px solid ${border}`, borderRadius: 18, padding: "16px 18px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
//                     <Icon size={12} color={color} strokeWidth={2} />
//                     <span style={{ fontSize: 11, color: "#78716c", fontFamily: "sans-serif", letterSpacing: "0.05em" }}>{label}</span>
//                   </div>
//                   <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1c1917" }}>{value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* stat cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
//           {dashboardCardsData.map((card, index) => (
//             <div
//               key={index}
//               style={{
//                 background: `linear-gradient(135deg,${card.gradFrom},${card.gradTo})`,
//                 border: `1px solid ${card.border}`,
//                 borderRadius: 22, overflow: "hidden",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//               }}
//               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(168,85,247,0.14)"; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
//             >
//               <div style={{ height: 3, background: "linear-gradient(90deg,#ec4899,#a855f7,#f97316)" }} />
//               <div style={{ padding: "22px 24px" }}>
//                 <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
//                   <div>
//                     <p style={{ margin: 0, fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>{card.title}</p>
//                     <h3 style={{ margin: "10px 0 0", fontSize: 28, fontWeight: 600, color: "#1c1917" }}>{card.value}</h3>
//                     <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
//                       <ArrowUpRightIcon size={12} color={card.iconColor} strokeWidth={2.5} />
//                       <span style={{ fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif" }}>Seller insight</span>
//                     </div>
//                   </div>
//                   <div style={{
//                     width: 46, height: 46, borderRadius: 13, flexShrink: 0,
//                     background: "#fff", border: `1px solid ${card.border}`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                   }}>
//                     <card.icon size={20} color={card.iconColor} strokeWidth={1.7} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* chart + orders */}
//         <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>

//           <div style={{ background: "#fffaf7", border: "1px solid #f3e8ff", borderRadius: 24, padding: "28px 28px 24px" }}>
//             <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
//               <div>
//                 <p style={{ margin: 0, fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Analytics</p>
//                 <h2 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Order Activity Overview</h2>
//               </div>
//               <div style={{
//                 display: "inline-flex", alignItems: "center", gap: 6,
//                 padding: "5px 14px",
//                 background: "linear-gradient(135deg,#fce7f3,#e9d5ff)",
//                 borderRadius: 999, border: "1px solid #f9a8d4",
//                 fontFamily: "sans-serif", fontSize: 11, color: "#be185d", letterSpacing: "0.08em",
//               }}>
//                 <TrendingUp size={11} strokeWidth={2} />
//                 Store trend
//               </div>
//             </div>
//             <div style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", border: "1px solid #f3e8ff", borderRadius: 16, padding: 16 }}>
//               <OrdersAreaChart allOrders={recentOrders || []} title="Orders / Day" />
//             </div>
//           </div>

//           <div style={{ background: "#fffaf7", border: "1px solid #f3e8ff", borderRadius: 24, padding: "28px 24px 24px", display: "flex", flexDirection: "column" }}>
//             <div style={{ marginBottom: 20 }}>
//               <p style={{ margin: 0, fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent Activity</p>
//               <h2 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Recent Orders</h2>
//             </div>

//             {recentOrders.length === 0 ? (
//               <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center", background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", borderRadius: 16, border: "1.5px dashed #e9d5ff" }}>
//                 <div style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 14, background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <TagsIcon size={20} color="#be185d" strokeWidth={1.6} />
//                 </div>
//                 <p style={{ margin: 0, fontSize: 14, color: "#3b0764", fontWeight: 600 }}>No recent orders</p>
//                 <p style={{ margin: "5px 0 0", fontSize: 12, color: "#a78bfa", fontFamily: "sans-serif" }}>Orders will appear here once placed.</p>
//               </div>
//             ) : (
//               <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 440, overflowY: "auto", paddingRight: 4 }}>
//                 {recentOrders.map((order) => (
//                   <div
//                     key={order.order_id}
//                     style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", border: "1px solid #f3e8ff", borderRadius: 16, padding: "14px 16px", transition: "transform 0.15s" }}
//                     onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"}
//                     onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
//                   >
//                     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
//                           <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1c1917" }}>Order #{order.order_id}</p>
//                           <StatusBadge status={order.latest_status || order.order_status} />
//                         </div>
//                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                           <User size={11} color="#a855f7" strokeWidth={2} />
//                           <span style={{ fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>
//                             {order.customer_full_name || order.customer_username || "N/A"}
//                           </span>
//                         </div>
//                       </div>
//                       <div style={{
//                         flexShrink: 0, padding: "7px 14px",
//                         background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//                         borderRadius: 10, fontFamily: "sans-serif",
//                         fontSize: 13, fontWeight: 600, color: "#fff",
//                       }}>
//                         {currency} {order.total_price}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  TagsIcon,
  StoreIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  StoreIcon as SellerStoreIcon,
  User,
  Clock3,
  LoaderCircle,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const statusStyles = {
  placed: {
    bg: "linear-gradient(135deg,#FFE4E6,#FBCFE8)",
    text: "#BE123C",
    dot: "#F43F5E",
    icon: Clock3,
  },
  processing: {
    bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    text: "#92400E",
    dot: "#F59E0B",
    icon: LoaderCircle,
  },
  shipped: {
    bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)",
    text: "#1D4ED8",
    dot: "#3B82F6",
    icon: Truck,
  },
  delivered: {
    bg: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
    text: "#166534",
    dot: "#22C55E",
    icon: CheckCircle2,
  },
  cancelled: {
    bg: "linear-gradient(135deg,#FEE2E2,#FECACA)",
    text: "#991B1B",
    dot: "#EF4444",
    icon: XCircle,
  },
};

const statusSteps = ["placed", "processing", "shipped", "delivered"];

function getNormalizedStatus(status) {
  const s = String(status || "placed").toLowerCase();
  return statusStyles[s] ? s : "placed";
}

function StatusBadge({ status }) {
  const normalized = getNormalizedStatus(status);
  const s = statusStyles[normalized];
  const Icon = s.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.text,
        fontSize: 10,
        fontFamily: "sans-serif",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "5px 11px",
        borderRadius: 999,
        animation:
          normalized === "processing" || normalized === "shipped" || normalized === "placed"
            ? "statusPulse 2.2s ease-in-out infinite"
            : "none",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.7)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          size={10}
          color={s.dot}
          strokeWidth={2.4}
          style={{
            animation: normalized === "processing" ? "spinSlow 1.6s linear infinite" : "none",
          }}
        />
      </span>
      {normalized}
    </span>
  );
}

function StatusProgress({ status }) {
  const normalized = getNormalizedStatus(status);
  const isCancelled = normalized === "cancelled";
  const currentIndex = statusSteps.indexOf(normalized);

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          alignItems: "center",
        }}
      >
        {statusSteps.map((step, index) => {
          const stepStyle = statusStyles[step];
          const active = !isCancelled && index <= currentIndex;
          const current = !isCancelled && index === currentIndex;
          const Icon = stepStyle.icon;

          return (
            <div key={step} style={{ minWidth: 0 }}>
              <div
                style={{
                  height: 6,
                  width: "100%",
                  borderRadius: 999,
                  background: active
                    ? stepStyle.bg
                    : "linear-gradient(135deg,#F3F4F6,#E5E7EB)",
                  border: active ? `1px solid ${stepStyle.dot}` : "1px solid #E5E7EB",
                  transition: "all 0.35s ease",
                  boxShadow: current ? `0 0 0 3px ${stepStyle.dot}22` : "none",
                  animation: current ? "barGlow 1.8s ease-in-out infinite" : "none",
                }}
              />
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: active ? stepStyle.text : "#94A3B8",
                  fontSize: 10,
                  fontFamily: "sans-serif",
                  fontWeight: current ? 700 : 600,
                  textTransform: "capitalize",
                  transition: "all 0.35s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon
                  size={11}
                  strokeWidth={2.2}
                  style={{
                    animation: current && step === "processing" ? "spinSlow 1.6s linear infinite" : "none",
                  }}
                />
                <span>{step}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 999,
            background: statusStyles.cancelled.bg,
            color: statusStyles.cancelled.text,
            fontSize: 11,
            fontFamily: "sans-serif",
            fontWeight: 700,
            letterSpacing: "0.04em",
            animation: "statusPulse 2.2s ease-in-out infinite",
          }}
        >
          <XCircle size={12} color={statusStyles.cancelled.dot} strokeWidth={2.3} />
          Order cancelled
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { total_products: 0, total_revenue: 0, total_orders: 0, total_stores: 0 },
    recentOrders: [],
  });

  const fetchDashboardData = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/seller/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setData({
        stats: res.data.stats || {
          total_products: 0,
          total_revenue: 0,
          total_orders: 0,
          total_stores: 0,
        },
        recentOrders: res.data.recentOrders || [],
      });
    } catch (err) {
      console.error("Seller dashboard load failed:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchDashboardData(false);
      }
    };

    const handleFocus = () => {
      fetchDashboardData(false);
    };

    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 10000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  if (loading) return <Loading />;

  const { stats, recentOrders } = data;

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: ShoppingBasketIcon,
      gradFrom: "#FAEAD7",
      gradTo: "#F1E7FB",
      iconColor: "#8D6DB3",
      border: "#D9C2F0",
    },
    {
      title: "Total Revenue",
      value: `${currency}${stats.total_revenue}`,
      icon: CircleDollarSignIcon,
      gradFrom: "#F1E7FB",
      gradTo: "#EAF4FF",
      iconColor: "#6F5A96",
      border: "#BFD7F6",
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: TagsIcon,
      gradFrom: "#F8F2FE",
      gradTo: "#F1E7FB",
      iconColor: "#8D6DB3",
      border: "#D9C2F0",
    },
    {
      title: "Total Stores",
      value: stats.total_stores,
      icon: StoreIcon,
      gradFrom: "#FAEAD7",
      gradTo: "#EAF4FF",
      iconColor: "#8B6A4E",
      border: "#E9C79D",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "Georgia,serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes statusPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.92; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes barGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.00); }
          50% { box-shadow: 0 0 0 4px rgba(99,102,241,0.10); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: -100,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -60,
          right: -60,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(217,194,240,0.22),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "40%",
          width: 500,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            marginBottom: 44,
            padding: 1.5,
            background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
            borderRadius: 28,
          }}
        >
          <div
            style={{
              background: "#FFFCF8",
              borderRadius: 27,
              padding: "38px 44px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  padding: "5px 18px",
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                  borderRadius: 999,
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8D6DB3",
                }}
              >
                <SellerStoreIcon size={11} strokeWidth={2} />
                Seller Control Panel
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1c1917",
                  lineHeight: 1.2,
                }}
              >
                Seller Dashboard
              </h1>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                  maxWidth: 440,
                  lineHeight: 1.75,
                }}
              >
                Track your store performance, orders, and revenue from one elegant dashboard.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 240 }}>
              {[
                {
                  icon: SparklesIcon,
                  label: "Revenue",
                  value: `${currency}${stats.total_revenue}`,
                  from: "#FAEAD7",
                  to: "#F1E7FB",
                  border: "#D9C2F0",
                  color: "#8D6DB3",
                },
                {
                  icon: TagsIcon,
                  label: "Orders",
                  value: stats.total_orders,
                  from: "#F1E7FB",
                  to: "#EAF4FF",
                  border: "#BFD7F6",
                  color: "#6F5A96",
                },
              ].map(({ icon: Icon, label, value, from, to, border, color }) => (
                <div
                  key={label}
                  style={{
                    background: `linear-gradient(135deg,${from},${to})`,
                    border: `1px solid ${border}`,
                    borderRadius: 18,
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Icon size={12} color={color} strokeWidth={2} />
                    <span
                      style={{
                        fontSize: 11,
                        color: "#78716c",
                        fontFamily: "sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1c1917" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {dashboardCardsData.map((card, index) => (
            <div
              key={index}
              style={{
                background: `linear-gradient(135deg,${card.gradFrom},${card.gradTo})`,
                border: `1px solid ${card.border}`,
                borderRadius: 22,
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 16px 44px rgba(217,194,240,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ height: 3, background: "linear-gradient(90deg,#F3D3AD,#D9C2F0,#BFD7F6)" }} />
              <div style={{ padding: "22px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#78716c",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {card.title}
                    </p>
                    <h3
                      style={{
                        margin: "10px 0 0",
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#1c1917",
                      }}
                    >
                      {card.value}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
                      <ArrowUpRightIcon size={12} color={card.iconColor} strokeWidth={2.5} />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#8D6DB3",
                          fontFamily: "sans-serif",
                        }}
                      >
                        Seller insight
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 13,
                      flexShrink: 0,
                      background: "#fff",
                      border: `1px solid ${card.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <card.icon size={20} color={card.iconColor} strokeWidth={1.7} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#FFFCF8",
            border: "1px solid #E8E1F0",
            borderRadius: 24,
            padding: "28px 24px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#8D6DB3",
                fontFamily: "sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Recent Activity
            </p>
            <h2
              style={{
                margin: "6px 0 0",
                fontSize: 18,
                fontWeight: 600,
                color: "#1c1917",
              }}
            >
              Recent Orders
            </h2>
          </div>

          {recentOrders.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                textAlign: "center",
                background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)",
                borderRadius: 16,
                border: "1.5px dashed #D9C2F0",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  marginBottom: 14,
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TagsIcon size={20} color="#8D6DB3" strokeWidth={1.6} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#5C4A7A",
                  fontWeight: 600,
                }}
              >
                No recent orders
              </p>
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 12,
                  color: "#8D6DB3",
                  fontFamily: "sans-serif",
                }}
              >
                Orders will appear here once placed.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                maxHeight: 520,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              {recentOrders.map((order) => {
                const currentStatus = order.latest_status || order.order_status || "placed";

                return (
                  <div
                    key={order.order_id}
                    style={{
                      background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)",
                      border: "1px solid #E8E1F0",
                      borderRadius: 18,
                      padding: "16px 18px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(217,194,240,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#1c1917",
                          }}
                        >
                          Order #{order.order_id}
                        </p>

                        <StatusBadge status={currentStatus} />
                      </div>

                      <div
                        style={{
                          padding: "6px 12px",
                          background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {currency} {order.total_price}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <User size={12} color="#8D6DB3" strokeWidth={2} />
                        <span
                          style={{
                            fontSize: 13,
                            color: "#78716c",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {order.customer_full_name || order.customer_username || "N/A"}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          color: "#8D6DB3",
                          fontFamily: "sans-serif",
                        }}
                      >
                        Order ID: #{order.order_id}
                      </span>
                    </div>

                    <StatusProgress status={currentStatus} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}