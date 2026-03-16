/*'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums 
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details 
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews 
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
*/
'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const products = useSelector((state) => state.product.list);

    const product = products.find(
        (item) => String(item.id || item.product_id) === String(productId)
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [productId]);

    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br 
                from-pink-100 via-purple-100 to-orange-100 -z-20" />

            {/* Decorative Gradient Orbs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute top-60 -right-32 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-30 -z-10"></div>

            <div className="mx-6 py-10">
                <div className="max-w-7xl mx-auto">

                    {/* Breadcrumb */}
                    <div className="text-sm mb-6 text-gray-500 tracking-wide">
                        <span className="font-medium text-pink-500">Home</span>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-purple-500">Products</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700 font-semibold">
                            {product?.category || "Product"}
                        </span>
                    </div>

                    {/* Product Card */}
                    {product ? (
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6 md:p-10">

                            {/* Product Details */}
                            <ProductDetails product={product} />

                            {/* Divider */}
                            <div className="my-12 border-t border-pink-100"></div>

                            {/* Description + Reviews */}
                            <ProductDescription product={product} />

                        </div>
                    ) : (

                        /* Not Found State */
                        <div className="flex items-center justify-center py-32">
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl px-12 py-16 text-center border border-white/40">

                                <h2 className="text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                                    Product not found
                                </h2>

                                <p className="text-gray-500 mt-4 max-w-md">
                                    The artwork you're looking for may have been removed
                                    or does not exist in our collection.
                                </p>

                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}