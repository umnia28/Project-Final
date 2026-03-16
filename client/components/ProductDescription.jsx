'use client'

import {
  ArrowRight,
  StarIcon,
  Sparkles,
  Store,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import ReviewForm from "./ReviewForm";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const FALLBACK_USER = "/placeholder-user.png";
const FALLBACK_STORE = "/placeholder-store.png";

const resolveImageSrc = (img, fallback = FALLBACK_STORE) => {
  if (!img) return fallback;
  if (typeof img === "object" && typeof img.src === "string") return img;
  if (typeof img !== "string") return fallback;

  const s = img.trim().replace(/^"+|"+$/g, "");
  if (!s) return fallback;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${API}${s}`;
  if (s.startsWith("/")) return s;

  return `${API}/uploads/${s}`;
};

const ProductDescription = ({ product, onReviewAdded }) => {
  const [selectedTab, setSelectedTab] = useState("Description");
  const [ratings, setRatings] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const productId = product?.id ?? product?.product_id ?? null;
  const store = product?.store ?? null;

  const loadReviews = useCallback(async () => {
    try {
      if (!productId) {
        setRatings([]);
        return;
      }

      setLoadingReviews(true);

      const res = await fetch(`${API}/api/reviews/product/${productId}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to load reviews");
      }

      setRatings(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("LOAD REVIEWS ERROR:", err);
      setRatings([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const averageRating = useMemo(() => {
    if (!ratings.length) return 0;
    const total = ratings.reduce(
      (sum, item) => sum + (Number(item?.rating) || 0),
      0
    );
    return total / ratings.length;
  }, [ratings]);

  const storeHref = store?.username
    ? `/shop/${store.username}`
    : store?.ref_no
    ? `/shop/${store.ref_no}`
    : store?.id || store?.store_id
    ? `/shop/${store.id ?? store.store_id}`
    : null;

  const handleReviewSubmitted = async () => {
    await loadReviews();
    onReviewAdded?.();
    setSelectedTab("Reviews");
  };

  if (!product) return null;

  return (
    <div className="relative mt-16 mb-24 overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(168,85,247,0.08)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 h-52 w-52 rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute top-8 right-0 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-orange-200/15 blur-3xl" />
      </div>

      <div className="relative z-10 p-5 sm:p-7 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-100/80 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              Artwork Details
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">
              Discover the story behind this piece
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore the description, collector impressions, and the artist
              store behind this creation.
            </p>

            <button
              onClick={() => setSelectedTab("Reviews")}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(236,72,153,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(168,85,247,0.20)]"
            >
              <MessageCircle size={16} />
              Write a Review
            </button>
          </div>

          {selectedTab === "Reviews" && (
            <div className="self-start rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-md backdrop-blur-md md:self-auto">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Community Rating
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="pb-1 text-sm text-slate-500">/ 5</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {ratings.length} review{ratings.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {["Description", "Reviews"].map((tab) => {
            const active = tab === selectedTab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`group relative overflow-hidden rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "text-white shadow-[0_8px_24px_rgba(168,85,247,0.18)]"
                    : "border border-white/70 bg-white/70 text-slate-600 hover:-translate-y-0.5 hover:bg-white"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "Description" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  {tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        {selectedTab === "Description" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white/85 via-pink-50/45 to-purple-50/40 p-6 shadow-[0_12px_30px_rgba(244,114,182,0.05)] sm:p-8">
              <p className="text-[15px] leading-8 text-slate-700">
                {product.description ??
                  product.product_description ??
                  "No description available."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_12px_30px_rgba(168,85,247,0.06)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Collector Snapshot
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-4">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {product.category || product.category_name || "Artwork"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-orange-50 p-4">
                  <p className="text-sm text-slate-500">Reviews</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {ratings.length} collector impression
                    {ratings.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 p-4">
                  <p className="text-sm text-slate-500">Average Rating</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {ratings.length
                      ? `${averageRating.toFixed(1)} / 5`
                      : "No ratings yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {selectedTab === "Reviews" && (
          <div className="mt-8 space-y-6">
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
            />

            {loadingReviews ? (
              <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-8 text-center text-slate-500 shadow-[0_12px_30px_rgba(168,85,247,0.06)]">
                Loading reviews...
              </div>
            ) : ratings.length === 0 ? (
              <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white/85 via-pink-50/40 to-orange-50/40 p-10 text-center shadow-[0_12px_30px_rgba(251,146,60,0.06)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 text-white shadow-md">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-800">
                  No reviews yet
                </h3>
                <p className="mt-3 text-slate-500">
                  This piece is waiting for its first admirer to leave a review.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {ratings.map((item, idx) => (
                  <div
                    key={item.review_id || idx}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_30px_rgba(168,85,247,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(236,72,153,0.10)] sm:p-6"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -top-12 right-0 h-24 w-24 rounded-full bg-pink-200/15 blur-2xl" />
                      <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-orange-200/15 blur-2xl" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row">
                      <Image
                        src={resolveImageSrc(
                          item?.user?.image || item?.user?.profile_img,
                          FALLBACK_USER
                        )}
                        alt={item?.user?.name ?? item?.user?.username ?? "User"}
                        className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                        width={100}
                        height={100}
                      />

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold text-slate-800">
                              {item?.user?.name ??
                                item?.user?.username ??
                                "Anonymous"}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {item?.time_added || item?.createdAt
                                ? new Date(
                                    item.time_added || item.createdAt
                                  ).toDateString()
                                : ""}
                            </p>
                          </div>

                          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 px-3 py-2 shadow-sm">
                            {Array(5)
                              .fill("")
                              .map((_, i) => (
                                <StarIcon
                                  key={i}
                                  size={16}
                                  className="text-transparent"
                                  fill={
                                    (Number(item?.rating) || 0) >= i + 1
                                      ? "#f59e0b"
                                      : "#d1d5db"
                                  }
                                />
                              ))}
                            <span className="ml-2 text-sm font-semibold text-slate-700">
                              {(Number(item?.rating) || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-5 text-[15px] leading-8 text-slate-600">
                          {item?.review ?? ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Store section */}
        {store ? (
          <div className="mt-10 rounded-[1.75rem] border border-white/70 bg-gradient-to-r from-pink-50/65 via-white/80 to-orange-50/65 p-5 shadow-[0_12px_30px_rgba(249,115,22,0.06)] backdrop-blur-md sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 opacity-60 blur-sm" />
                  <Image
                    src={resolveImageSrc(
                      store.logo || store.profile_img,
                      FALLBACK_STORE
                    )}
                    alt={store.name ?? "Store"}
                    className="relative h-16 w-16 rounded-full border-2 border-white bg-white object-cover shadow-md"
                    width={100}
                    height={100}
                  />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    <Store className="h-4 w-4 text-pink-400" />
                    Artist Store
                  </div>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    Product by {store.name ?? "Store"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Explore more pieces from this creative collection.
                  </p>
                </div>
              </div>

              {storeHref ? (
                <Link
                  href={storeHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(236,72,153,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(168,85,247,0.20)]"
                >
                  View Store
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDescription;