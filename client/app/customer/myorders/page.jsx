"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Receipt,
  CreditCard,
  MapPin,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
} from "lucide-react";

const API = "http://localhost:5000";

function StatusBadge({ label, type = "order" }) {
  const value = String(label || "").toLowerCase();

  let bg = "#f5f3ff";
  let color = "#6d28d9";
  let border = "#c4b5fd";
  let Icon = Package;

  if (type === "order") {
    if (value === "pending") {
      bg = "#fef3c7";
      color = "#b45309";
      border = "#fde68a";
      Icon = Clock3;
    } else if (value === "delivered") {
      bg = "#dcfce7";
      color = "#047857";
      border = "#a7f3d0";
      Icon = CheckCircle2;
    } else if (value === "cancelled") {
      bg = "#ffe4e6";
      color = "#be123c";
      border = "#fecdd3";
      Icon = XCircle;
    } else {
      bg = "#ede9fe";
      color = "#6d28d9";
      border = "#c4b5fd";
      Icon = Truck;
    }
  }

  if (type === "payment") {
    if (value === "paid") {
      bg = "#dcfce7";
      color = "#047857";
      border = "#a7f3d0";
      Icon = CheckCircle2;
    } else if (value === "pending") {
      bg = "#fef3c7";
      color = "#b45309";
      border = "#fde68a";
      Icon = Clock3;
    } else if (value === "failed") {
      bg = "#ffe4e6";
      color = "#be123c";
      border = "#fecdd3";
      Icon = XCircle;
    } else {
      bg = "#f5f3ff";
      color = "#6d28d9";
      border = "#c4b5fd";
      Icon = CreditCard;
    }
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
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={13} />
      {label || "unknown"}
    </span>
  );
}

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

export default function CustomerMyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/customer/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => String(o.order_status || "").toLowerCase() === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => String(o.order_status || "").toLowerCase() === "delivered"
  ).length;
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0);

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
                My Orders
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
                Every order,
                <br />
                beautifully tracked
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
                Browse your purchases, review delivery details, and revisit each item in a
                calm, elegant space designed to make shopping history feel premium.
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
                <ShoppingBag size={28} color="#fff" strokeWidth={1.7} />
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
                  {totalOrders} Orders
                </p>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 13,
                    color: "#8b5cf6",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Your complete purchase timeline
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={Receipt}
            gradFrom="#fce7f3"
            gradTo="#f5d0fe"
            border="#f9a8d4"
            iconColor="#be185d"
          />
          <StatCard
            title="Pending"
            value={pendingOrders}
            icon={Clock3}
            gradFrom="#fff7ed"
            gradTo="#ffedd5"
            border="#fdba74"
            iconColor="#c2410c"
          />
          <StatCard
            title="Delivered"
            value={deliveredOrders}
            icon={CheckCircle2}
            gradFrom="#ecfdf5"
            gradTo="#dcfce7"
            border="#86efac"
            iconColor="#15803d"
          />
          <StatCard
            title="Items Ordered"
            value={totalItems}
            icon={Package}
            gradFrom="#f5f3ff"
            gradTo="#ede9fe"
            border="#c4b5fd"
            iconColor="#6d28d9"
          />
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              borderRadius: 30,
              padding: "32px 28px",
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.86)",
              boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
              backdropFilter: "blur(20px)",
              color: "#6b7280",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
            }}
          >
            No orders found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {orders.map((order) => (
              <div
                key={order.order_id}
                style={{
                  borderRadius: 32,
                  padding: "26px",
                  background: "rgba(255,255,255,0.76)",
                  border: "1px solid rgba(255,255,255,0.86)",
                  boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* header */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 24,
                        color: "#18181b",
                        fontWeight: 600,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Order #{order.order_id}
                    </h2>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <StatusBadge label={order.order_status} type="order" />
                      <StatusBadge label={order.payment_status} type="payment" />
                    </div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 160 }}>
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
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#18181b",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      ৳ {order.total_price}
                    </p>
                    {order.date_added && (
                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 12.5,
                          color: "#6b7280",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {new Date(order.date_added).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* shipping */}
                {(order.shipping_address ||
                  order.city ||
                  order.shipping_state ||
                  order.zip_code ||
                  order.country) && (
                  <div
                    style={{
                      marginBottom: 20,
                      borderRadius: 24,
                      padding: "18px 18px",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,250,247,0.96))",
                      border: "1px solid rgba(244,114,182,0.10)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <MapPin size={16} color="#a855f7" />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#18181b",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Shipping Address
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {order.shipping_address && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#374151",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {order.shipping_address}
                        </p>
                      )}
                      {order.city && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#6b7280",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {order.city}
                        </p>
                      )}
                      {order.shipping_state && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#6b7280",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {order.shipping_state}
                        </p>
                      )}
                      {order.zip_code && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#6b7280",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {order.zip_code}
                        </p>
                      )}
                      {order.country && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#6b7280",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {order.country}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* items */}
                {order.items && order.items.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {order.items.map((item) => (
                      <div
                        key={item.order_item_id}
                        style={{
                          borderRadius: 24,
                          padding: "14px 16px",
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 14,
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.90), rgba(255,250,247,0.94))",
                          border: "1px solid rgba(244,114,182,0.10)",
                          boxShadow: "0 10px 24px rgba(168,85,247,0.05)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <img
                            src={item.image_url || "/placeholder.png"}
                            alt={item.product_name}
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 18,
                              flexShrink: 0,
                              border: "1px solid rgba(244,114,182,0.10)",
                            }}
                          />

                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#18181b",
                                fontFamily: "Georgia, serif",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.product_name}
                            </p>
                            <p
                              style={{
                                margin: "6px 0 0",
                                fontSize: 13,
                                color: "#6b7280",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              Quantity: {item.qty}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 100 }}>
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
                            Price
                          </p>
                          <p
                            style={{
                              margin: "6px 0 0",
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#18181b",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            ৳ {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}