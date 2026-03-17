'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart, clearCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const createCartArray = () => {
    let total = 0;
    const newCartArray = [];

    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find(product => String(product.id) === String(key));
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
      const isInactive = item.status === "inactive";
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
        throw new Error("Please fix out-of-stock or over-quantity items before checkout");
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
              {cartArray.map((item) => {
                const stock = Number(item.product_count ?? 0);
                const isInactive = item.status === "inactive";
                const isOutOfStock = stock <= 0 || isInactive;
                const exceedsStock = Number(item.quantity) > stock;

                return (
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

                        {isOutOfStock ? (
                          <p className="text-red-500 text-sm mt-1">Out of stock</p>
                        ) : exceedsStock ? (
                          <p className="text-red-500 text-sm mt-1">
                            Only {stock} item(s) available
                          </p>
                        ) : stock <= 5 ? (
                          <p className="text-orange-500 text-sm mt-1">
                            Only {stock} left
                          </p>
                        ) : (
                          <p className="text-green-600 text-sm mt-1">In stock</p>
                        )}
                      </div>
                    </td>

                    <td className="text-center">
                      <Counter productId={item.id} maxQty={item.product_count} />
                    </td>

                    <td className="text-center">
                      {currency}{(Number(item.price) * Number(item.quantity)).toLocaleString()}
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
                );
              })}
            </tbody>
          </table>

          <div className="w-full max-w-md">
            {hasInvalidItems && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-600 text-sm font-medium">
                  Please fix out-of-stock or over-quantity items before checkout.
                </p>
              </div>
            )}

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
  ) : (
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
    </div>
  );
}