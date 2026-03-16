'use client'

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !productId) {
          setChecking(false);
          return;
        }

        const res = await fetch(`${API}/api/reviews/can-review/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setCanReview(Boolean(data.canReview));
          setAlreadyReviewed(Boolean(data.alreadyReviewed));

          if (data.existingReview) {
            setRating(Number(data.existingReview.rating || 0));
            setReview(data.existingReview.review || "");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    fetchPermission();
  }, [productId]);

  const submitReview = async () => {
    try {
      if (rating < 1 || rating > 5) {
        toast.error("Please select a rating");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      setLoading(true);

      const method = alreadyReviewed ? "PATCH" : "POST";

      const res = await fetch(`${API}/api/reviews/product/${productId}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast.success(data.message || "Review submitted");
      setAlreadyReviewed(true);

      if (onReviewSubmitted) {
        await onReviewSubmitted();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  if (!canReview) return null;

  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_35px_rgba(168,85,247,0.08)] backdrop-blur-md">
      <h3 className="text-lg font-semibold text-slate-800">
        {alreadyReviewed ? "Update your review" : "Write a review"}
      </h3>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const active = (hovered || rating) > i;
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i + 1)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={20}
                className={
                  active
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-300 fill-slate-200"
                }
              />
            </button>
          );
        })}
      </div>

      <textarea
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:ring-2 focus:ring-pink-300"
        rows={4}
        placeholder="Share your thoughts about this product..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-4 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 px-5 py-2.5 text-sm font-semibold text-white shadow hover:scale-105 transition disabled:opacity-60"
      >
        {loading ? "Submitting..." : alreadyReviewed ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
}