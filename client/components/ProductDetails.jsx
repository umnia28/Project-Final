'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const FALLBACK_IMG = "/placeholder.png";

const toPublicImageUrl = (img, fallback = FALLBACK_IMG) => {
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

const ProductDetails = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems || {});

  const normalized = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      id: product.id ?? product.product_id,
      name: product.name ?? product.product_name ?? "Untitled Product",
      description: product.description ?? product.product_description ?? "",
      category: product.category ?? product.category_name ?? "Artwork",
      price: Number(product.price ?? 0),
      mrp:
        product.mrp !== undefined && product.mrp !== null
          ? Number(product.mrp)
          : null,
      product_count: Number(product.product_count ?? 0),
      status: String(product.status ?? "active").toLowerCase(),
      rating: Array.isArray(product.rating) ? product.rating : [],
    };
  }, [product]);

  const productId = normalized?.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const images = useMemo(() => {
    const raw = normalized?.images ?? [];
    if (!Array.isArray(raw)) return raw ? [raw] : [FALLBACK_IMG];

    const valid = raw.filter((img) => {
      if (!img) return false;
      if (typeof img === "string") return img.trim().length > 0;
      if (typeof img === "object" && typeof img.src === "string") return true;
      return false;
    });

    return valid.length ? valid : [FALLBACK_IMG];
  }, [normalized]);

  const [mainImage, setMainImage] = useState(images[0] ?? FALLBACK_IMG);

  useEffect(() => {
    setMainImage(images[0] ?? FALLBACK_IMG);
  }, [images]);

  const ratingArr = normalized?.rating || [];
  const averageRating =
    ratingArr.length > 0
      ? ratingArr.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0) / ratingArr.length
      : 0;

  const mainSrc = toPublicImageUrl(mainImage, FALLBACK_IMG);

  // ✅ schema-accurate stock logic
  const stock = normalized?.product_count ?? 0;
  const isOutOfStock = stock <= 0 || normalized?.status !== "active";

  const discountPercent =
    normalized?.mrp && normalized.mrp > normalized.price
      ? Math.round(((normalized.mrp - normalized.price) / normalized.mrp) * 100)
      : 0;

  const addToCartHandler = () => {
    if (!productId || isOutOfStock) return;
    dispatch(addToCart({ productId }));
  };

  useEffect(() => {
    console.log("SCHEMA DEBUG PRODUCT =", normalized);
  }, [normalized]);

  if (!normalized) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div className="relative">
        <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute -right-6 bottom-10 h-40 w-40 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row">
          <div className="order-2 flex gap-3 md:order-1 md:flex-col">
            {images.map((image, index) => {
              const thumbSrc = toPublicImageUrl(image, FALLBACK_IMG);
              const isSelected = thumbSrc === mainSrc;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(image)}
                  className={`group relative h-24 w-24 overflow-hidden rounded-2xl border bg-white/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-pink-300 ring-2 ring-pink-200"
                      : "border-white/70 hover:border-purple-200"
                  }`}
                >
                  <Image
                    src={thumbSrc}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>

          <div className="order-1 flex-1 md:order-2">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-white via-pink-50/70 to-purple-50/70 shadow-[0_20px_60px_rgba(236,72,153,0.10)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_center,rgba(251,146,60,0.10),transparent_45%)]" />

              <div className="relative flex h-[430px] items-center justify-center sm:h-[520px]">
                <Image
                  src={mainSrc}
                  alt={normalized.name}
                  width={900}
                  height={1100}
                  className={`h-full w-full object-contain p-6 transition duration-300 ${
                    isOutOfStock ? "opacity-75" : ""
                  }`}
                />

                {isOutOfStock && (
                  <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    Out of Stock
                  </span>
                )}

                {!isOutOfStock && discountPercent > 0 && (
                  <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_rgba(168,85,247,0.08)] backdrop-blur-md sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Featured Artwork
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl">
            {normalized.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-3 py-2 shadow-sm">
              {Array(5).fill("").map((_, index) => (
                <StarIcon
                  key={index}
                  size={15}
                  className="text-transparent"
                  fill={averageRating >= index + 1 ? "#f59e0b" : "#d1d5db"}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">
                {averageRating ? averageRating.toFixed(1) : "0.0"}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              {ratingArr.length} Review{ratingArr.length !== 1 ? "s" : ""}
            </p>

            <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              {normalized.category}
            </span>
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-gradient-to-r from-white via-pink-50/70 to-orange-50/70 p-5 shadow-inner">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-bold text-slate-800">
                {currency}{normalized.price}
              </p>

              {normalized.mrp && normalized.mrp > normalized.price ? (
                <p className="text-lg text-slate-400 line-through">
                  {currency}{normalized.mrp}
                </p>
              ) : null}
            </div>

            {discountPercent > 0 ? (
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-pink-600">
                <TagIcon size={15} />
                Save {discountPercent}% right now
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <TagIcon size={15} />
                Exclusive handcrafted pricing
              </div>
            )}
          </div>

          <div className="mt-6">
            {isOutOfStock ? (
              <div className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
                Out of Stock
              </div>
            ) : stock <= 5 ? (
              <div className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                Only {stock} left in stock
              </div>
            ) : (
              <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-600">
                In Stock
              </div>
            )}
          </div>

          {normalized.description ? (
            <p className="mt-6 text-[15px] leading-8 text-slate-600">
              {normalized.description}
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-end gap-5">
            {!isOutOfStock && productId && cart?.[productId] ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Quantity
                </p>
                <Counter productId={productId} maxQty={stock} />
              </div>
            ) : null}

            <button
              onClick={() => {
                if (isOutOfStock) return;
                !cart?.[productId] ? addToCartHandler() : router.push("/cart");
              }}
              disabled={isOutOfStock}
              className={`group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 ${
                isOutOfStock
                  ? "cursor-not-allowed bg-slate-300 text-white"
                  : "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow-[0_14px_35px_rgba(236,72,153,0.25)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(168,85,247,0.30)]"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {isOutOfStock
                ? "Out of Stock"
                : !cart?.[productId]
                ? "Add to Cart"
                : "View Cart"}
            </button>
          </div>

          <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          <div className="grid gap-4 text-slate-600">
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm">
              <CreditCardIcon className="mt-0.5 h-5 w-5 text-pink-500" />
              <div>
                <p className="font-semibold text-slate-800">100% Secure Payment</p>
                <p className="mt-1 text-sm text-slate-500">
                  Safe checkout for a smooth and trusted purchase experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm">
              <EarthIcon className="mt-0.5 h-5 w-5 text-purple-500" />
              <div>
                <p className="font-semibold text-slate-800">Free Shipping Above 999 Tk</p>
                <p className="mt-1 text-sm text-slate-500">
                  Enjoy complimentary delivery on qualifying orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm">
              <UserIcon className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-slate-800">Authentic Handmade Products</p>
                <p className="mt-1 text-sm text-slate-500">
                  Carefully crafted pieces with a unique artistic touch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;