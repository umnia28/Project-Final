'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, maxQty = Infinity }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const currentQty = Number(cartItems?.[productId] || 0);
  const limit = Number(maxQty);

  const addToCartHandler = () => {
    if (currentQty >= limit) return;
    dispatch(addToCart({ productId }));
  };

  const removeFromCartHandler = () => {
    dispatch(removeFromCart({ productId }));
  };

  const isMaxReached = currentQty >= limit;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-2 py-1.5 text-slate-700 shadow-sm backdrop-blur-md">
      <button
        onClick={removeFromCartHandler}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-lg font-semibold text-slate-700 transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
      >
        −
      </button>

      <p className="min-w-[28px] text-center text-sm font-semibold text-slate-800">
        {currentQty}
      </p>

      <button
        onClick={addToCartHandler}
        disabled={isMaxReached}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 ${
          isMaxReached
            ? "cursor-not-allowed bg-slate-100 text-slate-300"
            : "bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 text-slate-700 hover:scale-105 hover:shadow-sm active:scale-95"
        }`}
      >
        +
      </button>
    </div>
  );
};

export default Counter;