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
  CircleDollarSignIcon, ShoppingBasketIcon, TagsIcon, StoreIcon,
  SparklesIcon, ArrowUpRightIcon, StoreIcon as SellerStoreIcon, User, TrendingUp,
} from "lucide-react";

const statusStyles = {
  placed:     { bg: "linear-gradient(135deg,#fce7f3,#fecdd3)", text: "#9f1239", dot: "#f43f5e" },
  processing: { bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", text: "#7e22ce", dot: "#a855f7" },
  shipped:    { bg: "linear-gradient(135deg,#fce7f3,#e9d5ff)", text: "#6b21a8", dot: "#c084fc" },
  delivered:  { bg: "linear-gradient(135deg,#e9d5ff,#fed7aa)", text: "#7c3aed", dot: "#a855f7" },
  cancelled:  { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" },
};

function StatusBadge({ status }) {
  const s = statusStyles[status?.toLowerCase()] || { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      fontSize: 10, fontFamily: "sans-serif", fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 999,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status || "placed"}
    </span>
  );
}

export default function SellerDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { total_products: 0, total_revenue: 0, total_orders: 0, total_stores: 0 },
    recentOrders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/seller/dashboard", {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
        setData(res.data);
      } catch (err) { console.error("Seller dashboard load failed:", err); }
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;
  const { stats, recentOrders } = data;

  const dashboardCardsData = [
    { title: "Total Products", value: stats.total_products,               icon: ShoppingBasketIcon,   gradFrom: "#fce7f3", gradTo: "#e9d5ff", iconColor: "#be185d", border: "#f9a8d4"  },
    { title: "Total Revenue",  value: `${currency}${stats.total_revenue}`, icon: CircleDollarSignIcon, gradFrom: "#e9d5ff", gradTo: "#ddd6fe", iconColor: "#7c3aed", border: "#c4b5fd" },
    { title: "Total Orders",   value: stats.total_orders,                  icon: TagsIcon,             gradFrom: "#fdf4ff", gradTo: "#fce7f3", iconColor: "#a855f7", border: "#e9d5ff" },
    { title: "Total Stores",   value: stats.total_stores,                  icon: StoreIcon,            gradFrom: "#fce7f3", gradTo: "#fed7aa", iconColor: "#c2410c", border: "#fdba74" },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 24px", fontFamily: "Georgia,serif", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.14),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, left: "40%", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>

        {/* hero */}
        <div style={{
          marginBottom: 44, padding: 1.5,
          background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
          borderRadius: 28,
        }}>
          <div style={{
            background: "#fffaf7", borderRadius: 27,
            padding: "38px 44px",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: 32,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
                padding: "5px 18px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                borderRadius: 999, fontFamily: "sans-serif",
                fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
              }}>
                <SellerStoreIcon size={11} strokeWidth={2} />
                Seller Control Panel
              </div>
              <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#1c1917", lineHeight: 1.2 }}>
                Seller Dashboard
              </h1>
              <p style={{ margin: "12px 0 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 440, lineHeight: 1.75 }}>
                Track your store performance, orders, and revenue from one elegant dashboard.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 240 }}>
              {[
                { icon: SparklesIcon, label: "Revenue", value: `${currency}${stats.total_revenue}`, from: "#fce7f3", to: "#e9d5ff", border: "#f9a8d4", color: "#be185d" },
                { icon: TagsIcon,     label: "Orders",  value: stats.total_orders,                   from: "#e9d5ff", to: "#fed7aa", border: "#c4b5fd", color: "#7e22ce" },
              ].map(({ icon: Icon, label, value, from, to, border, color }) => (
                <div key={label} style={{ background: `linear-gradient(135deg,${from},${to})`, border: `1px solid ${border}`, borderRadius: 18, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Icon size={12} color={color} strokeWidth={2} />
                    <span style={{ fontSize: 11, color: "#78716c", fontFamily: "sans-serif", letterSpacing: "0.05em" }}>{label}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1c1917" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
          {dashboardCardsData.map((card, index) => (
            <div
              key={index}
              style={{
                background: `linear-gradient(135deg,${card.gradFrom},${card.gradTo})`,
                border: `1px solid ${card.border}`,
                borderRadius: 22, overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(168,85,247,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: 3, background: "linear-gradient(90deg,#ec4899,#a855f7,#f97316)" }} />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>{card.title}</p>
                    <h3 style={{ margin: "10px 0 0", fontSize: 28, fontWeight: 600, color: "#1c1917" }}>{card.value}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
                      <ArrowUpRightIcon size={12} color={card.iconColor} strokeWidth={2.5} />
                      <span style={{ fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif" }}>Seller insight</span>
                    </div>
                  </div>
                  <div style={{
                    width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                    background: "#fff", border: `1px solid ${card.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <card.icon size={20} color={card.iconColor} strokeWidth={1.7} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* chart + orders */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>

          <div style={{ background: "#fffaf7", border: "1px solid #f3e8ff", borderRadius: 24, padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Analytics</p>
                <h2 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Order Activity Overview</h2>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 14px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff)",
                borderRadius: 999, border: "1px solid #f9a8d4",
                fontFamily: "sans-serif", fontSize: 11, color: "#be185d", letterSpacing: "0.08em",
              }}>
                <TrendingUp size={11} strokeWidth={2} />
                Store trend
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", border: "1px solid #f3e8ff", borderRadius: 16, padding: 16 }}>
              <OrdersAreaChart allOrders={recentOrders || []} title="Orders / Day" />
            </div>
          </div>

          <div style={{ background: "#fffaf7", border: "1px solid #f3e8ff", borderRadius: 24, padding: "28px 24px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent Activity</p>
              <h2 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Recent Orders</h2>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center", background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", borderRadius: 16, border: "1.5px dashed #e9d5ff" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 14, background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TagsIcon size={20} color="#be185d" strokeWidth={1.6} />
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#3b0764", fontWeight: 600 }}>No recent orders</p>
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "#a78bfa", fontFamily: "sans-serif" }}>Orders will appear here once placed.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 440, overflowY: "auto", paddingRight: 4 }}>
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", border: "1px solid #f3e8ff", borderRadius: 16, padding: "14px 16px", transition: "transform 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1c1917" }}>Order #{order.order_id}</p>
                          <StatusBadge status={order.latest_status || order.order_status} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <User size={11} color="#a855f7" strokeWidth={2} />
                          <span style={{ fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>
                            {order.customer_full_name || order.customer_username || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        flexShrink: 0, padding: "7px 14px",
                        background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                        borderRadius: 10, fontFamily: "sans-serif",
                        fontSize: 13, fontWeight: 600, color: "#fff",
                      }}>
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