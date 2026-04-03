"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  Package,
  ShoppingBag,
  BadgeDollarSign,
  Receipt,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

function StatCard({ title, value, icon: Icon, gradFrom, gradTo, border, iconColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: "18px 20px",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 10px 30px rgba(217,194,240,0.16)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#78716c",
            fontFamily: "sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#fff",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={15} color={iconColor} strokeWidth={1.8} />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 600,
          color: "#1c1917",
          fontFamily: "Georgia,serif",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatMoney(value) {
  return `${CURRENCY}${Number(value || 0).toLocaleString()}`;
}

export default function SellerSalesReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({
    store: null,
    summary: null,
    daily_sales: [],
    top_products: [],
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/seller/sales-report`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setReport({
          store: res.data.store || null,
          summary: res.data.summary || null,
          daily_sales: res.data.daily_sales || [],
          top_products: res.data.top_products || [],
        });
      } catch (err) {
        console.error("Seller sales report fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const summary = report.summary || {
    total_orders: 0,
    total_items_sold: 0,
    gross_sales: 0,
    total_discount: 0,
    total_seller_earnings: 0,
  };

  const maxDailySale = useMemo(() => {
    if (!report.daily_sales.length) return 0;
    return Math.max(
      ...report.daily_sales.map((d) => Number(d.seller_earnings || 0))
    );
  }, [report.daily_sales]);

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          padding: "44px 24px",
          fontFamily: "Georgia,serif",
        }}
      >
        <div
          style={{
            borderRadius: 24,
            border: "1px solid #E8E1F0",
            background: "linear-gradient(135deg,#FFFCF8,#F8F2FE,#EAF4FF)",
            padding: "40px 32px",
            color: "#78716c",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          Loading sales report...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "44px 24px",
        fontFamily: "Georgia,serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: -80,
          left: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: -60,
          width: 340,
          height: 340,
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
          width: 380,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1150, margin: "0 auto" }}>
        <div
          style={{
            padding: 1.5,
            background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
            borderRadius: 28,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "#FFFCF8",
              borderRadius: 27,
              padding: "36px 44px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
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
                <Sparkles size={11} strokeWidth={2} />
                Seller Analytics
              </div>

              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>
                Sales Report
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 15,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                  lineHeight: 1.75,
                }}
              >
                Track revenue, discounts, orders, and top-performing products
                {report.store?.store_name ? ` for ${report.store.store_name}` : ""}.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 22px",
                background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <TrendingUp size={24} color="#fff" strokeWidth={1.7} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                  {formatMoney(summary.total_seller_earnings)}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "#8D6DB3",
                    fontFamily: "sans-serif",
                  }}
                >
                  Total seller earnings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 30,
          }}
        >
          <StatCard
            title="Total Orders"
            value={summary.total_orders}
            icon={Receipt}
            gradFrom="#FAEAD7"
            gradTo="#F1E7FB"
            border="#D9C2F0"
            iconColor="#8D6DB3"
          />
          <StatCard
            title="Items Sold"
            value={summary.total_items_sold}
            icon={Package}
            gradFrom="#F8F2FE"
            gradTo="#EAF4FF"
            border="#BFD7F6"
            iconColor="#6F5A96"
          />
          <StatCard
            title="Gross Sales"
            value={formatMoney(summary.gross_sales)}
            icon={ShoppingBag}
            gradFrom="#FAEAD7"
            gradTo="#EAF4FF"
            border="#E9C79D"
            iconColor="#8B6A4E"
          />
          <StatCard
            title="Discount Given"
            value={formatMoney(summary.total_discount)}
            icon={BadgeDollarSign}
            gradFrom="#FFF1F2"
            gradTo="#FFE4E6"
            border="#FDA4AF"
            iconColor="#BE123C"
          />
          <StatCard
            title="Seller Earnings"
            value={formatMoney(summary.total_seller_earnings)}
            icon={BarChart3}
            gradFrom="#F1E7FB"
            gradTo="#EAF4FF"
            border="#D9C2F0"
            iconColor="#8D6DB3"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "#FFFCF8",
              border: "1px solid #E8E1F0",
              borderRadius: 24,
              padding: "28px 28px 24px",
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
                Daily Sales
              </p>
              <h2
                style={{
                  margin: "6px 0 0",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1c1917",
                }}
              >
                Delivered Sales Timeline
              </h2>
            </div>

            {report.daily_sales.length === 0 ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px dashed #D9C2F0",
                  background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)",
                  padding: "36px 20px",
                  textAlign: "center",
                  color: "#78716c",
                  fontFamily: "sans-serif",
                }}
              >
                No sales data yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {report.daily_sales.map((row, index) => {
                  const value = Number(row.seller_earnings || 0);
                  const width =
                    maxDailySale > 0 ? Math.max((value / maxDailySale) * 100, 6) : 6;

                  return (
                    <div key={`${row.sales_date}-${index}`}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                          fontFamily: "sans-serif",
                          fontSize: 13,
                          color: "#57534e",
                        }}
                      >
                        <span>{row.sales_date}</span>
                        <span>{formatMoney(value)}</span>
                      </div>

                      <div
                        style={{
                          height: 12,
                          borderRadius: 999,
                          background: "#F1E7FB",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${width}%`,
                            borderRadius: 999,
                            background: "linear-gradient(90deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          fontFamily: "sans-serif",
                          fontSize: 12,
                          color: "#8D6DB3",
                        }}
                      >
                        Orders: {row.orders_count} · Items: {row.items_sold}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              background: "#FFFCF8",
              border: "1px solid #E8E1F0",
              borderRadius: 24,
              padding: "28px 24px 24px",
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
                Top Products
              </p>
              <h2
                style={{
                  margin: "6px 0 0",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1c1917",
                }}
              >
                Best Performing Items
              </h2>
            </div>

            {report.top_products.length === 0 ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px dashed #D9C2F0",
                  background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)",
                  padding: "36px 20px",
                  textAlign: "center",
                  color: "#78716c",
                  fontFamily: "sans-serif",
                }}
              >
                No product sales yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {report.top_products.map((product, index) => (
                  <div
                    key={product.product_id}
                    style={{
                      border: "1px solid #E8E1F0",
                      borderRadius: 16,
                      background: "linear-gradient(135deg,#FFFCF8,#F8F2FE)",
                      padding: "14px 16px",
                    }}
                  >
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
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1c1917",
                            fontFamily: "Georgia,serif",
                          }}
                        >
                          #{index + 1} {product.product_name}
                        </p>
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 12,
                            color: "#78716c",
                            fontFamily: "sans-serif",
                          }}
                        >
                          Qty sold: {product.total_qty_sold}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#8D6DB3",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {formatMoney(product.seller_earnings)}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: 11,
                            color: "#78716c",
                            fontFamily: "sans-serif",
                          }}
                        >
                          Earnings
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        fontSize: 12,
                        color: "#57534e",
                        fontFamily: "sans-serif",
                      }}
                    >
                      <span>Gross: {formatMoney(product.gross_sales)}</span>
                      <span>Discount: {formatMoney(product.total_discount)}</span>
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