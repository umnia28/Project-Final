/*'use client'

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
        {/* Header 
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

        {/* Tabs 
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

        {/* Description 
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

        {/* Reviews 
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

        {/* Store section 
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

export default ProductDescription;*/

'use client'

import {
  ArrowRight,
  StarIcon,
  Sparkles,
  Store,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BadgeCheck,
  HelpCircle,
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

const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || null;
  } catch {
    return null;
  }
};

const ProductDescription = ({ product, onReviewAdded }) => {
  const [selectedTab, setSelectedTab] = useState("Description");
  const [ratings, setRatings] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [loadingQa, setLoadingQa] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [asking, setAsking] = useState(false);
  const [answerInputs, setAnswerInputs] = useState({});
  const [answeringId, setAnsweringId] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [viewerRole, setViewerRole] = useState(null);

  const productId = product?.id ?? product?.product_id ?? null;
  const store = product?.store ?? null;

  useEffect(() => {
    setViewerRole(getRoleFromToken());
  }, []);

  const canAnswer = viewerRole === "seller" || viewerRole === "admin";

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

  const loadQa = useCallback(async () => {
    try {
      if (!productId) {
        setQuestions([]);
        return;
      }

      setLoadingQa(true);

      const res = await fetch(`${API}/api/product-qa/product/${productId}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to load Q&A");
      }

      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      console.error("LOAD QA ERROR:", err);
      setQuestions([]);
    } finally {
      setLoadingQa(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
    loadQa();
  }, [loadReviews, loadQa]);

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

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");
      if (!questionText.trim()) throw new Error("Please write a question");

      setAsking(true);

      const res = await fetch(`${API}/api/product-qa/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number(productId),
          question_text: questionText.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit question");
      }

      setQuestionText("");
      await loadQa();
      setSelectedTab("Q&A");
    } catch (err) {
      console.error("ASK QUESTION ERROR:", err);
      alert(err.message || "Failed to submit question");
    } finally {
      setAsking(false);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const answer = answerInputs[questionId]?.trim();
      if (!answer) throw new Error("Please write an answer");

      setAnsweringId(questionId);

      const res = await fetch(`${API}/api/product-qa/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_id: Number(questionId),
          item_answered: answer,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit answer");
      }

      setAnswerInputs((prev) => ({ ...prev, [questionId]: "" }));
      setExpandedAnswers((prev) => ({ ...prev, [questionId]: true }));
      await loadQa();
    } catch (err) {
      console.error("ANSWER QUESTION ERROR:", err);
      alert(err.message || "Failed to submit answer");
    } finally {
      setAnsweringId(null);
    }
  };

  const toggleAnswers = (questionId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getAnswerBadge = (ans) => {
    const role = ans?.answered_by_user?.role;
    if (role === "admin") {
      return {
        label: "Answered by admin",
        icon: <ShieldCheck className="h-3.5 w-3.5" />,
        cls: "border-[#e7ddff] bg-[#f6f1ff] text-[#6e55b7]",
      };
    }
    if (role === "seller") {
      return {
        label: "Answered by seller",
        icon: <BadgeCheck className="h-3.5 w-3.5" />,
        cls: "border-[#f2decf] bg-[#fff4eb] text-[#b26c3e]",
      };
    }
    return {
      label: "Answered",
      icon: <MessageCircle className="h-3.5 w-3.5" />,
      cls: "border-[#eadfce] bg-[#faf5ed] text-[#6f5a45]",
    };
  };

  if (!product) return null;

  return (
    <div className="relative mt-16 mb-24 overflow-hidden rounded-[2rem] border border-[#efe6dc] bg-[linear-gradient(180deg,rgba(255,252,249,0.98),rgba(250,245,239,0.98))] shadow-[0_18px_45px_rgba(91,68,46,0.06)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-[#f6dfff]/35 blur-3xl" />
        <div className="absolute top-12 right-0 h-72 w-72 rounded-full bg-[#ffe9d6]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-[#fff1de]/40 blur-3xl" />
      </div>

      <div className="relative z-10 p-5 sm:p-7 md:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[linear-gradient(90deg,#fbf0ff,#fff3ea,#fff8ee)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f5a45]">
              <Sparkles className="h-3.5 w-3.5 text-[#9f77c5]" />
              Artwork Details
            </div>

            <h2 className="mt-4 font-display text-2xl font-medium text-[#2d241c] sm:text-3xl">
              Discover the story behind this piece
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#7b6c5f] sm:text-base">
              Explore the description, collector impressions, questions, and the
              artist store behind this creation.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTab("Reviews")}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#a981cf,#8f6ab8)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(143,106,184,0.18)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle size={16} />
                Write a Review
              </button>

              <button
                onClick={() => setSelectedTab("Q&A")}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#ffd9bc,#ffe8d6)] px-5 py-2.5 text-sm font-semibold text-[#9d6131] shadow-[0_10px_24px_rgba(218,143,85,0.12)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <HelpCircle size={16} />
                Ask a Question
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[340px]">
            <div className="rounded-2xl border border-[#ece1d6] bg-[linear-gradient(180deg,#fffdfa,#fff7f0)] px-5 py-4 shadow-[0_10px_24px_rgba(91,68,46,0.04)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8b7b]">
                Community Rating
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-[#2d241c]">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="pb-1 text-sm text-[#8a7a6b]">/ 5</span>
              </div>
              <p className="mt-1 text-sm text-[#8a7a6b]">
                {ratings.length} review{ratings.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ece1d6] bg-[linear-gradient(180deg,#fffdfa,#f9f2ff)] px-5 py-4 shadow-[0_10px_24px_rgba(91,68,46,0.04)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8b7b]">
                Product Q&A
              </p>
              <div className="mt-2 text-3xl font-bold text-[#2d241c]">
                {questions.length}
              </div>
              <p className="mt-1 text-sm text-[#8a7a6b]">
                question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {["Description", "Reviews", "Q&A"].map((tab) => {
            const active = tab === selectedTab;
            const base =
              "rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300";
            const map = {
              Description: active
                ? "bg-[linear-gradient(90deg,#f2e7ff,#ead9ff)] text-[#6f49a5] shadow-[0_10px_22px_rgba(143,106,184,0.12)]"
                : "border border-[#eadfce] bg-[#fffdfa] text-[#6f5a45] hover:-translate-y-0.5",
              Reviews: active
                ? "bg-[linear-gradient(90deg,#a981cf,#8f6ab8)] text-white shadow-[0_10px_22px_rgba(143,106,184,0.18)]"
                : "border border-[#eadfce] bg-[#fffdfa] text-[#6f5a45] hover:-translate-y-0.5",
              "Q&A": active
                ? "bg-[linear-gradient(90deg,#ffd8bf,#ffecd9)] text-[#a0602d] shadow-[0_10px_22px_rgba(218,143,85,0.16)]"
                : "border border-[#eadfce] bg-[#fffdfa] text-[#6f5a45] hover:-translate-y-0.5",
            };

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`${base} ${map[tab]}`}
              >
                <span className="flex items-center gap-2">
                  {tab === "Description" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : tab === "Reviews" ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  {tab}
                </span>
              </button>
            );
          })}
        </div>

        {selectedTab === "Description" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-[#efe7db] bg-[linear-gradient(180deg,#fffdfa,#fff7f0)] p-6 shadow-[0_12px_30px_rgba(91,68,46,0.04)] sm:p-8">
              <p className="text-[15px] leading-8 text-[#5f5145]">
                {product.description ??
                  product.product_description ??
                  "No description available."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#efe7db] bg-[#fffdfa] p-6 shadow-[0_12px_30px_rgba(91,68,46,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a8b7b]">
                Collector Snapshot
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[linear-gradient(90deg,#f8f0ff,#fff7ef)] p-4">
                  <p className="text-sm text-[#8a7a6b]">Category</p>
                  <p className="mt-1 text-base font-semibold text-[#2d241c]">
                    {product.category || product.category_name || "Artwork"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[linear-gradient(90deg,#fff7ee,#fff2e7)] p-4">
                  <p className="text-sm text-[#8a7a6b]">Reviews</p>
                  <p className="mt-1 text-base font-semibold text-[#2d241c]">
                    {ratings.length} collector impression
                    {ratings.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-[linear-gradient(90deg,#f4ecff,#fffaf4)] p-4">
                  <p className="text-sm text-[#8a7a6b]">Average Rating</p>
                  <p className="mt-1 text-base font-semibold text-[#2d241c]">
                    {ratings.length
                      ? `${averageRating.toFixed(1)} / 5`
                      : "No ratings yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "Reviews" && (
          <div className="mt-8 space-y-6">
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
            />

            {loadingReviews ? (
              <div className="rounded-[1.75rem] border border-[#efe7db] bg-[#fffdfa] p-8 text-center text-[#7b6c5f] shadow-[0_12px_30px_rgba(91,68,46,0.04)]">
                Loading reviews...
              </div>
            ) : ratings.length === 0 ? (
              <div className="rounded-[1.75rem] border border-[#efe7db] bg-[linear-gradient(180deg,#fffdfa,#fff6ee)] p-10 text-center shadow-[0_12px_30px_rgba(91,68,46,0.04)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(90deg,#f1e4ff,#ffe7d5)] text-[#9a7b5f] shadow-md">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-[#2d241c]">
                  No reviews yet
                </h3>
                <p className="mt-3 text-[#7b6c5f]">
                  This piece is waiting for its first admirer to leave a review.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {ratings.map((item, idx) => (
                  <div
                    key={item.review_id || idx}
                    className="rounded-[1.75rem] border border-[#efe7db] bg-[#fffdfa] p-5 shadow-[0_12px_30px_rgba(91,68,46,0.04)] transition-all duration-300 hover:-translate-y-1 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
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
                            <p className="text-lg font-semibold text-[#2d241c]">
                              {item?.user?.name ??
                                item?.user?.username ??
                                "Anonymous"}
                            </p>
                            <p className="mt-1 text-sm text-[#9a8b7b]">
                              {item?.time_added || item?.createdAt
                                ? new Date(
                                  item.time_added || item.createdAt
                                ).toDateString()
                                : ""}
                            </p>
                          </div>

                          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-[#eadfce] bg-[linear-gradient(90deg,#fff7ef,#fff1e8)] px-3 py-2">
                            {Array(5)
                              .fill("")
                              .map((_, i) => (
                                <StarIcon
                                  key={i}
                                  size={16}
                                  className="text-transparent"
                                  fill={
                                    (Number(item?.rating) || 0) >= i + 1
                                      ? "#c38b2c"
                                      : "#d1d5db"
                                  }
                                />
                              ))}
                            <span className="ml-2 text-sm font-semibold text-[#6f5a45]">
                              {(Number(item?.rating) || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-5 text-[15px] leading-8 text-[#5f5145]">
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

        {selectedTab === "Q&A" && (
          <div className="mt-8 space-y-6">
            <form
              onSubmit={handleAskQuestion}
              className="rounded-[1.75rem] border border-[#efe7db] bg-[linear-gradient(180deg,#fffdfa,#fff7ef)] p-6 shadow-[0_12px_30px_rgba(91,68,46,0.04)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-display text-xl font-medium text-[#2d241c]">
                    Ask about this product
                  </p>
                  <p className="mt-1 text-sm text-[#7b6c5f]">
                    Ask about size, material, delivery, or anything buyers should know.
                  </p>
                </div>

                <div className="rounded-full bg-[linear-gradient(90deg,#f1e6ff,#ffe7d4)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#86639f]">
                  Customer Questions
                </div>
              </div>

              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={4}
                placeholder="Write your question..."
                className="mt-4 w-full rounded-2xl border border-[#eadfce] bg-[#fffdfa] px-4 py-3 text-sm text-[#2d241c] outline-none transition-all focus:border-[#cdaef2] focus:ring-4 focus:ring-[#f3e8ff]"
              />

              <button
                type="submit"
                disabled={asking}
                className="mt-4 rounded-full bg-[linear-gradient(90deg,#ffddb9,#ffe9d7)] px-5 py-3 text-sm font-semibold text-[#9a5e30] shadow-[0_10px_22px_rgba(218,143,85,0.14)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {asking ? "Submitting..." : "Submit Question"}
              </button>
            </form>

            {loadingQa ? (
              <div className="rounded-[1.75rem] border border-[#efe7db] bg-[#fffdfa] p-8 text-center text-[#7b6c5f] shadow-[0_12px_30px_rgba(91,68,46,0.04)]">
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-[1.75rem] border border-[#efe7db] bg-[linear-gradient(180deg,#fffdfa,#f9f2ff)] p-10 text-center shadow-[0_12px_30px_rgba(91,68,46,0.04)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(90deg,#f1e4ff,#ffe7d5)] text-[#9a7b5f] shadow-md">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-[#2d241c]">
                  No questions yet
                </h3>
                <p className="mt-3 text-[#7b6c5f]">
                  Be the first to ask about this product.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {questions.map((q) => {
                  const answers = Array.isArray(q.answers) ? q.answers : [];
                  const isExpanded = !!expandedAnswers[q.question_id];
                  const visibleAnswers = isExpanded ? answers : answers.slice(0, 1);

                  return (
                    <div
                      key={q.question_id}
                      className="rounded-[1.75rem] border border-[#efe7db] bg-[#fffdfa] p-6 shadow-[0_12px_30px_rgba(91,68,46,0.04)]"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={resolveImageSrc(q?.asked_by_user?.profile_img, FALLBACK_USER)}
                          alt={q?.asked_by_user?.username || "User"}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                          width={80}
                          height={80}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-semibold text-[#2d241c]">
                              {q?.asked_by_user?.full_name ||
                                q?.asked_by_user?.username ||
                                "Customer"}
                            </p>
                            <span className="rounded-full bg-[#faf5ed] px-3 py-1 text-xs font-medium text-[#8b7360]">
                              Question
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-[#9a8b7b]">
                            {q?.time_asked ? new Date(q.time_asked).toDateString() : ""}
                          </p>
                          <p className="mt-3 text-[15px] leading-7 text-[#5f5145]">
                            {q.question_text}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-[#f1e8de] bg-[linear-gradient(180deg,#fffaf5,#fffdfa)] p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#6f5a45]">
                            Answers ({answers.length})
                          </p>

                          {answers.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => toggleAnswers(q.question_id)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-semibold text-[#8a6a52] transition-all hover:-translate-y-0.5"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3.5 w-3.5" />
                                  Collapse
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3.5 w-3.5" />
                                  View all
                                </>
                              )}
                            </button>
                          ) : null}
                        </div>

                        <div className="space-y-4">
                          {answers.length > 0 ? (
                            visibleAnswers.map((ans) => {
                              const badge = getAnswerBadge(ans);

                              return (
                                <div
                                  key={ans.answer_id}
                                  className="rounded-2xl border border-[#efe7db] bg-[linear-gradient(90deg,#fff7ef,#faf4ff)] p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <Image
                                      src={resolveImageSrc(ans?.answered_by_user?.profile_img, FALLBACK_USER)}
                                      alt={ans?.answered_by_user?.username || "User"}
                                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                      width={60}
                                      height={60}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-[#2d241c]">
                                          {ans?.answered_by_user?.full_name ||
                                            ans?.answered_by_user?.username ||
                                            "Responder"}
                                        </p>

                                        <span
                                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.cls}`}
                                        >
                                          {badge.icon}
                                          {badge.label}
                                        </span>
                                      </div>

                                      <p className="mt-1 text-xs text-[#9a8b7b]">
                                        {ans?.time_answered
                                          ? new Date(ans.time_answered).toDateString()
                                          : ""}
                                      </p>

                                      <p className="mt-2 text-sm leading-7 text-[#5f5145]">
                                        {ans.item_answered}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-[#9a8b7b]">No answer yet.</p>
                          )}
                        </div>
                      </div>

                      {canAnswer ? (
                        <div className="mt-5 border-t border-[#efe7db] pt-4">
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#f1e6ff,#fff0e1)] px-3 py-1.5 text-xs font-semibold text-[#805f9d]">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {viewerRole === "admin" ? "Admin reply" : "Seller reply"}
                          </div>

                          <textarea
                            value={answerInputs[q.question_id] || ""}
                            onChange={(e) =>
                              setAnswerInputs((prev) => ({
                                ...prev,
                                [q.question_id]: e.target.value,
                              }))
                            }
                            rows={3}
                            placeholder="Write an answer..."
                            className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdfa] px-4 py-3 text-sm text-[#2d241c] outline-none transition-all focus:border-[#cdaef2] focus:ring-4 focus:ring-[#f3e8ff]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAnswerSubmit(q.question_id)}
                            disabled={answeringId === q.question_id}
                            className="mt-3 rounded-full bg-[linear-gradient(90deg,#efe2ff,#f7ecff)] px-5 py-2.5 text-sm font-semibold text-[#6f49a5] shadow-[0_10px_22px_rgba(143,106,184,0.10)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                          >
                            {answeringId === q.question_id
                              ? "Submitting..."
                              : "Submit Answer"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-2xl border border-[#efe7db] bg-[#fffaf4] px-4 py-3 text-sm text-[#8b7b6d]">
                          Answers can be added by the seller or admin.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {store ? (
          <div className="mt-10 rounded-[1.75rem] border border-[#efe7db] bg-[linear-gradient(90deg,#fff8f2,#fbf4ff,#fffaf4)] p-5 shadow-[0_12px_30px_rgba(91,68,46,0.04)] sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-[linear-gradient(90deg,#eddcff,#ffe4d1)] opacity-70 blur-sm" />
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
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9a8b7b]">
                    <Store className="h-4 w-4 text-[#9f77c5]" />
                    Artist Store
                  </div>
                  <p className="mt-1 text-lg font-semibold text-[#2d241c]">
                    Product by {store.name ?? "Store"}
                  </p>
                  <p className="mt-1 text-sm text-[#7b6c5f]">
                    Explore more pieces from this creative collection.
                  </p>
                </div>
              </div>

              {storeHref ? (
                <Link
                  href={storeHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#ffd8bf,#ffecd9)] px-6 py-3 text-sm font-semibold text-[#9a5e30] shadow-[0_10px_22px_rgba(218,143,85,0.14)] transition-all duration-300 hover:-translate-y-0.5"
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