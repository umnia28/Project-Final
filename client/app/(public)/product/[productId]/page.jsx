'use client'

import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

export default function Product() {
  const { productId } = useParams();
  const products = useSelector((state) => state.product.list || []);

  const product = useMemo(() => {
    const found = products.find(
      (item) => String(item?.id ?? item?.product_id) === String(productId)
    );

    if (!found) return null;

    return {
      ...found,
      id: Number(found.id ?? found.product_id),
      product_id: Number(found.product_id ?? found.id),

      name: found.name ?? found.product_name ?? "Untitled Product",
      product_name: found.product_name ?? found.name ?? "Untitled Product",

      description: found.description ?? found.product_description ?? "",
      product_description: found.product_description ?? found.description ?? "",

      category: found.category ?? found.category_name ?? "Artwork",
      category_name: found.category_name ?? found.category ?? "Artwork",

      price: Number(found.price ?? 0),
      discount: Number(found.discount ?? 0),
      mrp:
        found.mrp !== undefined && found.mrp !== null
          ? Number(found.mrp)
          : Number(found.price ?? 0) + Number(found.discount ?? 0),

      product_count: Number(found.product_count ?? 0),
      status: String(found.status ?? "active").toLowerCase(),

      images: Array.isArray(found.images) ? found.images : [],
      rating: Array.isArray(found.rating) ? found.rating : [],
    };
  }, [products, productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100" />
      <div className="absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-30 blur-3xl" />
      <div className="absolute top-60 -right-32 -z-10 h-96 w-96 rounded-full bg-purple-300 opacity-30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-96 w-96 rounded-full bg-orange-300 opacity-30 blur-3xl" />

      <div className="mx-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-sm tracking-wide text-gray-500">
            <span className="font-medium text-pink-500">Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-purple-500">Products</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-700">
              {product?.category || "Product"}
            </span>
          </div>

          {product ? (
            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-md md:p-10">
              <ProductDetails product={product} />
              <div className="my-12 border-t border-pink-100" />
              <ProductDescription product={product} />
            </div>
          ) : (
            <div className="flex items-center justify-center py-32">
              <div className="rounded-3xl border border-white/40 bg-white/80 px-12 py-16 text-center shadow-xl backdrop-blur-md">
                <h2 className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-3xl font-semibold text-transparent">
                  Product not found
                </h2>
                <p className="mt-4 max-w-md text-gray-500">
                  The artwork you're looking for may have been removed or does not
                  exist in our collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}