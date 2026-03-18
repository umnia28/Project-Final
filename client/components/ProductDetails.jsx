"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  CreditCardIcon,
  UserIcon,
  ShoppingBag,
  Sparkles,
  PackageCheck,
  PackageX,
  Gem,
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

const getRatingArray = (product) => {
  if (Array.isArray(product?.rating)) return product.rating;
  if (Array.isArray(product?.reviews)) return product.reviews;
  if (Array.isArray(product?.product_reviews)) return product.product_reviews;
  return [];
};

const getNormalizedAverageRating = (product) => {
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
        (acc, item) => acc + (Number(item?.rating) || 0),
        0
      ) / ratingArray.length;

    return Number(avg) || 0;
  }

  return 0;
};

const getNormalizedRatingCount = (product) => {
  if (product?.rating_count !== undefined && product?.rating_count !== null) {
    return Number(product.rating_count) || 0;
  }

  if (product?.review_count !== undefined && product?.review_count !== null) {
    return Number(product.review_count) || 0;
  }

  return getRatingArray(product).length;
};

const ProductDetails = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems || {});

  const normalized = useMemo(() => {
    if (!product) return null;

    const ratingArray = getRatingArray(product);
    const normalizedAvg = getNormalizedAverageRating(product);
    const normalizedCount = getNormalizedRatingCount(product);

    return {
      ...product,
      id: product.id ?? product.product_id,
      product_id: product.product_id ?? product.id,
      name: product.name ?? product.product_name ?? "Untitled Product",
      product_name: product.product_name ?? product.name ?? "Untitled Product",
      description: product.description ?? product.product_description ?? "",
      product_description:
        product.product_description ?? product.description ?? "",
      category: product.category ?? product.category_name ?? "Artwork",
      category_name: product.category_name ?? product.category ?? "Artwork",
      price: Number(product.price ?? 0),
      mrp:
        product.mrp !== undefined && product.mrp !== null
          ? Number(product.mrp)
          : null,
      product_count: Number(product.product_count ?? 0),
      status: String(product.status ?? "active").toLowerCase(),
      images: Array.isArray(product.images) ? product.images : [],
      rating: ratingArray,
      rating_avg: Number.isNaN(normalizedAvg) ? 0 : normalizedAvg,
      rating_count: Number.isNaN(normalizedCount) ? 0 : normalizedCount,
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

  const averageRating = Number(normalized?.rating_avg || 0);
  const reviewCount = Number(normalized?.rating_count || 0);
  const roundedRating = Math.round(averageRating);

  const mainSrc = toPublicImageUrl(mainImage, FALLBACK_IMG);

  const stock = Number(normalized?.product_count ?? 0);
  const isOutOfStock = stock <= 0 || normalized?.status !== "active";

  const discountPercent =
    normalized?.mrp && normalized.mrp > normalized.price
      ? Math.round(
          ((normalized.mrp - normalized.price) / normalized.mrp) * 100
        )
      : 0;

  const addToCartHandler = () => {
    if (!productId || isOutOfStock) return;
    dispatch(addToCart({ productId }));
  };

  if (!normalized) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
      <div className="relative">
        <div className="absolute -left-6 top-10 h-36 w-36 rounded-full bg-[#e6d8c3]/35 blur-3xl" />
        <div className="absolute -right-4 bottom-12 h-36 w-36 rounded-full bg-[#d7c4ef]/30 blur-3xl" />

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
                  className={`group relative h-24 w-24 overflow-hidden rounded-[22px] border bg-white transition-all duration-300 ${
                    isSelected
                      ? "border-[#d7c4ef] ring-2 ring-[#efe7fb] shadow-[0_10px_24px_rgba(167,139,219,0.10)]"
                      : "border-[#e8e2ef] hover:-translate-y-0.5 hover:border-[#cfc4e2] hover:shadow-[0_10px_24px_rgba(167,139,219,0.08)]"
                  }`}
                >
                  <Image
                    src={thumbSrc}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover p-1.5 transition-transform duration-500 group-hover:scale-[1.08]"
                  />
                </button>
              );
            })}
          </div>

          <div className="order-1 flex-1 md:order-2">
            <div className="group relative overflow-hidden rounded-[2rem] border border-[#e5dfec] bg-gradient-to-br from-[#fffdfa] via-[#f5f0fb] to-[#eef6ff] shadow-[0_18px_45px_rgba(140,152,190,0.08)] transition-all duration-500 hover:shadow-[0_24px_60px_rgba(140,152,190,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,195,165,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,139,219,0.10),transparent_36%)]" />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(127,182,234,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(167,139,219,0.035) 1px, transparent 1px)
                  `,
                  backgroundSize: "18px 18px",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(127,182,234,0.10) 0.6px, transparent 0.6px)",
                  backgroundSize: "12px 12px",
                }}
              />

              <div className="relative flex h-[430px] items-center justify-center sm:h-[520px]">
                <Image
                  src={mainSrc}
                  alt={normalized.name}
                  width={900}
                  height={1100}
                  className={`h-full w-full object-contain p-6 transition duration-700 group-hover:scale-[1.035] ${
                    isOutOfStock ? "opacity-75" : ""
                  }`}
                />

                <div className="pointer-events-none absolute inset-x-10 bottom-4 h-10 rounded-full bg-[#a78bdb]/12 blur-2xl" />

                {isOutOfStock && (
                  <span className="absolute left-5 top-5 rounded-full bg-[#7c63b6] px-4 py-2 text-sm font-medium text-white shadow-md">
                    Out of Stock
                  </span>
                )}

                {!isOutOfStock && discountPercent > 0 && (
                  <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-4 py-2 text-sm font-medium text-white shadow-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[2rem] border border-[#e5dfec] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,255,0.96))] p-6 shadow-[0_18px_45px_rgba(140,152,190,0.08)] sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(127,182,234,0.11) 0.7px, transparent 0.7px)",
              backgroundSize: "14px 14px",
            }}
          />

          <div className="relative inline-flex items-center gap-2 rounded-full border border-[#d9cde7]/70 bg-gradient-to-r from-[#f2e8d8]/80 via-[#efe7fb]/80 to-[#e6f2ff]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-[#8b7bd6]" />
            Editorial Select
          </div>

          <h1 className="relative mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-slate-800 sm:text-4xl">
            {normalized.name}
          </h1>

          <div className="relative mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-[#e5dfec] bg-white px-3 py-2 shadow-[0_6px_18px_rgba(140,152,190,0.05)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  size={15}
                  className="text-transparent"
                  fill={roundedRating >= index + 1 ? "#c38b2c" : "#d9d5cf"}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">
                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
            </p>

            <span className="rounded-full border border-[#e5dfec] bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {normalized.category}
            </span>
          </div>

          <div className="relative mt-7 rounded-[1.5rem] border border-[#e5dfec] bg-gradient-to-r from-[#fffdfa] via-[#f5f0fb] to-[#eef6ff] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
            <div className="flex flex-wrap items-end gap-3">
              <p className="font-display text-3xl font-semibold text-slate-800">
                {currency}
                {normalized.price}
              </p>

              {normalized.mrp && normalized.mrp > normalized.price ? (
                <p className="text-lg text-slate-400 line-through">
                  {currency}
                  {normalized.mrp}
                </p>
              ) : null}
            </div>

            {discountPercent > 0 ? (
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#8b7bd6]">
                <TagIcon size={15} />
                Save {discountPercent}% right now
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <TagIcon size={15} />
                Priced for quality, detail, and craft
              </div>
            )}
          </div>

          <div className="relative mt-6">
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f4edff] px-4 py-2 text-sm font-semibold text-[#7b5ab8]">
                <PackageX size={14} />
                Out of Stock
              </div>
            ) : stock <= 5 ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f1e8] px-4 py-2 text-sm font-semibold text-[#a07d57]">
                <ShoppingBag size={14} />
                Only {stock} left in stock
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf5ee] px-4 py-2 text-sm font-semibold text-[#4d8a5b]">
                <PackageCheck size={14} />
                In Stock
              </div>
            )}
          </div>

          {normalized.description ? (
            <p className="relative mt-6 font-body text-[15px] leading-8 text-slate-600">
              {normalized.description}
            </p>
          ) : null}

          <div className="relative mt-10 flex flex-wrap items-end gap-5">
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
              className={`group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                isOutOfStock
                  ? "cursor-not-allowed bg-slate-300 text-white"
                  : "bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] text-white shadow-[0_14px_30px_rgba(167,139,219,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(127,182,234,0.22)]"
              }`}
            >
              <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {isOutOfStock
                ? "Out of Stock"
                : !cart?.[productId]
                ? "Add to Cart"
                : "View Cart"}
            </button>
          </div>

          <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[#d7c4ef] to-transparent" />

          <div className="relative grid gap-4 text-slate-600">
            <div className="rounded-2xl border border-[#e5dfec] bg-white p-4 shadow-[0_10px_22px_rgba(140,152,190,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(140,152,190,0.08)]">
              <div className="flex items-start gap-3">
                <CreditCardIcon className="mt-0.5 h-5 w-5 text-[#8b7bd6]" />
                <div>
                  <p className="font-semibold text-slate-800">100% Secure Payment</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Safe checkout for a smooth and trusted purchase experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5dfec] bg-white p-4 shadow-[0_10px_22px_rgba(140,152,190,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(140,152,190,0.08)]">
              <div className="flex items-start gap-3">
                <Gem className="mt-0.5 h-5 w-5 text-[#d8c3a5]" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Designed to Feel Distinct
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Not mass-made, not ordinary—just a piece with its own presence,
                    texture, and quiet personality.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5dfec] bg-white p-4 shadow-[0_10px_22px_rgba(140,152,190,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(140,152,190,0.08)]">
              <div className="flex items-start gap-3">
                <UserIcon className="mt-0.5 h-5 w-5 text-[#7fb6ea]" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Authentic Handmade Products
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Carefully crafted pieces with a unique artistic touch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


// "use client";

// import { addToCart } from "@/lib/features/cart/cartSlice";
// import {
//   StarIcon,
//   TagIcon,
//   CreditCardIcon,
//   UserIcon,
//   ShoppingBag,
//   Sparkles,
//   PackageCheck,
//   PackageX,
//   Gem,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import Counter from "./Counter";
// import { useDispatch, useSelector } from "react-redux";

// const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
// const FALLBACK_IMG = "/placeholder.png";

// const toPublicImageUrl = (img, fallback = FALLBACK_IMG) => {
//   if (!img) return fallback;

//   if (typeof img === "object" && typeof img.src === "string") return img;
//   if (typeof img !== "string") return fallback;

//   const s = img.trim().replace(/^"+|"+$/g, "");
//   if (!s) return fallback;

//   if (s.startsWith("http://") || s.startsWith("https://")) return s;
//   if (s.startsWith("/uploads/")) return `${API}${s}`;
//   if (s.startsWith("/")) return s;

//   return `${API}/uploads/${s}`;
// };

// const getRatingArray = (product) => {
//   if (Array.isArray(product?.rating)) return product.rating;
//   if (Array.isArray(product?.reviews)) return product.reviews;
//   if (Array.isArray(product?.product_reviews)) return product.product_reviews;
//   return [];
// };

// const getNormalizedAverageRating = (product) => {
//   if (product?.rating_avg !== undefined && product?.rating_avg !== null) {
//     return Number(product.rating_avg) || 0;
//   }

//   if (product?.avg_rating !== undefined && product?.avg_rating !== null) {
//     return Number(product.avg_rating) || 0;
//   }

//   if (
//     product?.average_rating !== undefined &&
//     product?.average_rating !== null
//   ) {
//     return Number(product.average_rating) || 0;
//   }

//   const ratingArray = getRatingArray(product);
//   if (ratingArray.length > 0) {
//     const avg =
//       ratingArray.reduce(
//         (acc, item) => acc + (Number(item?.rating) || 0),
//         0
//       ) / ratingArray.length;

//     return Number(avg) || 0;
//   }

//   return 0;
// };

// const getNormalizedRatingCount = (product) => {
//   if (product?.rating_count !== undefined && product?.rating_count !== null) {
//     return Number(product.rating_count) || 0;
//   }

//   if (product?.review_count !== undefined && product?.review_count !== null) {
//     return Number(product.review_count) || 0;
//   }

//   return getRatingArray(product).length;
// };

// const ProductDetails = ({ product }) => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart.cartItems || {});

//   const normalized = useMemo(() => {
//     if (!product) return null;

//     const ratingArray = getRatingArray(product);
//     const normalizedAvg = getNormalizedAverageRating(product);
//     const normalizedCount = getNormalizedRatingCount(product);

//     return {
//       ...product,
//       id: product.id ?? product.product_id,
//       product_id: product.product_id ?? product.id,
//       name: product.name ?? product.product_name ?? "Untitled Product",
//       product_name: product.product_name ?? product.name ?? "Untitled Product",
//       description: product.description ?? product.product_description ?? "",
//       product_description:
//         product.product_description ?? product.description ?? "",
//       category: product.category ?? product.category_name ?? "Artwork",
//       category_name: product.category_name ?? product.category ?? "Artwork",
//       price: Number(product.price ?? 0),
//       mrp:
//         product.mrp !== undefined && product.mrp !== null
//           ? Number(product.mrp)
//           : null,
//       product_count: Number(product.product_count ?? 0),
//       status: String(product.status ?? "active").toLowerCase(),
//       images: Array.isArray(product.images) ? product.images : [],
//       rating: ratingArray,
//       rating_avg: Number.isNaN(normalizedAvg) ? 0 : normalizedAvg,
//       rating_count: Number.isNaN(normalizedCount) ? 0 : normalizedCount,
//     };
//   }, [product]);

//   const productId = normalized?.id;
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

//   const images = useMemo(() => {
//     const raw = normalized?.images ?? [];
//     if (!Array.isArray(raw)) return raw ? [raw] : [FALLBACK_IMG];

//     const valid = raw.filter((img) => {
//       if (!img) return false;
//       if (typeof img === "string") return img.trim().length > 0;
//       if (typeof img === "object" && typeof img.src === "string") return true;
//       return false;
//     });

//     return valid.length ? valid : [FALLBACK_IMG];
//   }, [normalized]);

//   const [mainImage, setMainImage] = useState(images[0] ?? FALLBACK_IMG);

//   useEffect(() => {
//     setMainImage(images[0] ?? FALLBACK_IMG);
//   }, [images]);

//   const averageRating = Number(normalized?.rating_avg || 0);
//   const reviewCount = Number(normalized?.rating_count || 0);
//   const roundedRating = Math.round(averageRating);

//   const mainSrc = toPublicImageUrl(mainImage, FALLBACK_IMG);

//   const stock = Number(normalized?.product_count ?? 0);
//   const isOutOfStock = stock <= 0 || normalized?.status !== "active";

//   const discountPercent =
//     normalized?.mrp && normalized.mrp > normalized.price
//       ? Math.round(
//           ((normalized.mrp - normalized.price) / normalized.mrp) * 100
//         )
//       : 0;

//   const addToCartHandler = () => {
//     if (!productId || isOutOfStock) return;
//     dispatch(addToCart({ productId }));
//   };

//   if (!normalized) return null;

//   return (
//     <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
//       <div className="relative">
//         <div className="absolute -left-6 top-10 h-36 w-36 rounded-full bg-amber-100/40 blur-3xl" />
//         <div className="absolute -right-4 bottom-12 h-36 w-36 rounded-full bg-stone-200/40 blur-3xl" />

//         <div className="relative z-10 flex flex-col gap-4 md:flex-row">
//           <div className="order-2 flex gap-3 md:order-1 md:flex-col">
//             {images.map((image, index) => {
//               const thumbSrc = toPublicImageUrl(image, FALLBACK_IMG);
//               const isSelected = thumbSrc === mainSrc;

//               return (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => setMainImage(image)}
//                   className={`group relative h-24 w-24 overflow-hidden rounded-[22px] border bg-white transition-all duration-300 ${
//                     isSelected
//                       ? "border-[#d9c4a3] ring-2 ring-[#efe2cf] shadow-[0_10px_24px_rgba(90,66,38,0.10)]"
//                       : "border-[#ece7de] hover:-translate-y-0.5 hover:border-[#d8cfbf] hover:shadow-[0_10px_24px_rgba(90,66,38,0.08)]"
//                   }`}
//                 >
//                   <Image
//                     src={thumbSrc}
//                     alt={`Thumbnail ${index + 1}`}
//                     fill
//                     className="object-cover p-1.5 transition-transform duration-500 group-hover:scale-[1.08]"
//                   />
//                 </button>
//               );
//             })}
//           </div>

//           <div className="order-1 flex-1 md:order-2">
//             <div className="group relative overflow-hidden rounded-[2rem] border border-[#ede7dc] bg-gradient-to-br from-[#fffdf9] via-[#fbf7f0] to-[#f5efe6] shadow-[0_18px_45px_rgba(60,41,18,0.07)] transition-all duration-500 hover:shadow-[0_24px_60px_rgba(60,41,18,0.10)]">
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,165,121,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(120,98,76,0.08),transparent_36%)]" />

//               <div
//                 className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none"
//                 style={{
//                   backgroundImage: `
//                     linear-gradient(rgba(120,98,76,0.04) 1px, transparent 1px),
//                     linear-gradient(90deg, rgba(120,98,76,0.035) 1px, transparent 1px)
//                   `,
//                   backgroundSize: "18px 18px",
//                 }}
//               />

//               <div
//                 className="absolute inset-0 opacity-[0.08] pointer-events-none"
//                 style={{
//                   backgroundImage:
//                     "radial-gradient(rgba(88,68,48,0.10) 0.6px, transparent 0.6px)",
//                   backgroundSize: "12px 12px",
//                 }}
//               />

//               <div className="relative flex h-[430px] items-center justify-center sm:h-[520px]">
//                 <Image
//                   src={mainSrc}
//                   alt={normalized.name}
//                   width={900}
//                   height={1100}
//                   className={`h-full w-full object-contain p-6 transition duration-700 group-hover:scale-[1.035] ${
//                     isOutOfStock ? "opacity-75" : ""
//                   }`}
//                 />

//                 <div className="pointer-events-none absolute inset-x-10 bottom-4 h-10 rounded-full bg-[#8b6b47]/10 blur-2xl" />

//                 {isOutOfStock && (
//                   <span className="absolute left-5 top-5 rounded-full bg-[#2f2419] px-4 py-2 text-sm font-medium text-white shadow-md">
//                     Out of Stock
//                   </span>
//                 )}

//                 {!isOutOfStock && discountPercent > 0 && (
//                   <span className="absolute left-5 top-5 rounded-full bg-[#a67c52] px-4 py-2 text-sm font-medium text-white shadow-md">
//                     Save {discountPercent}%
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative">
//         <div className="overflow-hidden rounded-[2rem] border border-[#ede7dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-6 shadow-[0_18px_45px_rgba(60,41,18,0.06)] sm:p-8">
//           <div
//             className="absolute inset-0 opacity-[0.05] pointer-events-none"
//             style={{
//               backgroundImage:
//                 "radial-gradient(rgba(88,68,48,0.11) 0.7px, transparent 0.7px)",
//               backgroundSize: "14px 14px",
//             }}
//           />

//           <div className="relative inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[#faf5ed] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f5a45]">
//             <Sparkles className="h-3.5 w-3.5 text-[#b08968]" />
//             Editorial Select
//           </div>

//           <h1 className="relative mt-4 text-3xl font-medium leading-tight tracking-tight text-[#2d241c] sm:text-4xl font-display">
//             {normalized.name}
//           </h1>

//           <div className="relative mt-4 flex flex-wrap items-center gap-3">
//             <div className="inline-flex items-center gap-1 rounded-full border border-[#eee6da] bg-white px-3 py-2 shadow-[0_6px_18px_rgba(60,41,18,0.04)]">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <StarIcon
//                   key={index}
//                   size={15}
//                   className="text-transparent"
//                   fill={roundedRating >= index + 1 ? "#c38b2c" : "#d9d5cf"}
//                 />
//               ))}
//               <span className="ml-2 text-sm font-semibold text-[#4a3b2e]">
//                 {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
//               </span>
//             </div>

//             <p className="text-sm text-[#7a6b5d]">
//               {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
//             </p>

//             <span className="rounded-full border border-[#eee6da] bg-[#fffdfa] px-3 py-1 text-xs font-medium text-[#6e5d4e]">
//               {normalized.category}
//             </span>
//           </div>

//           <div className="relative mt-7 rounded-[1.5rem] border border-[#efe7db] bg-gradient-to-r from-[#fffdfa] via-[#faf6ef] to-[#f7f1e8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
//             <div className="flex flex-wrap items-end gap-3">
//               <p className="text-3xl font-semibold text-[#2d241c] font-display">
//                 {currency}
//                 {normalized.price}
//               </p>

//               {normalized.mrp && normalized.mrp > normalized.price ? (
//                 <p className="text-lg text-[#b4a89a] line-through">
//                   {currency}
//                   {normalized.mrp}
//                 </p>
//               ) : null}
//             </div>

//             {discountPercent > 0 ? (
//               <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#a26b3d]">
//                 <TagIcon size={15} />
//                 Save {discountPercent}% right now
//               </div>
//             ) : (
//               <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#7c6a59]">
//                 <TagIcon size={15} />
//                 Priced for quality, detail, and craft
//               </div>
//             )}
//           </div>

//           <div className="relative mt-6">
//             {isOutOfStock ? (
//               <div className="inline-flex items-center gap-2 rounded-full bg-[#f7e8e6] px-4 py-2 text-sm font-semibold text-[#b5524f]">
//                 <PackageX size={14} />
//                 Out of Stock
//               </div>
//             ) : stock <= 5 ? (
//               <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf0df] px-4 py-2 text-sm font-semibold text-[#b37a1f]">
//                 <ShoppingBag size={14} />
//                 Only {stock} left in stock
//               </div>
//             ) : (
//               <div className="inline-flex items-center gap-2 rounded-full bg-[#edf5ee] px-4 py-2 text-sm font-semibold text-[#4d8a5b]">
//                 <PackageCheck size={14} />
//                 In Stock
//               </div>
//             )}
//           </div>

//           {normalized.description ? (
//             <p className="relative mt-6 text-[15px] leading-8 text-[#5f5145] font-body">
//               {normalized.description}
//             </p>
//           ) : null}

//           <div className="relative mt-10 flex flex-wrap items-end gap-5">
//             {!isOutOfStock && productId && cart?.[productId] ? (
//               <div className="flex flex-col gap-3">
//                 <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8a7a6b]">
//                   Quantity
//                 </p>
//                 <Counter productId={productId} maxQty={stock} />
//               </div>
//             ) : null}

//             <button
//               onClick={() => {
//                 if (isOutOfStock) return;
//                 !cart?.[productId] ? addToCartHandler() : router.push("/cart");
//               }}
//               disabled={isOutOfStock}
//               className={`group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
//                 isOutOfStock
//                   ? "cursor-not-allowed bg-slate-300 text-white"
//                   : "bg-[#2f2419] text-white shadow-[0_14px_30px_rgba(47,36,25,0.16)] hover:-translate-y-0.5 hover:bg-[#3a2d21] hover:shadow-[0_18px_36px_rgba(47,36,25,0.22)]"
//               }`}
//             >
//               <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
//               {isOutOfStock
//                 ? "Out of Stock"
//                 : !cart?.[productId]
//                 ? "Add to Cart"
//                 : "View Cart"}
//             </button>
//           </div>

//           <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[#e6ddd0] to-transparent" />

//           <div className="relative grid gap-4 text-[#5f5145]">
//             <div className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-4 shadow-[0_10px_22px_rgba(60,41,18,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(60,41,18,0.07)]">
//               <div className="flex items-start gap-3">
//                 <CreditCardIcon className="mt-0.5 h-5 w-5 text-[#b08968]" />
//                 <div>
//                   <p className="font-semibold text-[#2d241c]">100% Secure Payment</p>
//                   <p className="mt-1 text-sm text-[#7b6c5f]">
//                     Safe checkout for a smooth and trusted purchase experience.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-4 shadow-[0_10px_22px_rgba(60,41,18,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(60,41,18,0.07)]">
//               <div className="flex items-start gap-3">
//                 <Gem className="mt-0.5 h-5 w-5 text-[#9a7b5f]" />
//                 <div>
//                   <p className="font-semibold text-[#2d241c]">
//                     Designed to Feel Distinct
//                   </p>
//                   <p className="mt-1 text-sm text-[#7b6c5f]">
//                     Not mass-made, not ordinary—just a piece with its own presence,
//                     texture, and quiet personality.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-4 shadow-[0_10px_22px_rgba(60,41,18,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(60,41,18,0.07)]">
//               <div className="flex items-start gap-3">
//                 <UserIcon className="mt-0.5 h-5 w-5 text-[#c08b5c]" />
//                 <div>
//                   <p className="font-semibold text-[#2d241c]">
//                     Authentic Handmade Products
//                   </p>
//                   <p className="mt-1 text-sm text-[#7b6c5f]">
//                     Carefully crafted pieces with a unique artistic touch.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;