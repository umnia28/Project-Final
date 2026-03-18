"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Package, Truck, CheckCircle2, Wallet, BadgeInfo } from "lucide-react";

const API = "http://localhost:5000";

const statusBadgeClass = (status, isCancelled) => {
  if (isCancelled) return "bg-red-100 text-red-700 border-red-200";
  if (status === "shipment_ready") return "bg-[#f6eadb] text-[#9a6b2f] border-[#ead2b0]";
  if (status === "out_for_delivery") return "bg-sky-100 text-sky-700 border-sky-200";
  if (status === "delivered") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-[#eee7fb] text-[#7a5db4] border-[#d9ccf4]";
};

export default function DeliverymanAssignedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/deliveryman/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Assigned orders fetch error:", err);
      toast.error("Failed to load assigned orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, delivery_status) => {
    try {
      setUpdatingOrderId(orderId);

      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API}/api/deliveryman/orders/${orderId}/status`,
        { delivery_status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Delivery status updated");
      await fetchOrders();
    } catch (err) {
      console.error("Update order status error:", err);
      toast.error(err.response?.data?.message || "Failed to update delivery status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const visibleOrders = orders.filter((order) =>
    (order.items || []).some(
      (item) =>
        item.delivery_status !== "delivered" &&
        item.delivery_status !== "delivery_cancelled"
    )
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="rounded-[28px] border border-[#d9e9fb] bg-white/70 px-8 py-6 text-slate-600 shadow-[0_12px_35px_rgba(160,180,220,0.16)] backdrop-blur-md">
          Loading assigned orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(221,214,254,0.28),_transparent_22%),linear-gradient(to_bottom,_#fffdf9,_#f7fbff,_#faf7ff)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-[30px] bg-gradient-to-r from-[#f4dec2] via-[#ddd6fe] to-[#bae6fd] p-[2px] shadow-[0_18px_45px_rgba(181,190,222,0.22)]">
          <div className="rounded-[30px] bg-white/75 px-6 py-7 backdrop-blur-md md:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              Assigned Orders
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage shipment-ready items and update delivery progress.
            </p>
          </div>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="rounded-[28px] border border-[#d9e9fb] bg-white/75 p-8 text-slate-500 shadow-[0_12px_35px_rgba(160,180,220,0.14)] backdrop-blur-md">
            No assigned orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {visibleOrders.map((order) => (
              <div
                key={order.order_id}
                className="rounded-[30px] border border-white/70 bg-white/75 p-5 shadow-[0_16px_40px_rgba(170,180,210,0.16)] backdrop-blur-md md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d7c9f4] bg-[#f3edff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a5db4]">
                      <Package className="h-3.5 w-3.5" />
                      Order #{order.order_id}
                    </div>

                    <div className="mt-4 space-y-1">
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Wallet className="h-4 w-4 text-sky-500" />
                        Payment: <span className="font-medium">{order.payment_status}</span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Total:{" "}
                        <span className="font-semibold">
                          ৳ {Number(order.total_price || 0).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {(order.shipping_address ||
                      order.city ||
                      order.shipping_state ||
                      order.zip_code ||
                      order.country) && (
                      <div className="rounded-[24px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] p-4 text-sm text-slate-600">
                        <p className="mb-2 font-semibold text-slate-700">Delivery Address</p>
                        {order.shipping_address && <p>{order.shipping_address}</p>}
                        {order.city && <p>{order.city}</p>}
                        {order.shipping_state && <p>{order.shipping_state}</p>}
                        {order.zip_code && <p>{order.zip_code}</p>}
                        {order.country && <p>{order.country}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {order.items && order.items.length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {order.items.map((item) => {
                      const isCancelled =
                        item.cancelled_by ||
                        item.delivery_status === "delivery_cancelled";

                      return (
                        <div
                          key={item.order_item_id}
                          className="rounded-[24px] border border-white/70 bg-gradient-to-r from-[#fffaf2] via-white to-[#f4f8ff] p-4 shadow-[0_10px_25px_rgba(180,190,220,0.1)]"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-lg font-semibold text-slate-800">
                                {item.product_name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Quantity: {item.qty}
                              </p>
                              <p className="text-sm text-slate-500">
                                Price: ৳ {Number(item.price || 0).toLocaleString()}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass(
                                    item.delivery_status,
                                    isCancelled
                                  )}`}
                                >
                                  <BadgeInfo className="h-3.5 w-3.5" />
                                  {isCancelled
                                    ? "Cancelled"
                                    : item.delivery_status || "No status"}
                                </span>

                                {item.cancelled_by && (
                                  <span className="text-sm text-red-500">
                                    Cancelled by: {item.cancelled_by}
                                  </span>
                                )}
                              </div>
                            </div>

                            {!isCancelled && (
                              <div className="flex flex-wrap gap-3">
                                {item.delivery_status === "shipment_ready" && (
                                  <button
                                    onClick={() =>
                                      updateOrderStatus(order.order_id, "out_for_delivery")
                                    }
                                    disabled={updatingOrderId === order.order_id}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(56,189,248,0.24)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Truck className="h-4 w-4" />
                                    {updatingOrderId === order.order_id
                                      ? "Updating..."
                                      : "Mark Out for Delivery"}
                                  </button>
                                )}

                                {(item.delivery_status === "shipment_ready" ||
                                  item.delivery_status === "out_for_delivery") && (
                                  <button
                                    onClick={() =>
                                      updateOrderStatus(order.order_id, "delivered")
                                    }
                                    disabled={updatingOrderId === order.order_id}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c4b5fd] to-[#a78bfa] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(167,139,250,0.24)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {updatingOrderId === order.order_id
                                      ? "Updating..."
                                      : "Mark Delivered"}
                                  </button>
                                )}

                                {item.delivery_status === "delivered" && (
                                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                                    Delivered
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-slate-500">No items found for this order.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}