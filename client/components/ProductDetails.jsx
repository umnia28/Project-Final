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

const ProductDetails = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems || {});

  const normalized = useMemo(() => {
    if (!product) return null;

    const finalPrice = Number(product.price ?? 0);
    const basePrice = Number(product.base_price ?? product.mrp ?? finalPrice);
    const discountPercent = Number(
      product.discount_percent ?? product.discount ?? 0
    );

    return {
      ...product,
      id: Number(product.id ?? product.product_id),
      name: product.name ?? product.product_name ?? "Untitled Product",
      description: product.description ?? product.product_description ?? "",
      category: product.category ?? product.category_name ?? "Artwork",

      price: finalPrice,
      base_price: basePrice,
      discount_percent: discountPercent,

      product_count: Number(product.product_count ?? 0),
      status: String(product.status ?? "active").toLowerCase(),
      images: Array.isArray(product.images) ? product.images : [],
      rating_avg: Number(product.rating_avg ?? 0),
      rating_count: Number(product.rating_count ?? 0),
    };
  }, [product]);

  const productId = normalized?.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const images = useMemo(() => {
    const raw = normalized?.images ?? [];
    return raw.length ? raw : [FALLBACK_IMG];
  }, [normalized]);

  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    setMainImage(images[0]);
  }, [images]);

  const stock = Number(normalized?.product_count ?? 0);
  const isOutOfStock = stock <= 0 || normalized?.status !== "active";

  const isInCart = Boolean(cart?.[productId]);

  const addToCartHandler = () => {
    if (!productId || isOutOfStock) return;
    dispatch(addToCart({ productId }));
  };

  if (!normalized) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">

      {/* LEFT IMAGE */}
      <div>
        <Image
          src={toPublicImageUrl(mainImage)}
          alt={normalized.name}
          width={500}
          height={500}
        />
      </div>

      {/* RIGHT DETAILS */}
      <div>

        <h1 className="text-3xl font-semibold">{normalized.name}</h1>

        <p className="mt-2 text-lg">
          {currency} {normalized.price}
        </p>

        {normalized.discount_percent > 0 && (
          <p className="text-sm text-green-600">
            {normalized.discount_percent}% OFF
          </p>
        )}

        <div className="mt-4">
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <span>In Stock ({stock})</span>
          )}
        </div>

        <p className="mt-4">{normalized.description}</p>

        <div className="mt-6 flex gap-4">
          {!isOutOfStock && isInCart && (
            <Counter productId={productId} maxQty={stock} />
          )}

          <button
            onClick={() => {
              if (isOutOfStock) return;
              !isInCart ? addToCartHandler() : router.push("/cart");
            }}
          >
            {isOutOfStock
              ? "Out of Stock"
              : !isInCart
              ? "Add to Cart"
              : "View Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;