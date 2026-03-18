'use client';

import { DotIcon, Sparkles, MapPin, Wallet, Package } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const sellerBadgeClass = (item) => {
  if (item.cancelled_by) return "text-red-700 bg-red-100 border-red-200";
  if (item.seller_status === "confirmed") return "text-emerald-700 bg-emerald-100 border-emerald-200";
  return "text-amber-700 bg-amber-100 border-amber-200";
};

const deliveryClass = (status) => {
  if (status === "delivered") return "text-emerald-700 bg-emerald-100 border-emerald-200";
  if (status === "out_for_delivery") return "text-sky-700 bg-sky-100 border-sky-200";
  if (status === "shipment_ready") return "text-violet-700 bg-violet-100 border-violet-200";
  return "text-slate-700 bg-slate-100 border-slate-200";
};

const getSellerBadgeText = (item) => {
  if (item.cancelled_by === "customer") return "Customer Cancelled";
  if (item.cancelled_by === "seller") return "Seller Cancelled";
  if (item.seller_status === "confirmed") return "Seller Confirmed";
  return "Seller Pending";
};

const paymentBadgeClass = (status) => {
  if (status === "paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "unpaid") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "failed") return "bg-red-100 text-red-700 border-red-200";
  if (status === "refunded") return "bg-violet-100 text-violet-700 border-violet-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const formatPaymentStatus = (status, method) => {
  if (!status) return "Unknown";
  if (status === "paid") return "Paid";
  if (status === "unpaid") {
    if (method === "cod") return "Cash on Delivery";
    return "Unpaid";
  }
  if (status === "failed") return "Payment Failed";
  if (status === "refunded") return "Refunded";
  if (status === "pending") return "Pending";
  return status.replaceAll("_", " ");
};

export default function OrderItem({ order, onReload }) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const canCustomerCancel = (item) => {
    return (
      item.seller_status === "pending" &&
      item.delivery_status === "not_ready" &&
      !item.cancelled_by
    );
  };

  const cancelOrderItem = async (orderItemId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/orders/${orderItemId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Cancelled by customer" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel item");
      }

      toast.success("Order item cancelled");

      if (onReload) {
        await onReload();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <tr className="align-top">
        <td className="py-6 text-left">
          <div className="flex flex-col gap-5">
            {order.items?.map((item) => {
              const itemSubtotal = Number(item.price || 0) * Number(item.qty || 0);
              const itemDiscount = Number(item.discount_amount || 0);
              const itemNet = itemSubtotal - itemDiscount;

              return (
                <div
                  key={item.order_item_id}
                  className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_35px_rgba(167,139,219,0.08)] backdrop-blur-md"
                >
                  <div className="pointer-events-none absolute -top-10 left-0 h-28 w-28 rounded-full bg-[#d7c4ef]/20 blur-3xl" />
                  <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-[#bfdaf6]/20 blur-3xl" />

                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Store: <span className="font-medium text-slate-700">{item.store_name}</span>
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-[#8b7bd6]" />
                        Order Item
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-r from-[#f7f1e8]/80 via-white/80 to-[#eef6ff]/80 p-4">
                      <p className="text-sm text-slate-500">
                        {currency}
                        {Number(item.price).toLocaleString()} × {item.qty}
                      </p>

                      {itemDiscount > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-emerald-600">
                            Item Discount: -{currency}
                            {itemDiscount.toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            Item Total After Discount: {currency}
                            {itemNet.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${sellerBadgeClass(item)}`}
                      >
                        <DotIcon size={12} />
                        {getSellerBadgeText(item)}
                      </span>

                      {!item.cancelled_by && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${deliveryClass(item.delivery_status)}`}
                        >
                          <DotIcon size={12} />
                          Delivery: {item.delivery_status}
                        </span>
                      )}
                    </div>

                    {item.cancelled_by === "customer" && (
                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium text-red-600">
                          Cancelled by customer
                        </p>

                        {item.customer_cancelled_at && (
                          <p className="text-xs text-slate-500">
                            Customer cancelled at:{" "}
                            {new Date(item.customer_cancelled_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {item.cancelled_by === "seller" && (
                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium text-red-600">
                          Cancelled by seller
                        </p>

                        {item.seller_cancelled_at && (
                          <p className="text-xs text-slate-500">
                            Seller cancelled at:{" "}
                            {new Date(item.seller_cancelled_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {item.cancel_reason && (
                      <p className="text-xs text-slate-500">
                        Reason: {item.cancel_reason}
                      </p>
                    )}

                    {canCustomerCancel(item) && (
                      <div className="mt-3">
                        <button
                          onClick={() => cancelOrderItem(item.order_item_id)}
                          className="rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(167,139,219,0.16)] transition hover:scale-105"
                        >
                          Cancel Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </td>

        <td className="max-md:hidden py-6 text-center">
          <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-slate-700 shadow-sm backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
            <p className="mt-1 text-lg font-semibold">
              {currency}
              {Number(order.total_price || 0).toLocaleString()}
            </p>
          </div>
        </td>

        <td className="max-md:hidden py-6 text-left">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <MapPin className="h-4 w-4 text-[#7fb6ea]" />
              <p className="font-semibold">Shipping Address</p>
            </div>

            {order.address ? (
              <div className="space-y-1">
                <p>
                  {order.address.name}, {order.address.street}
                </p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.zip},{" "}
                  {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-slate-400">No address found</p>
            )}
          </div>
        </td>

        <td className="max-md:hidden py-6 text-left">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <Wallet className="h-4 w-4 text-[#8b7bd6]" />
              <p className="font-semibold">Order Summary</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <span className="text-slate-600">
                Ordered:{" "}
                {order.date_added
                  ? new Date(order.date_added).toLocaleString()
                  : "N/A"}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
              >
                <DotIcon size={12} />
                Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
              </span>

              {Number(order.discount_amount || 0) > 0 && (
                <span className="text-sm text-emerald-600">
                  Discount: -{currency}
                  {Number(order.discount_amount).toLocaleString()}
                </span>
              )}

              <span className="text-sm text-slate-600">
                Delivery Charge: {currency}
                {Number(order.delivery_charge || 0).toLocaleString()}
              </span>

              <span className="text-sm font-semibold text-slate-700">
                Grand Total: {currency}
                {Number(order.total_price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </td>
      </tr>

      <tr className="md:hidden">
        <td colSpan={4} className="pb-6">
          <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_35px_rgba(167,139,219,0.08)] backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <Package className="h-4 w-4 text-[#d8c3a5]" />
              <p className="font-semibold">Order Details</p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                Ordered:{" "}
                {order.date_added
                  ? new Date(order.date_added).toLocaleString()
                  : "N/A"}
              </p>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
              >
                <DotIcon size={12} />
                Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
              </span>

              {Number(order.discount_amount || 0) > 0 && (
                <p className="text-emerald-600">
                  Discount: -{currency}
                  {Number(order.discount_amount).toLocaleString()}
                </p>
              )}

              <p>
                Delivery Charge: {currency}
                {Number(order.delivery_charge || 0).toLocaleString()}
              </p>

              <p className="font-semibold text-slate-700">
                Grand Total: {currency}
                {Number(order.total_price || 0).toLocaleString()}
              </p>

              <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#f7f1e8]/80 via-white/80 to-[#eef6ff]/80 p-4">
                {order.address ? (
                  <>
                    <p>
                      {order.address.name}, {order.address.street}
                    </p>
                    <p>
                      {order.address.city}, {order.address.state}, {order.address.zip},{" "}
                      {order.address.country}
                    </p>
                    <p>{order.address.phone}</p>
                  </>
                ) : (
                  <p className="text-slate-400">No address found</p>
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>

      <tr>
        <td colSpan={4}>
          <div className="mx-auto my-2 h-px w-11/12 bg-gradient-to-r from-transparent via-[#d7c4ef] to-transparent" />
        </td>
      </tr>
    </>
  );
}


//  'use client';

// import { DotIcon, Sparkles, MapPin, Wallet, Package } from "lucide-react";
// import toast from "react-hot-toast";

// const API = "http://localhost:5000";

// const sellerBadgeClass = (item) => {
//   if (item.cancelled_by) return "text-red-700 bg-red-100 border-red-200";
//   if (item.seller_status === "confirmed") return "text-emerald-700 bg-emerald-100 border-emerald-200";
//   return "text-amber-700 bg-amber-100 border-amber-200";
// };

// const deliveryClass = (status) => {
//   if (status === "delivered") return "text-emerald-700 bg-emerald-100 border-emerald-200";
//   if (status === "out_for_delivery") return "text-sky-700 bg-sky-100 border-sky-200";
//   if (status === "shipment_ready") return "text-violet-700 bg-violet-100 border-violet-200";
//   return "text-slate-700 bg-slate-100 border-slate-200";
// };

// const getSellerBadgeText = (item) => {
//   if (item.cancelled_by === "customer") return "Customer Cancelled";
//   if (item.cancelled_by === "seller") return "Seller Cancelled";
//   if (item.seller_status === "confirmed") return "Seller Confirmed";
//   return "Seller Pending";
// };

// const paymentBadgeClass = (status) => {
//   if (status === "paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
//   if (status === "unpaid") return "bg-amber-100 text-amber-700 border-amber-200";
//   if (status === "failed") return "bg-red-100 text-red-700 border-red-200";
//   if (status === "refunded") return "bg-violet-100 text-violet-700 border-violet-200";
//   return "bg-slate-100 text-slate-700 border-slate-200";
// };

// const formatPaymentStatus = (status, method) => {
//   if (!status) return "Unknown";
//   if (status === "paid") return "Paid";
//   if (status === "unpaid") {
//     if (method === "cod") return "Cash on Delivery";
//     return "Unpaid";
//   }
//   if (status === "failed") return "Payment Failed";
//   if (status === "refunded") return "Refunded";
//   if (status === "pending") return "Pending";
//   return status.replaceAll("_", " ");
// };

// export default function OrderItem({ order, onReload }) {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

//   const canCustomerCancel = (item) => {
//     return (
//       item.seller_status === "pending" &&
//       item.delivery_status === "not_ready" &&
//       !item.cancelled_by
//     );
//   };

//   const cancelOrderItem = async (orderItemId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API}/api/orders/${orderItemId}/cancel`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ reason: "Cancelled by customer" }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to cancel item");
//       }

//       toast.success("Order item cancelled");

//       if (onReload) {
//         await onReload();
//       }
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <>
//       <tr className="align-top">
//         <td className="py-6 text-left">
//           <div className="flex flex-col gap-5">
//             {order.items?.map((item) => {
//               const itemSubtotal = Number(item.price || 0) * Number(item.qty || 0);
//               const itemDiscount = Number(item.discount_amount || 0);
//               const itemNet = itemSubtotal - itemDiscount;

//               return (
//                 <div
//                   key={item.order_item_id}
//                   className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_35px_rgba(168,85,247,0.08)] backdrop-blur-md"
//                 >
//                   <div className="pointer-events-none absolute -top-10 left-0 h-28 w-28 rounded-full bg-pink-200/20 blur-3xl" />
//                   <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-orange-200/20 blur-3xl" />

//                   <div className="relative flex flex-col gap-3">
//                     <div className="flex items-start justify-between gap-4">
//                       <div>
//                         <p className="text-lg font-semibold text-slate-800">
//                           {item.product_name}
//                         </p>
//                         <p className="mt-1 text-sm text-slate-500">
//                           Store: <span className="font-medium text-slate-700">{item.store_name}</span>
//                         </p>
//                       </div>

//                       <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
//                         <Sparkles className="h-3.5 w-3.5 text-pink-500" />
//                         Order Item
//                       </div>
//                     </div>

//                     <div className="rounded-2xl bg-gradient-to-r from-pink-50/80 via-white/80 to-orange-50/80 p-4">
//                       <p className="text-sm text-slate-500">
//                         {currency}
//                         {Number(item.price).toLocaleString()} × {item.qty}
//                       </p>

//                       {itemDiscount > 0 && (
//                         <div className="mt-2 space-y-1">
//                           <p className="text-sm text-emerald-600">
//                             Item Discount: -{currency}
//                             {itemDiscount.toLocaleString()}
//                           </p>
//                           <p className="text-sm font-medium text-slate-700">
//                             Item Total After Discount: {currency}
//                             {itemNet.toLocaleString()}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div className="mt-1 flex flex-wrap gap-2">
//                       <span
//                         className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${sellerBadgeClass(item)}`}
//                       >
//                         <DotIcon size={12} />
//                         {getSellerBadgeText(item)}
//                       </span>

//                       {!item.cancelled_by && (
//                         <span
//                           className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${deliveryClass(item.delivery_status)}`}
//                         >
//                           <DotIcon size={12} />
//                           Delivery: {item.delivery_status}
//                         </span>
//                       )}
//                     </div>

//                     {item.cancelled_by === "customer" && (
//                       <div className="mt-1 space-y-1">
//                         <p className="text-sm font-medium text-red-600">
//                           Cancelled by customer
//                         </p>

//                         {item.customer_cancelled_at && (
//                           <p className="text-xs text-slate-500">
//                             Customer cancelled at:{" "}
//                             {new Date(item.customer_cancelled_at).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     {item.cancelled_by === "seller" && (
//                       <div className="mt-1 space-y-1">
//                         <p className="text-sm font-medium text-red-600">
//                           Cancelled by seller
//                         </p>

//                         {item.seller_cancelled_at && (
//                           <p className="text-xs text-slate-500">
//                             Seller cancelled at:{" "}
//                             {new Date(item.seller_cancelled_at).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     {item.cancel_reason && (
//                       <p className="text-xs text-slate-500">
//                         Reason: {item.cancel_reason}
//                       </p>
//                     )}

//                     {canCustomerCancel(item) && (
//                       <div className="mt-3">
//                         <button
//                           onClick={() => cancelOrderItem(item.order_item_id)}
//                           className="rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(244,114,182,0.16)] transition hover:scale-105"
//                         >
//                           Cancel Item
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </td>

//         <td className="max-md:hidden py-6 text-center">
//           <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-slate-700 shadow-sm backdrop-blur-md">
//             <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
//             <p className="mt-1 text-lg font-semibold">
//               {currency}
//               {Number(order.total_price || 0).toLocaleString()}
//             </p>
//           </div>
//         </td>

//         <td className="max-md:hidden py-6 text-left">
//           <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur-md">
//             <div className="mb-3 flex items-center gap-2 text-slate-700">
//               <MapPin className="h-4 w-4 text-pink-500" />
//               <p className="font-semibold">Shipping Address</p>
//             </div>

//             {order.address ? (
//               <div className="space-y-1">
//                 <p>
//                   {order.address.name}, {order.address.street}
//                 </p>
//                 <p>
//                   {order.address.city}, {order.address.state}, {order.address.zip},{" "}
//                   {order.address.country}
//                 </p>
//                 <p>{order.address.phone}</p>
//               </div>
//             ) : (
//               <p className="text-slate-400">No address found</p>
//             )}
//           </div>
//         </td>

//         <td className="max-md:hidden py-6 text-left">
//           <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-md">
//             <div className="mb-3 flex items-center gap-2 text-slate-700">
//               <Wallet className="h-4 w-4 text-purple-500" />
//               <p className="font-semibold">Order Summary</p>
//             </div>

//             <div className="flex flex-col gap-2 text-sm">
//               <span className="text-slate-600">
//                 Ordered:{" "}
//                 {order.date_added
//                   ? new Date(order.date_added).toLocaleString()
//                   : "N/A"}
//               </span>

//               <span
//                 className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
//               >
//                 <DotIcon size={12} />
//                 Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
//               </span>

//               {Number(order.discount_amount || 0) > 0 && (
//                 <span className="text-sm text-emerald-600">
//                   Discount: -{currency}
//                   {Number(order.discount_amount).toLocaleString()}
//                 </span>
//               )}

//               <span className="text-sm text-slate-600">
//                 Delivery Charge: {currency}
//                 {Number(order.delivery_charge || 0).toLocaleString()}
//               </span>

//               <span className="text-sm font-semibold text-slate-700">
//                 Grand Total: {currency}
//                 {Number(order.total_price || 0).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </td>
//       </tr>

//       <tr className="md:hidden">
//         <td colSpan={4} className="pb-6">
//           <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_12px_35px_rgba(168,85,247,0.08)] backdrop-blur-md">
//             <div className="mb-4 flex items-center gap-2 text-slate-700">
//               <Package className="h-4 w-4 text-orange-500" />
//               <p className="font-semibold">Order Details</p>
//             </div>

//             <div className="space-y-2 text-sm text-slate-600">
//               <p>
//                 Ordered:{" "}
//                 {order.date_added
//                   ? new Date(order.date_added).toLocaleString()
//                   : "N/A"}
//               </p>

//               <span
//                 className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
//               >
//                 <DotIcon size={12} />
//                 Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
//               </span>

//               {Number(order.discount_amount || 0) > 0 && (
//                 <p className="text-emerald-600">
//                   Discount: -{currency}
//                   {Number(order.discount_amount).toLocaleString()}
//                 </p>
//               )}

//               <p>
//                 Delivery Charge: {currency}
//                 {Number(order.delivery_charge || 0).toLocaleString()}
//               </p>

//               <p className="font-semibold text-slate-700">
//                 Grand Total: {currency}
//                 {Number(order.total_price || 0).toLocaleString()}
//               </p>

//               <div className="mt-4 rounded-2xl bg-gradient-to-r from-pink-50/80 via-white/80 to-orange-50/80 p-4">
//                 {order.address ? (
//                   <>
//                     <p>
//                       {order.address.name}, {order.address.street}
//                     </p>
//                     <p>
//                       {order.address.city}, {order.address.state}, {order.address.zip},{" "}
//                       {order.address.country}
//                     </p>
//                     <p>{order.address.phone}</p>
//                   </>
//                 ) : (
//                   <p className="text-slate-400">No address found</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </td>
//       </tr>

//       <tr>
//         <td colSpan={4}>
//           <div className="mx-auto my-2 h-px w-11/12 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
//         </td>
//       </tr>
//     </>
//   );
// }