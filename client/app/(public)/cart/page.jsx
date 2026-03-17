"use client";

import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart, clearCart } from "@/lib/features/cart/cartSlice";
import {
  Trash2Icon,
  ShoppingBag,
  PackageX,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";
  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);
  const dispatch = useDispatch();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "/placeholder.png";

    const clean = url.trim().replace(/^"+|"+$/g, "");
    if (!clean) return "/placeholder.png";

    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    if (clean.startsWith("/uploads/")) {
      return `http://localhost:5000${clean}`;
    }

    if (clean.startsWith("/")) {
      return clean;
    }

    return `http://localhost:5000/uploads/${clean}`;
  };

  const getImageFromProduct = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const first = product.images[0];

      if (typeof first === "string") {
        return normalizeImageUrl(first);
      }

      if (first && typeof first === "object") {
        return normalizeImageUrl(
          first.image_url || first.url || first.image || first.src || first.path
        );
      }
    }

    if (typeof product?.images === "string" && product.images.trim() !== "") {
      const raw = product.images.trim();

      if (raw.startsWith("{") && raw.endsWith("}")) {
        const parsedItems = raw
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^"+|"+$/g, ""))
          .filter(Boolean);

        if (parsedItems.length > 0) {
          return normalizeImageUrl(parsedItems[0]);
        }
      }

      return normalizeImageUrl(raw);
    }

    return normalizeImageUrl(
      product?.image_url ||
        product?.image ||
        product?.product_image ||
        product?.thumbnail ||
        product?.poster ||
        product?.cover_url
    );
  };

  const createCartArray = () => {
    let total = 0;
    const newCartArray = [];

    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find(
        (product) => String(product.id) === String(key)
      );

      if (product) {
        newCartArray.push({ ...product, quantity: value });
        total += Number(product.price) * Number(value);
      }
    }

    setCartArray(newCartArray);
    setTotalPrice(total);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  const hasInvalidItems = useMemo(() => {
    return cartArray.some((item) => {
      const stock = Number(item.product_count ?? 0);
      const isInactive = String(item.status || "").toLowerCase() === "inactive";
      const isOutOfStock = stock <= 0 || isInactive;
      const exceedsStock = Number(item.quantity) > stock;

      return isOutOfStock || exceedsStock;
    });
  }, [cartArray]);

  const onCheckout = async ({ address_id, payment_method, promo_id }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        throw new Error("Please login first");
      }

      if (cartArray.length === 0) {
        throw new Error("Cart is empty");
      }

      if (hasInvalidItems) {
        throw new Error(
          "Please fix out-of-stock or over-quantity items before checkout"
        );
      }

      const items = Object.entries(cartItems).map(([productId, qty]) => ({
        product_id: Number(productId),
        quantity: Number(qty),
      }));

      const payload = {
        items,
        address_id,
        payment_method,
        promo_id,
      };

      console.log("Sending checkout payload:", payload);

      const res = await fetch("http://localhost:5000/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Checkout response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      dispatch(clearCart());
      alert(`Order placed successfully! Order ID: ${data.order_id}`);
      router.push(`/orders/${data.order_id}`);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (products.length > 0) createCartArray();
    else {
      setCartArray([]);
      setTotalPrice(0);
    }
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className="min-h-screen px-4 py-8 text-[#2d241c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PageTitle
          heading="My Cart"
          text="items in your cart"
          linkText="Add more"
        />

        <div className="mt-6 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#ede7dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] shadow-[0_18px_45px_rgba(60,41,18,0.06)]">
            <div
              className="pointer-events-none absolute opacity-0"
              aria-hidden="true"
            />

            <div className="border-b border-[#ece2d4] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-[#eadfce] bg-[#faf5ed] p-2.5">
                  <ShoppingBag className="h-4 w-4 text-[#9a7b5f]" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-medium tracking-tight text-[#2d241c]">
                    Cart Items
                  </h2>
                  <p className="text-sm text-[#7b6c5f]">
                    Review your selected pieces before checkout
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#efe7db]">
              {cartArray.map((item) => {
                const stock = Number(item.product_count ?? 0);
                const isInactive =
                  String(item.status || "").toLowerCase() === "inactive";
                const isOutOfStock = stock <= 0 || isInactive;
                const exceedsStock = Number(item.quantity) > stock;
                const itemImage = getImageFromProduct(item);

                return (
                  <div
                    key={item.id}
                    className="group px-5 py-5 transition-colors duration-300 hover:bg-[#fffdfa] sm:px-7"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-[#ece7de] bg-gradient-to-br from-[#fffdfa] via-[#fbf7f0] to-[#f4ede3] shadow-[0_10px_24px_rgba(90,66,38,0.06)]">
                          <Image
                            src={itemImage}
                            className="h-[78%] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                            alt={item.name || "Product"}
                            width={90}
                            height={90}
                            unoptimized={
                              typeof itemImage === "string" &&
                              itemImage.startsWith("http")
                            }
                          />
                          <div className="pointer-events-none absolute bottom-2 left-1/2 h-5 w-[62%] -translate-x-1/2 rounded-full bg-[#8b6b47]/10 blur-xl" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-medium leading-tight text-[#2d241c]">
                            {item.name}
                          </h3>

                          {item.category ? (
                            <p className="mt-1 text-sm text-[#8a7a6b]">
                              {item.category}
                            </p>
                          ) : null}

                          <p className="mt-2 text-lg font-semibold text-[#2d241c]">
                            {currency}
                            {Number(item.price).toLocaleString()}
                          </p>

                          <div className="mt-3">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-[#f7e8e6] px-3 py-1.5 text-xs font-semibold text-[#b5524f]">
                                <PackageX size={13} />
                                Out of stock
                              </span>
                            ) : exceedsStock ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-3 py-1.5 text-xs font-semibold text-[#b97b1f]">
                                <AlertTriangle size={13} />
                                Only {stock} item(s) available
                              </span>
                            ) : stock <= 5 ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-[#fbf0df] px-3 py-1.5 text-xs font-semibold text-[#b37a1f]">
                                <ShoppingBag size={13} />
                                Only {stock} left
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf5ee] px-3 py-1.5 text-xs font-semibold text-[#4d8a5b]">
                                <ShoppingBag size={13} />
                                In stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center lg:w-[360px]">
                        <div className="sm:justify-self-center">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a6b]">
                            Quantity
                          </p>
                          <Counter
                            productId={item.id}
                            maxQty={item.product_count}
                          />
                        </div>

                        <div className="sm:justify-self-center">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a6b]">
                            Total
                          </p>
                          <p className="text-lg font-semibold text-[#2d241c]">
                            {currency}
                            {(
                              Number(item.price) * Number(item.quantity)
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="sm:justify-self-end">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-transparent">
                            Remove
                          </p>
                          <button
                            onClick={() => handleDeleteItemFromCart(item.id)}
                            className="inline-flex items-center justify-center rounded-full border border-[#eed9d2] bg-[#fff8f7] p-3 text-[#c0645b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fff1ef] hover:shadow-[0_10px_20px_rgba(192,100,91,0.12)] active:scale-95"
                          >
                            <Trash2Icon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full">
            {hasInvalidItems && (
              <div className="mb-5 rounded-[1.5rem] border border-[#f0d9d3] bg-[linear-gradient(180deg,#fff8f7,#fff2f0)] p-4 shadow-[0_10px_24px_rgba(180,82,79,0.05)]">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#fff1ef] p-2">
                    <AlertTriangle className="h-4 w-4 text-[#b5524f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#9f4744]">
                      Some items need attention
                    </p>
                    <p className="mt-1 text-sm text-[#b26a66]">
                      Please fix out-of-stock or over-quantity items before
                      checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-[#ede7dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] p-1 shadow-[0_18px_45px_rgba(60,41,18,0.06)]">
              <OrderSummary
                totalPrice={totalPrice}
                items={cartArray}
                onCheckout={onCheckout}
                disabled={hasInvalidItems}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#ede7dc] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(250,246,239,0.96))] px-8 py-14 text-center shadow-[0_18px_45px_rgba(60,41,18,0.06)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf5ed]">
          <ShoppingBag className="h-7 w-7 text-[#9a7b5f]" />
        </div>

        <h1 className="mt-5 font-display text-3xl font-medium tracking-tight text-[#2d241c] sm:text-4xl">
          Your cart is empty
        </h1>

        <p className="mt-3 text-[#7b6c5f]">
          Add a few beautiful pieces and they’ll appear here.
        </p>

        <button
          onClick={() => router.push("/products")}
          className="mt-8 inline-flex items-center rounded-full bg-[#2f2419] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(47,36,25,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3a2d21]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}