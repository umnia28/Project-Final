'use client';
import { useEffect, useMemo, useState } from "react";
import RequireRole from "@/components/RequireRole";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  ReceiptTextIcon,
  CircleXIcon,
  BadgeDollarSignIcon,
  SparklesIcon,
  CircleCheckIcon,
} from "lucide-react";

const API = "http://localhost:5000";

export default function AdminRefundsPage() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});

  const setActionBusy = (key, value) => {
    setBusy((prev) => ({ ...prev, [key]: value }));
  };

  const load = async () => {
    setErr("");
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load orders");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (orderId) => {
    const reason = window.prompt("Enter cancellation reason:", "Cancelled by admin");
    if (reason === null) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Cancel failed");

    toast.success(data.message || "Cancelled ✅");
    await load();
  };

  const refundOrder = async (orderId) => {
    const reason = window.prompt("Enter refund reason:", "Refunded by admin");
    if (reason === null) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders/${orderId}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Refund failed");

    toast.success(data.message || "Refunded ✅");
    await load();
  };

  const enhancedOrders = useMemo(() => {
    return orders.map((o) => {
      const latestStatus = (o.latest_status || "").toLowerCase();
      const paymentStatus = (o.payment_status || "").toLowerCase();

      const alreadyCancelled = latestStatus === "cancelled";
      const alreadyRefunded =
        paymentStatus === "refunded" || latestStatus === "refunded";

      // COD refund is allowed too
      const canRefund = !alreadyRefunded && !alreadyCancelled;
      const canCancel = !alreadyCancelled && !alreadyRefunded;

      return {
        ...o,
        latestStatus,
        paymentStatus,
        canRefund,
        canCancel,
      };
    });
  }, [orders]);

  if (loading) {
    return (
      <RequireRole allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-6">
          <div className="max-w-6xl mx-auto text-slate-500">Loading...</div>
        </div>
      </RequireRole>
    );
  }

  if (err) {
    return (
      <RequireRole allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-6">
          <div className="max-w-6xl mx-auto text-red-600">{err}</div>
        </div>
      </RequireRole>
    );
  }

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
            <div className="bg-white rounded-3xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
                  <ShieldCheckIcon size={16} />
                  Refund & Cancel Control
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                  Refunds <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">&</span> Cancels
                </h1>

                <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                  Review order payment status, cancel invalid orders, and process refunds for both prepaid and COD orders.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
                <div className="rounded-2xl bg-white/70 p-3">
                  <ReceiptTextIcon size={28} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Orders Loaded</p>
                  <p className="text-2xl font-bold text-slate-800">{enhancedOrders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {enhancedOrders.length === 0 ? (
            <div className="rounded-3xl bg-white border border-dashed border-slate-300 shadow-sm min-h-[260px] flex items-center justify-center">
              <div className="text-center px-6">
                <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 mb-4">
                  <SparklesIcon size={30} className="text-purple-600" />
                </div>
                <h2 className="text-3xl font-semibold text-slate-700">No Orders Found</h2>
                <p className="text-slate-400 mt-2">There are no orders to manage right now.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {enhancedOrders.map((o) => (
                <div
                  key={o.order_id}
                  className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] p-5 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-semibold text-slate-800">
                          Order #{o.order_id}
                        </p>

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                          {o.latest_status || "placed"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            o.paymentStatus === "refunded"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {o.payment_status || "pending"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-2">
                        {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        <p>
                          Payment Method:{" "}
                          <b className="capitalize">{o.payment_method || "—"}</b>
                        </p>

                        {o.transaction_id && (
                          <p>
                            Transaction ID: <b>{o.transaction_id}</b>
                          </p>
                        )}

                        {o.reason_for_cancellation && (
                          <p className="text-red-600">
                            Reason: {o.reason_for_cancellation}
                          </p>
                        )}
                      </div>

                      <p className="font-semibold mt-3 text-slate-800">
                        ৳ {Number(o.total_price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={!o.canCancel || !!busy[`cancel-${o.order_id}`]}
                        onClick={() =>
                          toast.promise(
                            (async () => {
                              setActionBusy(`cancel-${o.order_id}`, true);
                              try {
                                await cancelOrder(o.order_id);
                              } finally {
                                setActionBusy(`cancel-${o.order_id}`, false);
                              }
                            })(),
                            { loading: "Cancelling..." }
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl text-white transition ${
                          !o.canCancel
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <CircleXIcon size={16} />
                          {busy[`cancel-${o.order_id}`] ? "Cancelling..." : "Cancel"}
                        </span>
                      </button>

                      <button
                        disabled={!o.canRefund || !!busy[`refund-${o.order_id}`]}
                        onClick={() =>
                          toast.promise(
                            (async () => {
                              setActionBusy(`refund-${o.order_id}`, true);
                              try {
                                await refundOrder(o.order_id);
                              } finally {
                                setActionBusy(`refund-${o.order_id}`, false);
                              }
                            })(),
                            { loading: "Refunding..." }
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl text-white transition ${
                          !o.canRefund
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <BadgeDollarSignIcon size={16} />
                          {busy[`refund-${o.order_id}`] ? "Refunding..." : "Refund"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* footer note */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <CircleCheckIcon size={14} />
                    COD and prepaid orders are both refundable from this panel.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}