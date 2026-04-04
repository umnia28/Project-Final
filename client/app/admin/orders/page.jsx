'use client';

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  PackageIcon,
  TruckIcon,
  ReceiptTextIcon,
  UserIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";

const API = "http://localhost:5000";

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [ordersRaw, setOrdersRaw] = useState([]);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const setBusy = (key, value) => {
    setActionLoading((prev) => ({ ...prev, [key]: value }));
  };

  const formatText = (value) =>
    String(value || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const isPaidLike = (status) =>
    ["paid", "partially_refunded", "refunded"].includes(
      String(status || "").toLowerCase()
    );

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Server returned invalid response");
    }
  };

  const loadOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to load admin orders");

    setOrdersRaw(data.orders || []);
  };

  const loadDeliveryMen = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders/delivery-men`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to load delivery men");

    setDeliveryMen(data.deliveryMen || []);
  };

  const loadAll = async () => {
    await Promise.all([loadOrders(), loadDeliveryMen()]);
  };

  useEffect(() => {
    setLoading(true);
    loadAll()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const orders = useMemo(() => {
    return ordersRaw.map((o) => {
      const hasCancelledItems =
        Array.isArray(o.items) &&
        o.items.some(
          (item) =>
            String(item?.seller_status || "").toLowerCase() === "cancelled" ||
            String(item?.cancelled_by || "").trim() !== ""
        );

      const hasRefund =
        isPaidLike(o.payment_status) && Number(o.refund_amount || 0) > 0;

      return {
        ...o,
        hasCancelledItems,
        hasRefund,
        selectedDeliveryManId:
          selectedDeliveryMan[o.order_id] ??
          (o.delivery_man_id ? String(o.delivery_man_id) : ""),
      };
    });
  }, [ordersRaw, selectedDeliveryMan]);

  const handleAssign = async (orderId) => {
    const delivery_man_id = selectedDeliveryMan[orderId];

    if (!delivery_man_id) {
      toast.error("Please select a delivery man");
      return;
    }

    try {
      setBusy(`assign-${orderId}`, true);
      setAssigningOrderId(orderId);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/api/admin/orders/${orderId}/assign-delivery`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delivery_man_id }),
        }
      );

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message || "Failed to assign delivery man");

      toast.success(data.message || "Delivery man assigned successfully");
      setAssigningOrderId(null);
      await loadOrders();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(`assign-${orderId}`, false);
    }
  };

  const handleCancel = async (orderId) => {
    const reason = window.prompt("Enter cancellation reason:", "Cancelled by admin");
    if (reason === null) return;

    try {
      setBusy(`cancel-${orderId}`, true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/admin/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message || "Failed to cancel order");

      toast.success(data.message || "Order cancelled");
      await loadOrders();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(`cancel-${orderId}`, false);
    }
  };

  const handleRefund = async (orderId) => {
    const reason = window.prompt("Enter refund reason:", "Refunded by admin");
    if (reason === null) return;

    try {
      setBusy(`refund-${orderId}`, true);

      const token = localStorage.getItem("token");

      // Backend has no separate /refund route.
      // Admin cancel route already handles refund calculation/status updates.
      const res = await fetch(`${API}/api/admin/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message || "Failed to refund order");

      toast.success(data.message || "Refund processed");
      await loadOrders();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(`refund-${orderId}`, false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.45),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.42),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-4 md:p-6 text-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)] mb-8">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600 border border-[#ebe7f5]">
                <ShieldCheckIcon size={16} />
                Admin Order Control
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                Admin{" "}
                <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                  Orders
                </span>
              </h1>

              <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                Manage all platform orders, assign delivery personnel, and handle cancellations or refunds.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4 rounded-2xl border border-[#ebe7f5]">
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                <ReceiptTextIcon size={28} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Loaded Orders</p>
                <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-[#ebe7f5] shadow-sm p-8 text-slate-500">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-dashed border-[#d8dbe7] shadow-sm min-h-[320px] flex items-center justify-center">
            <div className="text-center px-6">
              <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4 mb-4">
                <PackageIcon size={32} className="text-violet-500" />
              </div>
              <h2 className="text-3xl font-semibold text-slate-700">No Orders Found</h2>
              <p className="text-slate-400 mt-2">
                There are currently no orders available in the admin panel.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o) => {
              const latestStatus = o.latest_status || "placed";
              const paymentStatus = o.payment_status || "pending";

              return (
                <div
                  key={o.order_id}
                  className="rounded-[28px] bg-white/85 backdrop-blur-md border border-[#ebe7f5] shadow-[0_10px_35px_rgba(180,160,255,0.08)] hover:shadow-[0_18px_50px_rgba(180,160,255,0.14)] transition-all duration-300 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-slate-800">
                          Order #{o.order_id}
                        </h2>
                        <span className="rounded-full bg-[#f4f6fb] px-3 py-1 text-xs text-slate-500 border border-[#ebe7f5]">
                          {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                        </span>
                      </div>

                      <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                        <UserIcon size={16} className="mt-0.5 shrink-0" />
                        <p>
                          Customer:{" "}
                          <span className="font-medium text-slate-700">
                            {o.customer_full_name || o.customer_username || "N/A"}
                          </span>
                          {o.customer_email ? ` (${o.customer_email})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                      {o.hasRefund && (
                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#fee2e2] to-[#fff1f2] text-rose-700 text-sm font-medium">
                          Refund amount: ৳{Number(o.refund_amount || 0).toLocaleString()}
                        </span>
                      )}

                      <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#e0f2fe] to-[#eff6ff] text-sky-700 text-sm capitalize">
                        {formatText(latestStatus)}
                      </span>

                      <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ede9fe] to-[#f5f3ff] text-violet-700 text-sm capitalize">
                        {formatText(paymentStatus)}
                      </span>

                      <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#faf8ef] to-[#f5f5dc] text-amber-700 text-sm font-medium">
                        {o.hasCancelledItems || o.hasRefund ? "Remaining Total: " : "Total: "}
                        ৳{Number(o.total_price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#fcfdff] via-[#faf9ff] to-[#faf8ef] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinIcon size={16} className="text-slate-500" />
                        <p className="text-sm font-medium text-slate-700">Shipping Address</p>
                      </div>
                      <p className="text-sm text-slate-600">{o.shipping_address || "N/A"}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {[o.city, o.shipping_state, o.zip_code, o.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#fcfdff] via-[#f8f6ff] to-[#faf8ef] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TruckIcon size={16} className="text-slate-500" />
                        <p className="text-sm font-medium text-slate-700">Assigned Delivery Man</p>
                      </div>

                      <p className="text-sm text-slate-600">
                        {o.delivery_man_full_name || o.delivery_man_username || "Not assigned"}
                      </p>

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <select
                          value={o.selectedDeliveryManId}
                          onChange={(e) =>
                            setSelectedDeliveryMan((prev) => ({
                              ...prev,
                              [o.order_id]: e.target.value,
                            }))
                          }
                          className="border border-[#d8dbe7] rounded-xl px-3 py-2.5 text-sm w-full bg-white outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
                        >
                          <option value="">Select delivery man</option>
                          {deliveryMen.map((dm) => (
                            <option key={dm.user_id} value={dm.user_id}>
                              {dm.full_name || dm.username} • Delivered: {dm.total_orders}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleAssign(o.order_id)}
                          disabled={!!actionLoading[`assign-${o.order_id}`]}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] text-slate-700 hover:opacity-90 disabled:opacity-60 font-medium shadow-sm"
                        >
                          {actionLoading[`assign-${o.order_id}`]
                            ? "Saving..."
                            : o.delivery_man_id
                            ? "Reassign"
                            : "Assign"}
                        </button>
                      </div>

                      {assigningOrderId === o.order_id && (
                        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                          <SparklesIcon size={12} />
                          Updating assignment...
                        </p>
                      )}
                    </div>
                  </div>

                  {o.items?.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-[#ebe7f5] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] text-slate-500">
                            <tr>
                              <th className="text-left py-3 px-4">Product</th>
                              <th className="py-3 px-4">Qty</th>
                              <th className="py-3 px-4">Price</th>
                              <th className="py-3 px-4">Discount</th>
                              <th className="py-3 px-4">Item Status</th>
                              <th className="py-3 px-4">Cancelled By</th>
                              <th className="py-3 px-4">Refunded</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((l) => {
                              const itemStatus =
                                String(l.refund_status || "").toLowerCase() === "refunded"
                                  ? "refunded"
                                  : String(l.seller_status || "").toLowerCase() === "cancelled"
                                  ? "cancelled"
                                  : l.delivery_status || l.seller_status || "pending";

                              return (
                                <tr key={l.order_item_id} className="border-t border-[#ebe7f5]">
                                  <td className="py-3 px-4 text-slate-700">
                                    {l.product_name}
                                    {l.product_id ? ` (#${l.product_id})` : ""}
                                  </td>

                                  <td className="py-3 px-4 text-center text-slate-600">{l.qty}</td>

                                  <td className="py-3 px-4 text-center text-slate-600">
                                    ৳{Number(l.price || 0).toLocaleString()}
                                  </td>

                                  <td className="py-3 px-4 text-center text-slate-600">
                                    ৳{Number(l.discount_amount || 0).toLocaleString()}
                                  </td>

                                  <td className="py-3 px-4 text-center">
                                    <span
                                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                        itemStatus === "cancelled"
                                          ? "bg-rose-100 text-rose-700"
                                          : itemStatus === "refunded"
                                          ? "bg-violet-100 text-violet-700"
                                          : itemStatus === "delivered"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : itemStatus === "out_for_delivery"
                                          ? "bg-sky-100 text-sky-700"
                                          : itemStatus === "confirmed" || itemStatus === "shipment_ready"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      {formatText(itemStatus)}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 text-center text-slate-600">
                                    {l.cancelled_by ? formatText(l.cancelled_by) : "-"}
                                  </td>

                                  <td className="py-3 px-4 text-center text-slate-600">
                                    {Number(l.refunded_amount || 0) > 0
                                      ? `৳${Number(l.refunded_amount || 0).toLocaleString()}`
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleCancel(o.order_id)}
                      disabled={!!actionLoading[`cancel-${o.order_id}`]}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e0f2fe] to-[#dbeafe] text-sky-700 hover:opacity-90 disabled:opacity-60 font-medium"
                    >
                      {actionLoading[`cancel-${o.order_id}`] ? "Cancelling..." : "Cancel Order"}
                    </button>

                    <button
                      onClick={() => handleRefund(o.order_id)}
                      disabled={!!actionLoading[`refund-${o.order_id}`]}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ede9fe] to-[#f5f5dc] text-violet-700 hover:opacity-90 disabled:opacity-60 font-medium"
                    >
                      {actionLoading[`refund-${o.order_id}`] ? "Refunding..." : "Refund Order"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}