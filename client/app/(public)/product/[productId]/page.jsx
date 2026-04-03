"use client";

import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function Product() {
  const { productId } = useParams();
  const products = useSelector((state) => state.product.list || []);
  const [freshProduct, setFreshProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeProduct = (p) => {
    const discountPercent = Number(p.discount_percent ?? p.discount ?? 0);
    const finalPrice = Number(p.price ?? 0);

    const basePrice =
      p.base_price ??
      p.mrp ??
      (discountPercent > 0
        ? Math.round(finalPrice / (1 - discountPercent / 100))
        : finalPrice);

    const discountAmount =
      p.discount_amount !== undefined && p.discount_amount !== null
        ? Number(p.discount_amount)
        : Math.round((basePrice * discountPercent) / 100);

    return {
      ...p,
      id: Number(p.id ?? p.product_id),
      product_id: Number(p.product_id ?? p.id),

      name: p.name ?? p.product_name ?? "Untitled Product",
      product_name: p.product_name ?? p.name ?? "Untitled Product",

      description: p.description ?? p.product_description ?? "",
      product_description: p.product_description ?? p.description ?? "",

      category: p.category ?? p.category_name ?? "Artwork",
      category_name: p.category_name ?? p.category ?? "Artwork",

      price: finalPrice,
      final_price: finalPrice,
      base_price: basePrice,
      mrp: basePrice,
      discount: discountPercent,
      discount_percent: discountPercent,
      discount_amount: discountAmount,

      product_count: Number(p.product_count ?? 0),
      status: String(p.status ?? "active").toLowerCase(),

      images: Array.isArray(p.images) ? p.images : [],

      rating: Array.isArray(p.rating)
        ? p.rating
        : Array.isArray(p.reviews)
        ? p.reviews
        : [],

      rating_avg:
        p.rating_avg !== undefined && p.rating_avg !== null
          ? Number(p.rating_avg)
          : p.avg_rating !== undefined && p.avg_rating !== null
          ? Number(p.avg_rating)
          : 0,

      rating_count:
        p.rating_count !== undefined && p.rating_count !== null
          ? Number(p.rating_count)
          : p.review_count !== undefined && p.review_count !== null
          ? Number(p.review_count)
          : Array.isArray(p.rating)
          ? p.rating.length
          : Array.isArray(p.reviews)
          ? p.reviews.length
          : 0,
    };
  };

  const reduxProduct = useMemo(() => {
    const found = products.find(
      (item) => String(item?.id ?? item?.product_id) === String(productId)
    );

    if (!found) return null;
    return normalizeProduct(found);
  }, [products, productId]);

  const fetchFreshProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/products/${productId}`);
      const p = res.data.product || res.data;

      setFreshProduct(normalizeProduct(p));
    } catch (err) {
      console.error(
        "Single product fetch error:",
        err.response?.data || err.message
      );
      setFreshProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (productId) fetchFreshProduct();
  }, [productId]);

  const product = freshProduct || reduxProduct;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mx-6 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <h2 className="text-2xl font-semibold">Loading product...</h2>
            </div>
          ) : product ? (
            <div>
              <ProductDetails product={product} />
              <ProductDescription
                product={product}
                onReviewAdded={fetchFreshProduct}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-32">
              <h2 className="text-2xl font-semibold">Product not found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}