"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import {
  Heart,
  StarIcon,
  ShoppingBag,
  PackageCheck,
  PackageX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const FALLBACK_IMG = "/placeholder.png";
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

const toPublicImageUrl = (img, fallback = FALLBACK_IMG) => {
  if (!img) return fallback;

  if (typeof img === "object" && typeof img.src === "string") return img;
  if (typeof img !== "string") return fallback;

  const s = img.trim();
  if (!s) return fallback;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${API}${s}`;
  if (s.startsWith("/")) return s;

  return `${API}/uploads/${s}`;
};

const formatPrice = (value) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return `${CURRENCY}0`;
  return `${CURRENCY}${num.toLocaleString()}`;
};

const getProductId = (product) => product?.product_id ?? product?.id ?? null;
const getProductName = (product) =>
  product?.product_name ?? product?.name ?? "Product";

const getProductImage = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return toPublicImageUrl(product.images[0]);
  }
  if (product?.image_url) return toPublicImageUrl(product.image_url);
  if (product?.image) return toPublicImageUrl(product.image);
  return FALLBACK_IMG;
};

const getRatingArray = (product) => {
  if (Array.isArray(product?.rating)) return product.rating;
  if (Array.isArray(product?.reviews)) return product.reviews;
  if (Array.isArray(product?.product_reviews)) return product.product_reviews;
  return [];
};

const getAverageRating = (product) => {
  if (product?.rating_avg !== undefined && product?.rating_avg !== null) {
    return Number(product.rating_avg) || 0;
  }

  if (product?.avg_rating !== undefined && product?.avg_rating !== null) {
    return Number(product.avg_rating) || 0;
  }

  if (
    product?.average_rating !== undefined &&
    product?.average_rating !== null
  ) {
    return Number(product.average_rating) || 0;
  }

  const ratingArray = getRatingArray(product);
  if (ratingArray.length > 0) {
    const avg =
      ratingArray.reduce(
        (acc, curr) => acc + Number(curr?.rating || 0),
        0
      ) / ratingArray.length;
    return Number(avg) || 0;
  }

  return 0;
};

const getRatingCount = (product) => {
  if (product?.rating_count !== undefined && product?.rating_count !== null) {
    return Number(product.rating_count) || 0;
  }

  if (product?.review_count !== undefined && product?.review_count !== null) {
    return Number(product.review_count) || 0;
  }

  return getRatingArray(product).length;
};

const ProductCard = ({
  product,
  initialWishlisted = false,
  onWishlistChange,
}) => {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const productId = getProductId(product);
  const productName = getProductName(product);
  const imgSrc = getProductImage(product);

  const avgRating = useMemo(() => getAverageRating(product), [product]);
  const ratingCount = useMemo(() => getRatingCount(product), [product]);
  const roundedRating = Math.round(avgRating);

  const hasStockField =
    product?.product_count !== undefined && product?.product_count !== null;
  const stock = hasStockField ? Number(product.product_count) : null;
  const status = String(product?.status || "").toLowerCase();

  const isOutOfStock =
    status === "inactive" ||
    (hasStockField && !Number.isNaN(stock) && stock <= 0);

  const isLowStock =
    !isOutOfStock &&
    hasStockField &&
    !Number.isNaN(stock) &&
    stock > 0 &&
    stock <= 5;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      if (wishlisted) {
        await axios.delete(`${API}/api/customer/wishlist/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setWishlisted(false);
        onWishlistChange?.(productId, false);
      } else {
        await axios.post(
          `${API}/api/customer/wishlist/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setWishlisted(true);
        onWishlistChange?.(productId, true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      alert(err.response?.data?.message || "Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(255,255,255,0.86)",
          boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
          backdropFilter: "blur(20px)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 28px 80px rgba(168,85,247,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 24px 70px rgba(168,85,247,0.08)";
        }}
      >
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 3,
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.86)",
            background: wishlisted
              ? "linear-gradient(135deg,#ec4899,#a855f7,#f97316)"
              : "rgba(255,255,255,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: wishlistLoading ? "default" : "pointer",
            boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
            opacity: wishlistLoading ? 0.7 : 1,
          }}
        >
          <Heart
            size={18}
            color={wishlisted ? "#fff" : "#a855f7"}
            fill={wishlisted ? "#fff" : "none"}
            strokeWidth={2}
          />
        </button>

        <Link
          href={productId ? `/product/${productId}` : "#"}
          style={{ display: "block", textDecoration: "none" }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              margin: 12,
              borderRadius: 24,
              border: "1px solid rgba(244,114,182,0.10)",
              background:
                "linear-gradient(135deg, rgba(255,245,247,0.95), rgba(255,255,255,0.98), rgba(255,247,237,0.96))",
              height: 250,
            }}
          >
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                top: -20,
                left: -20,
                width: 110,
                height: 110,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.18), transparent 70%)",
              }}
            />
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                bottom: -25,
                right: -25,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(249,115,22,0.14), transparent 70%)",
              }}
            />

            {isOutOfStock && (
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  zIndex: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 10px 24px rgba(244,63,94,0.18)",
                }}
              >
                <PackageX size={13} />
                Out of Stock
              </span>
            )}

            <Image
              src={imgSrc}
              alt={productName}
              width={900}
              height={900}
              unoptimized={
                typeof imgSrc === "string" && imgSrc.startsWith("http")
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: 20,
                transition: "transform 0.45s ease",
              }}
            />
          </div>

          <div style={{ padding: "4px 18px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 19,
                    lineHeight: 1.25,
                    color: "#18181b",
                    fontWeight: 600,
                    fontFamily: "Georgia, serif",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {productName}
                </h3>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon
                        key={index}
                        size={14}
                        color={index < roundedRating ? "#f59e0b" : "#d1d5db"}
                        fill={index < roundedRating ? "#f59e0b" : "#d1d5db"}
                      />
                    ))}
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {avgRating > 0 ? avgRating.toFixed(1) : "0.0"} ({ratingCount})
                  </span>
                </div>

                <div style={{ marginTop: 12 }}>
                  {isOutOfStock ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "#ffe4e6",
                        color: "#be123c",
                        border: "1px solid #fecdd3",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <PackageX size={13} />
                      Unavailable
                    </span>
                  ) : isLowStock ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "#fff7ed",
                        color: "#c2410c",
                        border: "1px solid #fdba74",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <ShoppingBag size={13} />
                      Only {stock} left
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "#dcfce7",
                        color: "#047857",
                        border: "1px solid #a7f3d0",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <PackageCheck size={13} />
                      {hasStockField && !Number.isNaN(stock)
                        ? `In Stock: ${stock}`
                        : "Available"}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  flexShrink: 0,
                  borderRadius: 999,
                  padding: "10px 14px",
                  background:
                    "linear-gradient(135deg, rgba(255,245,247,0.98), rgba(255,255,255,0.98), rgba(255,247,237,0.98))",
                  border: "1px solid rgba(244,114,182,0.12)",
                  color: "#18181b",
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  boxShadow: "0 10px 20px rgba(168,85,247,0.05)",
                }}
              >
                {formatPrice(product?.price)}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;