'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart, clearCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || ' ৳ ';
  const { cartItems } = useSelector(state => state.cart);
  const products = useSelector(state => state.product.list);
  const dispatch = useDispatch();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "/placeholder.png";

    const clean = url.trim().replace(/^"+|"+$/g, "");

    if (!clean) return "/placeholder.png";

    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    if (clean.startsWith("/")) {
      return `http://localhost:5000${clean}`;
    }

    return `http://localhost:5000/${clean}`;
  };

  const getImageFromProduct = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
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

    if (typeof product.images === "string" && product.images.trim() !== "") {
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
      product.image_url ||
        product.image ||
        product.product_image ||
        product.thumbnail ||
        product.poster ||
        product.cover_url
    );
  };

  const createCartArray = () => {
    let total = 0;
    const newCartArray = [];
    const savedDetails = JSON.parse(localStorage.getItem("cartProductDetails") || "{}");

    for (const [key, value] of Object.entries(cartItems)) {
      const reduxProduct = products.find(
        (product) => String(product.id || product.product_id) === String(key)
      );

      let normalizedProduct = null;

      if (reduxProduct) {
        normalizedProduct = {
          id: reduxProduct.id || reduxProduct.product_id,
          name: reduxProduct.name || reduxProduct.product_name,
          price: Number(reduxProduct.price || 0),
          category:
            reduxProduct.category || reduxProduct.category_name || reduxProduct.category_title || "",
          images: [getImageFromProduct(reduxProduct)],
          quantity: Number(value),
        };
      } else if (savedDetails[key]) {
        normalizedProduct = {
          ...savedDetails[key],
          quantity: Number(value),
        };
      }

      if (normalizedProduct) {
        newCartArray.push(normalizedProduct);
        total += normalizedProduct.price * normalizedProduct.quantity;
      }
    }

    setCartArray(newCartArray);
    setTotalPrice(total);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));

    const savedDetails = JSON.parse(localStorage.getItem("cartProductDetails") || "{}");
    delete savedDetails[productId];
    localStorage.setItem("cartProductDetails", JSON.stringify(savedDetails));
  };

  const onCheckout = async ({ address_id, payment_method, promo_id }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        throw new Error("Please login first");
      }

      const items = Object.entries(cartItems).map(([productId, qty]) => ({
        product_id: Number(productId),
        quantity: Number(qty),
      }));

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      const res = await fetch("http://localhost:5000/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          address_id,
          payment_method,
          promo_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Checkout failed");
      }

      dispatch(clearCart());
      localStorage.removeItem("cartProductDetails");

      alert(`Order placed successfully! Order ID: ${data.order_id}`);
      router.push(`/orders/${data.order_id}`);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      throw err;
    }
  };

  useEffect(() => {
    createCartArray();
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm">
                <th className="text-left">Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th className="max-md:hidden">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartArray.map((item) => (
                <tr key={item.id} className="space-x-2">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md overflow-hidden">
                      <Image
                        src={item.images?.[0] || "/placeholder.png"}
                        className="h-14 w-auto"
                        alt={item.name || "Product"}
                        width={45}
                        height={45}
                      />
                    </div>
                    <div>
                      <p className="max-sm:text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                      <p>{currency}{item.price}</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <Counter productId={item.id} />
                  </td>
                  <td className="text-center">
                    {currency}{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleDeleteItemFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <OrderSummary totalPrice={totalPrice} items={cartArray} onCheckout={onCheckout} />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
    </div>
  );
}


/*'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart, clearCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || ' ৳ ';
  const { cartItems } = useSelector(state => state.cart);
  const products = useSelector(state => state.product.list);
  const dispatch = useDispatch();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const createCartArray = () => {
    let total = 0;
    const newCartArray = [];

    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find(product => String(product.id) === String(key));
      if (product) {
        newCartArray.push({ ...product, quantity: value });
        total += product.price * value;
      }
    }

    setCartArray(newCartArray);
    setTotalPrice(total);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  // ✅ simplified checkout: only create order first
  const onCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        throw new Error("Please login first");
      }

      const items = Object.entries(cartItems).map(([productId, qty]) => ({
        product_id: Number(productId),
        quantity: Number(qty),
      }));

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      console.log("Sending checkout items:", items);

      const res = await fetch("http://localhost:5000/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
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
      alert(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (products.length > 0) createCartArray();
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto ">
        <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm">
                <th className="text-left">Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th className="max-md:hidden">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartArray.map((item) => (
                <tr key={item.id} className="space-x-2">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                      <Image
                        src={item.images?.[0] || "/placeholder.png"}
                        className="h-14 w-auto"
                        alt={item.name || "Product"}
                        width={45}
                        height={45}
                      />
                    </div>
                    <div>
                      <p className="max-sm:text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                      <p>{currency}{item.price}</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <Counter productId={item.id} />
                  </td>
                  <td className="text-center">
                    {currency}{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleDeleteItemFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <OrderSummary totalPrice={totalPrice} items={cartArray} onCheckout={onCheckout} />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
    </div>
  );
}
*/




