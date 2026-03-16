'use client';

import { DotIcon } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const sellerBadgeClass = (item) => {
  if (item.cancelled_by) return "text-red-700 bg-red-100";
  if (item.seller_status === "confirmed") return "text-green-700 bg-green-100";
  return "text-yellow-700 bg-yellow-100";
};

const deliveryClass = (status) => {
  if (status === "delivered") return "text-green-700 bg-green-100";
  if (status === "out_for_delivery") return "text-blue-700 bg-blue-100";
  if (status === "shipment_ready") return "text-purple-700 bg-purple-100";
  return "text-slate-700 bg-slate-100";
};

const getSellerBadgeText = (item) => {
  if (item.cancelled_by === "customer") return "Customer Cancelled";
  if (item.cancelled_by === "seller") return "Seller Cancelled";
  if (item.seller_status === "confirmed") return "Seller Confirmed";
  return "Seller Pending";
};

const paymentBadgeClass = (status) => {
  if (status === "paid") return "bg-green-100 text-green-700";
  if (status === "unpaid") return "bg-yellow-100 text-yellow-700";
  if (status === "failed") return "bg-red-100 text-red-700";
  if (status === "refunded") return "bg-purple-100 text-purple-700";
  return "bg-slate-100 text-slate-700";
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
      <tr className="text-sm align-top">
        <td className="text-left py-4">
          <div className="flex flex-col gap-5">
            {order.items?.map((item) => {
              const itemSubtotal = Number(item.price || 0) * Number(item.qty || 0);
              const itemDiscount = Number(item.discount_amount || 0);
              const itemNet = itemSubtotal - itemDiscount;

              return (
                <div key={item.order_item_id} className="border rounded-xl p-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-slate-700">
                      {item.product_name}
                    </p>

                    <p className="text-slate-500 text-sm">
                      Store: {item.store_name}
                    </p>

                    <p className="text-slate-600">
                      {currency}
                      {Number(item.price).toLocaleString()} × {item.qty}
                    </p>

                    {itemDiscount > 0 && (
                      <>
                        <p className="text-sm text-green-600">
                          Item Discount: -{currency}
                          {itemDiscount.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          Item Total After Discount: {currency}
                          {itemNet.toLocaleString()}
                        </p>
                      </>
                    )}

                    <div className="flex flex-wrap gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${sellerBadgeClass(item)}`}
                      >
                        <DotIcon size={12} />
                        {getSellerBadgeText(item)}
                      </span>

                      {!item.cancelled_by && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${deliveryClass(item.delivery_status)}`}
                        >
                          <DotIcon size={12} />
                          Delivery: {item.delivery_status}
                        </span>
                      )}
                    </div>

                    {item.cancelled_by === "customer" && (
                      <>
                        <p className="text-sm text-red-600 mt-1">
                          Cancelled by customer
                        </p>

                        {item.customer_cancelled_at && (
                          <p className="text-xs text-slate-500">
                            Customer cancelled at:{" "}
                            {new Date(item.customer_cancelled_at).toLocaleString()}
                          </p>
                        )}
                      </>
                    )}

                    {item.cancelled_by === "seller" && (
                      <>
                        <p className="text-sm text-red-600 mt-1">
                          Cancelled by seller
                        </p>

                        {item.seller_cancelled_at && (
                          <p className="text-xs text-slate-500">
                            Seller cancelled at:{" "}
                            {new Date(item.seller_cancelled_at).toLocaleString()}
                          </p>
                        )}
                      </>
                    )}

                    {item.cancel_reason && (
                      <p className="text-xs text-slate-500">
                        Reason: {item.cancel_reason}
                      </p>
                    )}

                    {canCustomerCancel(item) && (
                      <div className="mt-2">
                        <button
                          onClick={() => cancelOrderItem(item.order_item_id)}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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

        <td className="text-center max-md:hidden py-4">
          {currency}
          {Number(order.total_price || 0).toLocaleString()}
        </td>

        <td className="text-left max-md:hidden py-4">
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
        </td>

        <td className="text-left max-md:hidden py-4">
          <div className="flex flex-col gap-2">
            <span className="text-slate-600">
              Ordered:{" "}
              {order.date_added
                ? new Date(order.date_added).toLocaleString()
                : "N/A"}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
            >
              <DotIcon size={12} />
              Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
            </span>

            {Number(order.discount_amount || 0) > 0 && (
              <span className="text-sm text-green-600">
                Discount: -{currency}
                {Number(order.discount_amount).toLocaleString()}
              </span>
            )}

            <span className="text-sm text-slate-600">
              Delivery Charge: {currency}
              {Number(order.delivery_charge || 0).toLocaleString()}
            </span>

            <span className="text-sm font-medium text-slate-700">
              Grand Total: {currency}
              {Number(order.total_price || 0).toLocaleString()}
            </span>
          </div>
        </td>
      </tr>

      <tr className="md:hidden">
        <td colSpan={4} className="pb-6">
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              Ordered:{" "}
              {order.date_added
                ? new Date(order.date_added).toLocaleString()
                : "N/A"}
            </p>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium w-fit ${paymentBadgeClass(order.payment_status)}`}
            >
              <DotIcon size={12} />
              Payment: {formatPaymentStatus(order.payment_status, order.payment_method)}
            </span>

            {Number(order.discount_amount || 0) > 0 && (
              <p className="text-green-600">
                Discount: -{currency}
                {Number(order.discount_amount).toLocaleString()}
              </p>
            )}

            <p>
              Delivery Charge: {currency}
              {Number(order.delivery_charge || 0).toLocaleString()}
            </p>

            <p className="font-medium text-slate-700">
              Grand Total: {currency}
              {Number(order.total_price || 0).toLocaleString()}
            </p>

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
        </td>
      </tr>

      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-300 w-6/7 mx-auto" />
        </td>
      </tr>
    </>
  );
}