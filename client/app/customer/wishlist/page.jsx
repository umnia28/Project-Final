"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  PackageCheck,
  PackageX,
  Trash2,
  BadgePercent,
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

function Badge({ children, bg, color, border }) {
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
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default function CustomerWishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/customer/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/customer/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

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
            Loading wishlist...
          </div>
        </div>
      </div>
    );
  }

  const totalItems = wishlist.length;
  const inStockCount = wishlist.filter((item) => Number(item.product_count) > 0).length;
  const discountedCount = wishlist.filter((item) => Number(item.discount) > 0).length;

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
                My Wishlist
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
                A curated collection
                <br />
                of what you love
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
                Keep track of the pieces you adore, explore discounted picks, and return
                anytime to the products that caught your eye.
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
                <Heart size={28} color="#fff" strokeWidth={1.8} />
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
                  {totalItems} Wishlist Items
                </p>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 13,
                    color: "#8b5cf6",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Your saved inspirations in one place
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
            title="Saved Items"
            value={totalItems}
            icon={Heart}
            gradFrom="#fce7f3"
            gradTo="#f5d0fe"
            border="#f9a8d4"
            iconColor="#be185d"
          />
          <StatCard
            title="In Stock"
            value={inStockCount}
            icon={PackageCheck}
            gradFrom="#ecfdf5"
            gradTo="#dcfce7"
            border="#86efac"
            iconColor="#15803d"
          />
          <StatCard
            title="Discounted"
            value={discountedCount}
            icon={BadgePercent}
            gradFrom="#fff7ed"
            gradTo="#ffedd5"
            border="#fdba74"
            iconColor="#c2410c"
          />
          <StatCard
            title="Out of Stock"
            value={totalItems - inStockCount}
            icon={PackageX}
            gradFrom="#f5f3ff"
            gradTo="#ede9fe"
            border="#c4b5fd"
            iconColor="#6d28d9"
          />
        </div>

        {wishlist.length === 0 ? (
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
            Your wishlist is empty.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {wishlist.map((item) => {
              const inStock = Number(item.product_count) > 0;
              const hasDiscount = Number(item.discount) > 0;

              return (
                <div
                  key={item.product_id}
                  style={{
                    overflow: "hidden",
                    borderRadius: 30,
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(255,255,255,0.86)",
                    boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.image_url || "/placeholder.png"}
                      alt={item.product_name}
                      style={{
                        width: "100%",
                        height: 240,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Badge
                        bg={inStock ? "#dcfce7" : "#f1f5f9"}
                        color={inStock ? "#047857" : "#475569"}
                        border={inStock ? "#a7f3d0" : "#e2e8f0"}
                      >
                        {inStock ? <PackageCheck size={13} /> : <PackageX size={13} />}
                        {inStock ? "In Stock" : "Out of Stock"}
                      </Badge>

                      {hasDiscount && (
                        <Badge
                          bg="#fff7ed"
                          color="#c2410c"
                          border="#fdba74"
                        >
                          <BadgePercent size={13} />
                          Discount
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: "20px 20px 22px" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.2,
                        color: "#18181b",
                        fontWeight: 600,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {item.product_name}
                    </h2>

                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div>
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
                            fontSize: 28,
                            fontWeight: 600,
                            color: "#18181b",
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          ৳ {item.price}
                        </p>
                      </div>

                      {hasDiscount && (
                        <div style={{ textAlign: "right" }}>
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
                            Discount
                          </p>
                          <p
                            style={{
                              margin: "6px 0 0",
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#c2410c",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            ৳ {item.discount}
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: 18,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#6b7280",
                        fontSize: 13,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <ShoppingBag size={14} color="#a855f7" />
                      {inStock ? "Ready to order" : "Currently unavailable"}
                    </div>

                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      style={{
                        width: "100%",
                        marginTop: 20,
                        border: "none",
                        borderRadius: 16,
                        padding: "14px 18px",
                        background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                        boxShadow: "0 14px 24px rgba(244,63,94,0.16)",
                        transition: "transform 0.2s ease, opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.opacity = "0.95";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <Trash2 size={15} />
                        Remove from Wishlist
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}