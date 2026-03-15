'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, maxQty = Infinity }) => {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const currentQty = Number(cartItems?.[productId] || 0);
    const limit = Number(maxQty);

    const addToCartHandler = () => {
        if (currentQty >= limit) return;
        dispatch(addToCart({ productId }));
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }));
    }

    const isMaxReached = currentQty >= limit;

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button
                onClick={removeFromCartHandler}
                className="p-1 select-none"
            >
                -
            </button>

            <p className="p-1">{currentQty}</p>

            <button
                onClick={addToCartHandler}
                disabled={isMaxReached}
                className={`p-1 select-none ${isMaxReached ? "opacity-40 cursor-not-allowed" : ""}`}
            >
                +
            </button>
        </div>
    )
}

export default Counter