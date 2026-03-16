"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Heart,
  Bell,
  Receipt,
  ArrowUpRight,
} from "lucide-react";

const API = "http://localhost:5000";

function StatCard({ title, value, icon: Icon, gradFrom, gradTo, border, iconColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 24,
        padding: "20px 20px",
        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        border: `1px solid ${border}`,
        boxShadow: hovered
          ? "0 18px 40px rgba(168,85,247,0.14)"
          : "0 10px 26px rgba(168,85,247,0.07)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.22s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#7c6f64",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "rgba(255,255,255,0.88)",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
          }}
        >
          <Icon size={17} color={iconColor} strokeWidth={1.9} />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1,
          color: "#18181b",
          fontFamily: "Georgia, serif",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "pending").toLowerCase();

  let bg = "#fef3c7";
  let color = "#b45309";
  let border = "#fde68a";

  if (normalized === "delivered") {
    bg = "#dcfce7";
    color = "#047857";
    border = "#a7f3d0";
  } else if (normalized === "pending") {
    bg = "#fef3c7";
    color = "#b45309";
    border = "#fde68a";
  } else if (normalized === "cancelled") {
    bg = "#ffe4e6";
    color = "#be123c";
    border = "#fecdd3";
  } else {
    bg = "#ede9fe";
    color = "#6d28d9";
    border = "#c4b5fd";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        textTransform: "capitalize",
      }}
    >
      {status || "pending"}
    </span>
  );
}

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

        const res = await axios.get(`${API}/api/customer/dashboard`, {
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
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 24px",
          background:
            "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 30,
              padding: "38px",
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.82)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 50px rgba(168,85,247,0.08)",
              textAlign: "center",
              color: "#6b7280",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentOrders } = data;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background:
          "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), radial-gradient(circle at bottom center, rgba(249,115,22,0.08), transparent 25%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Hero */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            padding: "36px 36px 32px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,250,247,0.80))",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 24px 70px rgba(168,85,247,0.10)",
            backdropFilter: "blur(20px)",
            marginBottom: 26,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(236,72,153,0.16), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -40,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                  color: "#7c3aed",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 16,
                }}
              >
                <Sparkles size={13} />
                Customer Dashboard
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 40,
                  lineHeight: 1.08,
                  color: "#18181b",
                  fontWeight: 600,
                  fontFamily: "Georgia, serif",
                }}
              >
                A beautiful snapshot
                <br />
                of your shopping journey
              </h1>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: "#6b7280",
                  fontFamily: "Inter, sans-serif",
                  maxWidth: 560,
                }}
              >
                Track your orders, wishlist, and notifications in one elegant place,
                designed to feel smooth, premium, and delightfully easy to use.
              </p>
            </div>

            <div
              style={{
                minWidth: 280,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 22px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(255,255,255,0.86)",
                boxShadow: "0 14px 30px rgba(236,72,153,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 20,
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 16px 30px rgba(168,85,247,0.18)",
                  flexShrink: 0,
                }}
              >
                <Receipt size={28} color="#fff" strokeWidth={1.7} />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#18181b",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {stats.total_orders} Total Orders
                </p>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 13,
                    color: "#8b5cf6",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Your account activity at a glance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <StatCard
            title="Total Orders"
            value={stats.total_orders}
            icon={ShoppingBag}
            gradFrom="#fce7f3"
            gradTo="#f5d0fe"
            border="#f9a8d4"
            iconColor="#be185d"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pending_orders}
            icon={Clock3}
            gradFrom="#fff7ed"
            gradTo="#ffedd5"
            border="#fdba74"
            iconColor="#c2410c"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered_orders}
            icon={CheckCircle2}
            gradFrom="#ecfdf5"
            gradTo="#dcfce7"
            border="#86efac"
            iconColor="#15803d"
          />
          <StatCard
            title="Wishlist Items"
            value={stats.wishlist_count}
            icon={Heart}
            gradFrom="#fdf2f8"
            gradTo="#fae8ff"
            border="#f5c2e7"
            iconColor="#a21caf"
          />
          <StatCard
            title="Notifications"
            value={stats.unread_notifications}
            icon={Bell}
            gradFrom="#f5f3ff"
            gradTo="#ede9fe"
            border="#c4b5fd"
            iconColor="#6d28d9"
          />
        </div>

        {/* Recent Orders */}
        <div
          style={{
            borderRadius: 32,
            padding: "30px",
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  color: "#18181b",
                  fontWeight: 600,
                  fontFamily: "Georgia, serif",
                }}
              >
                Recent Orders
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6b7280",
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                A quick look at your latest purchases and their current status.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.76)",
                border: "1px solid rgba(221,214,254,0.95)",
                color: "#6d28d9",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <ArrowUpRight size={15} />
              Latest activity
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div
              style={{
                borderRadius: 24,
                padding: "28px 24px",
                textAlign: "center",
                background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,250,247,0.92))",
                border: "1px solid rgba(244,114,182,0.12)",
                color: "#6b7280",
                fontFamily: "Inter, sans-serif",
              }}
            >
              No recent orders found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    borderRadius: 24,
                    padding: "18px 20px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,250,247,0.92))",
                    border: "1px solid rgba(244,114,182,0.10)",
                    boxShadow: "0 10px 26px rgba(168,85,247,0.05)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#18181b",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Order #{order.order_id}
                    </p>

                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <StatusBadge status={order.order_status} />

                      <span
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {order.date_added
                          ? new Date(order.date_added).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      minWidth: 120,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#a855f7",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Total
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#18181b",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      ৳ {order.total_price}
                    </p>
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