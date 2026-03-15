'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
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

  const s = img.trim();
  if (!s) return fallback;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/uploads/")) return `${API}${s}`;
  if (s.startsWith("/")) return s;

  return `${API}/uploads/${s}`;
};

const ProductDetails = ({ product }) => {
  const productId = product?.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  const images = useMemo(() => {
    const raw = product?.images ?? [];
    return raw.filter((img) => {
      if (!img) return false;
      if (typeof img === "string") return img.trim().length > 0;
      if (typeof img === "object" && typeof img.src === "string") return true;
      return false;
    });
  }, [product]);

  const [mainImage, setMainImage] = useState(images[0] ?? FALLBACK_IMG);

  useEffect(() => {
    setMainImage(images[0] ?? FALLBACK_IMG);
  }, [images]);

  const ratingArr = Array.isArray(product?.rating) ? product.rating : [];
  const averageRating =
    ratingArr.length > 0
      ? ratingArr.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0) / ratingArr.length
      : 0;

  const mainSrc = toPublicImageUrl(mainImage, FALLBACK_IMG);

  const stock = Number(product?.product_count ?? 0);
  const isOutOfStock = stock <= 0 || product?.status === "inactive";

  const addToCartHandler = () => {
    if (!productId || isOutOfStock) return;
    dispatch(addToCart({ productId }));
  };

  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {images.map((image, index) => {
            const thumbSrc = toPublicImageUrl(image, FALLBACK_IMG);
            const isSelected = thumbSrc === mainSrc;

            return (
              <div
                key={index}
                onClick={() => setMainImage(image)}
                className={`relative bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer overflow-hidden border ${
                  isSelected ? "border-slate-400" : "border-transparent"
                }`}
              >
                <Image
                  src={thumbSrc}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-2 group-hover:scale-105 group-active:scale-95 transition"
                />
              </div>
            );
          })}
        </div>

        <div className="relative flex justify-center items-center bg-gray-100 rounded-lg w-full max-w-md h-96 overflow-hidden">
          <Image
            src={mainSrc}
            alt={product?.name ?? "Product"}
            width={800}
            height={1200}
            className={`object-contain w-full h-full ${isOutOfStock ? "opacity-70" : ""}`}
          />

          {isOutOfStock && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-sm px-4 py-1.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">{product?.name}</h1>

        <div className="flex items-center mt-2">
          {Array(5).fill("").map((_, index) => (
            <StarIcon
              key={index}
              size={14}
              className="text-transparent mt-0.5"
              fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
            />
          ))}
          <p className="text-sm ml-3 text-slate-500">{ratingArr.length} Reviews</p>
        </div>

        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>{currency}{product?.price}</p>
          <p className="text-xl text-slate-500 line-through">{currency}{product?.mrp}</p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>
            Save {product?.mrp ? (((product.mrp - product.price) / product.mrp) * 100).toFixed(0) : 0}% right now
          </p>
        </div>

        <div className="mt-4">
          {isOutOfStock ? (
            <p className="text-red-600 font-medium">Out of Stock</p>
          ) : stock <= 5 ? (
            <p className="text-orange-500 font-medium">Only {stock} left in stock</p>
          ) : (
            <p className="text-green-600 font-medium">In Stock</p>
          )}
        </div>

        <div className="flex items-end gap-5 mt-10">
          {!isOutOfStock && productId && cart?.[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">Quantity</p>
              <Counter productId={productId} maxQty={product.product_count} />
            </div>
          )}

          <button
            onClick={() => {
              if (isOutOfStock) return;
              !cart?.[productId] ? addToCartHandler() : router.push("/cart");
            }}
            disabled={isOutOfStock}
            className={`px-10 py-3 text-sm font-medium rounded transition ${
              isOutOfStock
                ? "bg-slate-300 text-white cursor-not-allowed"
                : "bg-slate-800 text-white hover:bg-slate-900 active:scale-95"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : !cart?.[productId]
              ? "Add to Cart"
              : "View Cart"}
          </button>
        </div>

        <hr className="border-gray-300 my-5" />

        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3"><CreditCardIcon className="text-slate-400" /> 100% Secured Payment</p>
          <p className="flex gap-3"><EarthIcon className="text-slate-400" /> Free shipping for orders above 999Tk</p>
          <p className="flex gap-3"><UserIcon className="text-slate-400" /> Authentic Handmade Products</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;