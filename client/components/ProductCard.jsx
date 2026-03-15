'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '৳';

  const ratingsArr = Array.isArray(product?.rating) ? product.rating : [];
  const avg =
    ratingsArr.length > 0
      ? ratingsArr.reduce((acc, curr) => acc + Number(curr?.rating || 0), 0) / ratingsArr.length
      : 0;
  const rating = Math.round(avg);

  const firstImg =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : null;

  const imgSrc = toPublicImageUrl(firstImg);

  const hasStockField = product?.product_count !== undefined && product?.product_count !== null;
  const stock = hasStockField ? Number(product.product_count) : null;
  const status = String(product?.status || "").toLowerCase();

  const isOutOfStock =
    status === "inactive" || (hasStockField && !Number.isNaN(stock) && stock <= 0);

  return (
    <Link href={`/product/${product.id}`} className='group max-xl:mx-auto'>
      <div
        className={`relative bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden w-60 h-60 group ${
          isOutOfStock ? "opacity-70" : ""
        }`}
      >
        <Image
          src={imgSrc}
          alt={product?.name || "Product"}
          width={800}
          height={800}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
        />

        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
        <div>
          <p>{product?.name}</p>

          <div className='flex'>
            {Array(5).fill('').map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className='text-transparent mt-0.5'
                fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"}
              />
            ))}
          </div>

          <p className={`text-xs mt-1 ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
            {isOutOfStock
              ? "Unavailable"
              : hasStockField && !Number.isNaN(stock)
              ? `In Stock: ${stock}`
              : "Available"}
          </p>
        </div>

        <p>{currency}{product?.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;