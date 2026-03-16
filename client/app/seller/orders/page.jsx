/*'use client';

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  PackageCheck,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Clock3,
  UserRound,
} from "lucide-react";

const API = "http://localhost:5000";

export default function SellerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { message: text || "Server error" };
    }
  };

  const load = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first");
    }

    const res = await fetch(`${API}/api/seller/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await safeJson(res);

    if (!res.ok) {
      throw new Error(data.message || "Failed to load orders");
    }

    setItems(Array.isArray(data.items) ? data.items : []);
  };

  const confirmItem = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(`${API}/api/seller/orders/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm order item");
      }

      toast.success("Order item confirmed");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not confirm item");
    } finally {
      setProcessingId(null);
    }
  };

  const cancelItem = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(`${API}/api/seller/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Cancelled by seller" }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order item");
      }

      toast.success("Order item cancelled");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not cancel item");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => toast.error(e.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const orders = useMemo(() => {
    const map = new Map();

    for (const row of items) {
      if (!map.has(row.order_id)) {
        map.set(row.order_id, {
          order_id: row.order_id,
          date_added: row.date_added,
          payment_status: row.payment_status,
          payment_method: row.payment_method,
          total_price: row.total_price,
          transaction_id: row.transaction_id,
          latest_status: row.latest_status,
          customer: {
            id: row.customer_id,
            username: row.customer_username,
            email: row.customer_email,
          },
          lines: [],
        });
      }

      map.get(row.order_id).lines.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        qty: row.qty,
        price: row.price,
        discount_amount: row.discount_amount,
        seller_status: row.seller_status,
        seller_confirmed_at: row.seller_confirmed_at,
        seller_cancelled_at: row.seller_cancelled_at,
        cancel_reason: row.cancel_reason,
        delivery_status: row.delivery_status,
      });
    }

    return Array.from(map.values());
  }, [items]);

  const sellerStatusClass = (status) => {
    if (status === "confirmed") return "bg-emerald-100 text-emerald-700";
    if (status === "cancelled") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  const paymentStatusClass = (status) => {
    if (status === "paid") return "bg-emerald-100 text-emerald-700";
    if (status === "failed") return "bg-rose-100 text-rose-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const deliveryStatusClass = (status) => {
    if (status === "delivered") return "bg-emerald-100 text-emerald-700";
    if (status === "out_for_delivery") return "bg-sky-100 text-sky-700";
    if (status === "shipment_ready") return "bg-violet-100 text-violet-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/70 via-white to-orange-50/70" />
      <div className="pointer-events-none absolute -top-20 -left-20 -z-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-0 -z-10 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />

      {/* Header 
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Seller Dashboard
          </div>

          <h1 className="mt-4 text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Orders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Orders that include your products.
          </p>
        </div>

        <div className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-sm">
          Total Orders: <span className="font-semibold text-slate-800">{orders.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[1.5rem] border border-white/60 bg-white/75 p-10 text-center text-slate-500 shadow-sm">
          Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-white/60 bg-white/75 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow-md">
            <ShoppingBag size={24} />
          </div>
          <p className="mt-4 font-medium text-slate-700">No orders yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Orders containing your products will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <div
              key={o.order_id}
              className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 shadow-[0_15px_40px_rgba(244,114,182,0.08)] backdrop-blur-xl"
            >
              {/* Order header 
              <div className="flex flex-col gap-4 border-b border-slate-200/70 bg-gradient-to-r from-pink-50/80 via-white to-orange-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="text-pink-500" size={18} />
                    <p className="font-semibold text-slate-800">Order #{o.order_id}</p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={13} />
                      {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <UserRound size={13} />
                      {o.customer?.username || "Unknown customer"}
                    </span>

                    <span>{o.customer?.email || ""}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatusClass(o.payment_status)}`}>
                    <CreditCard size={13} className="mr-1 inline" />
                    {o.payment_status || "unknown"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {o.latest_status || "no status"}
                  </span>

                  <Link
                    className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02]"
                    href={`/orders/${o.order_id}`}
                  >
                    Open Tracking
                  </Link>
                </div>
              </div>

              {/* Table 
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/70 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-center">Price</th>
                      <th className="px-4 py-3 text-center">Discount</th>
                      <th className="px-4 py-3 text-center">Seller Status</th>
                      <th className="px-4 py-3 text-center">Delivery</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {o.lines.map((l) => (
                      <tr key={l.order_item_id} className="border-t border-slate-200/70 hover:bg-pink-50/20">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-slate-800">
                              {l.product_name} <span className="text-slate-400">#{l.product_id}</span>
                            </p>

                            {l.seller_confirmed_at && (
                              <p className="mt-1 text-xs text-emerald-600">
                                Confirmed: {new Date(l.seller_confirmed_at).toLocaleString()}
                              </p>
                            )}

                            {l.seller_cancelled_at && (
                              <p className="mt-1 text-xs text-rose-600">
                                Cancelled: {new Date(l.seller_cancelled_at).toLocaleString()}
                              </p>
                            )}

                            {l.cancel_reason && (
                              <p className="mt-1 text-xs text-slate-500">
                                Reason: {l.cancel_reason}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center">{l.qty}</td>

                        <td className="px-4 py-4 text-center font-medium text-slate-700">
                          ৳{Number(l.price || 0).toLocaleString()}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-600">
                          ৳{Number(l.discount_amount || 0).toLocaleString()}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${sellerStatusClass(l.seller_status)}`}>
                            {l.seller_status || "pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${deliveryStatusClass(l.delivery_status)}`}>
                            <Truck size={13} className="mr-1 inline" />
                            {l.delivery_status || "not_ready"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => confirmItem(l.order_item_id)}
                              disabled={l.seller_status !== "pending" || processingId === l.order_item_id}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle2 size={14} />
                              Confirm
                            </button>

                            <button
                              onClick={() => cancelItem(l.order_item_id)}
                              disabled={l.seller_status !== "pending" || processingId === l.order_item_id}
                              className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1.5 text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer summary 
              <div className="border-t border-slate-200/70 bg-white/60 px-5 py-4 text-sm text-slate-600">
                Payment Method: <span className="font-medium text-slate-800">{o.payment_method || "N/A"}</span>
                {o.transaction_id ? (
                  <span className="ml-4">
                    Transaction ID: <span className="font-medium text-slate-800">{o.transaction_id}</span>
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  */
 "use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  PackageCheck,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Clock3,
  UserRound,
  ArrowRightCircle,
  ReceiptText,
} from "lucide-react";

const API = "http://localhost:5000";

function GradientBorder({ children, style = {} }) {
  return (
    <div
      style={{
        padding: 1.5,
        background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
        borderRadius: 24,
        ...style,
      }}
    >
      <div style={{ background: "#fffaf7", borderRadius: 23 }}>{children}</div>
    </div>
  );
}

function MiniStatCard({ title, value, icon: Icon, gradFrom, gradTo, border, iconColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: "18px 20px",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 10px 30px rgba(168,85,247,0.12)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#78716c",
            fontFamily: "sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "#fff",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={iconColor} strokeWidth={1.8} />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: "#1c1917",
          fontFamily: "Georgia,serif",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({ children, bg, color, border = "transparent" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default function SellerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { message: text || "Server error" };
    }
  };

  const load = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first");
    }

    const res = await fetch(`${API}/api/seller/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await safeJson(res);

    if (!res.ok) {
      throw new Error(data.message || "Failed to load orders");
    }

    setItems(Array.isArray(data.items) ? data.items : []);
  };

  const confirmItem = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(`${API}/api/seller/orders/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm order item");
      }

      toast.success("Order item confirmed");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not confirm item");
    } finally {
      setProcessingId(null);
    }
  };

  const cancelItem = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(`${API}/api/seller/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Cancelled by seller" }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order item");
      }

      toast.success("Order item cancelled");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not cancel item");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => toast.error(e.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const orders = useMemo(() => {
    const map = new Map();

    for (const row of items) {
      if (!map.has(row.order_id)) {
        map.set(row.order_id, {
          order_id: row.order_id,
          date_added: row.date_added,
          payment_status: row.payment_status,
          payment_method: row.payment_method,
          total_price: row.total_price,
          transaction_id: row.transaction_id,
          latest_status: row.latest_status,
          customer: {
            id: row.customer_id,
            username: row.customer_username,
            email: row.customer_email,
          },
          lines: [],
        });
      }

      map.get(row.order_id).lines.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        qty: row.qty,
        price: row.price,
        discount_amount: row.discount_amount,
        seller_status: row.seller_status,
        seller_confirmed_at: row.seller_confirmed_at,
        seller_cancelled_at: row.seller_cancelled_at,
        cancel_reason: row.cancel_reason,
        delivery_status: row.delivery_status,
      });
    }

    return Array.from(map.values());
  }, [items]);

  const sellerStatusStyle = (status) => {
    if (status === "confirmed") {
      return { bg: "#dcfce7", color: "#047857", border: "#a7f3d0" };
    }
    if (status === "cancelled") {
      return { bg: "#ffe4e6", color: "#be123c", border: "#fecdd3" };
    }
    return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  };

  const paymentStatusStyle = (status) => {
    if (status === "paid") {
      return { bg: "#dcfce7", color: "#047857", border: "#a7f3d0" };
    }
    if (status === "failed") {
      return { bg: "#ffe4e6", color: "#be123c", border: "#fecdd3" };
    }
    if (status === "pending") {
      return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
    }
    return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
  };

  const deliveryStatusStyle = (status) => {
    if (status === "delivered") {
      return { bg: "#dcfce7", color: "#047857", border: "#a7f3d0" };
    }
    if (status === "out_for_delivery") {
      return { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" };
    }
    if (status === "shipment_ready") {
      return { bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" };
    }
    return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
  };

  const totalItems = items.length;
  const pendingItems = items.filter((i) => (i.seller_status || "pending") === "pending").length;
  const confirmedItems = items.filter((i) => i.seller_status === "confirmed").length;
  const cancelledItems = items.filter((i) => i.seller_status === "cancelled").length;

  if (loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", padding: "44px 24px", fontFamily: "Georgia,serif" }}>
        <div
          style={{
            position: "fixed",
            top: -80,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            right: -60,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "40%",
            width: 380,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1150, margin: "0 auto" }}>
          <GradientBorder>
            <div style={{ padding: "40px 32px", textAlign: "center", color: "#78716c", fontFamily: "sans-serif" }}>
              Loading orders...
            </div>
          </GradientBorder>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "44px 24px", fontFamily: "Georgia,serif" }}>
      <div
        style={{
          position: "fixed",
          top: -80,
          left: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: -60,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "40%",
          width: 380,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1150, margin: "0 auto" }}>
        {/* hero */}
        <div
          style={{
            padding: 1.5,
            background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
            borderRadius: 28,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "#fffaf7",
              borderRadius: 27,
              padding: "36px 44px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  padding: "5px 18px",
                  background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                  borderRadius: 999,
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7e22ce",
                }}
              >
                <Sparkles size={11} strokeWidth={2} />
                Seller Dashboard
              </div>

              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>Orders</h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 15,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                  lineHeight: 1.75,
                }}
              >
                Orders that include your products.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 22px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={24} color="#fff" strokeWidth={1.7} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                  {orders.length} Orders
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "#a855f7",
                    fontFamily: "sans-serif",
                  }}
                >
                  {totalItems} total line items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 30,
          }}
        >
          <MiniStatCard
            title="Total Orders"
            value={orders.length}
            icon={ReceiptText}
            gradFrom="#fce7f3"
            gradTo="#e9d5ff"
            border="#f9a8d4"
            iconColor="#be185d"
          />
          <MiniStatCard
            title="Total Items"
            value={totalItems}
            icon={ShoppingBag}
            gradFrom="#fdf4ff"
            gradTo="#fce7f3"
            border="#e9d5ff"
            iconColor="#a855f7"
          />
          <MiniStatCard
            title="Pending"
            value={pendingItems}
            icon={Clock3}
            gradFrom="#fff7ed"
            gradTo="#fef3c7"
            border="#fdba74"
            iconColor="#c2410c"
          />
          <MiniStatCard
            title="Confirmed"
            value={confirmedItems}
            icon={CheckCircle2}
            gradFrom="#ecfdf5"
            gradTo="#dcfce7"
            border="#86efac"
            iconColor="#15803d"
          />
          <MiniStatCard
            title="Cancelled"
            value={cancelledItems}
            icon={XCircle}
            gradFrom="#fff1f2"
            gradTo="#ffe4e6"
            border="#fda4af"
            iconColor="#be123c"
          />
        </div>

        {orders.length === 0 ? (
          <GradientBorder>
            <div style={{ padding: "46px 30px", textAlign: "center" }}>
              <div
                style={{
                  margin: "0 auto",
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={28} color="#fff" />
              </div>

              <p
                style={{
                  margin: "18px 0 8px",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#1c1917",
                }}
              >
                No orders yet
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                }}
              >
                Orders containing your products will appear here.
              </p>
            </div>
          </GradientBorder>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {orders.map((o) => {
              const payStyle = paymentStatusStyle(o.payment_status);

              return (
                <GradientBorder key={o.order_id}>
                  <div style={{ padding: 0 }}>
                    {/* order head */}
                    <div
                      style={{
                        padding: "28px 28px 22px",
                        borderBottom: "1px solid #f1e7ef",
                        background: "linear-gradient(135deg,#fff7fb,#faf5ff,#fff7ed)",
                        borderTopLeftRadius: 23,
                        borderTopRightRadius: 23,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 18,
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ flex: "1 1 440px", minWidth: 280 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 14,
                                background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <PackageCheck size={18} color="#fff" />
                            </div>

                            <div>
                              <p style={{ margin: 0, fontSize: 21, fontWeight: 600, color: "#1c1917" }}>
                                Order #{o.order_id}
                              </p>
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  fontSize: 13,
                                  color: "#78716c",
                                  fontFamily: "sans-serif",
                                }}
                              >
                                Seller-side order summary
                              </p>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 16,
                              fontSize: 13,
                              color: "#78716c",
                              fontFamily: "sans-serif",
                            }}
                          >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <Clock3 size={14} color="#a855f7" />
                              {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                            </span>

                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <UserRound size={14} color="#a855f7" />
                              {o.customer?.username || "Unknown customer"}
                            </span>

                            {o.customer?.email ? <span>{o.customer.email}</span> : null}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 12,
                            minWidth: 220,
                            flex: "0 1 auto",
                          }}
                        >
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
                            <Badge bg={payStyle.bg} color={payStyle.color} border={payStyle.border}>
                              <CreditCard size={13} />
                              {o.payment_status || "unknown"}
                            </Badge>

                            <Badge bg="#f5f3ff" color="#6d28d9" border="#ddd6fe">
                              {o.latest_status || "no status"}
                            </Badge>
                          </div>

                          <Link
                            href={`/orders/${o.order_id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "11px 16px",
                              borderRadius: 14,
                              textDecoration: "none",
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 500,
                              fontFamily: "sans-serif",
                              background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                              boxShadow: "0 10px 25px rgba(168,85,247,0.18)",
                            }}
                          >
                            <ArrowRightCircle size={16} />
                            Open Tracking
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* order items */}
                    <div style={{ padding: "24px 24px 10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {o.lines.map((l) => {
                          const sellerStyle = sellerStatusStyle(l.seller_status);
                          const deliveryStyle = deliveryStatusStyle(l.delivery_status);
                          const isBusy = processingId === l.order_item_id;
                          const isPending = l.seller_status === "pending";

                          return (
                            <div
                              key={l.order_item_id}
                              style={{
                                border: "1px solid #f1e7ef",
                                borderRadius: 20,
                                background: "linear-gradient(135deg,#ffffff,#fffaf7)",
                                padding: "18px 18px 16px",
                              }}
                            >
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(250px,1.8fr) repeat(5,minmax(110px,1fr))",
                                  gap: 16,
                                  alignItems: "center",
                                }}
                              >
                                {/* product */}
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: 16,
                                      fontWeight: 600,
                                      color: "#1c1917",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {l.product_name}{" "}
                                    <span
                                      style={{
                                        color: "#a8a29e",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fontFamily: "sans-serif",
                                      }}
                                    >
                                      #{l.product_id}
                                    </span>
                                  </p>

                                  <div
                                    style={{
                                      marginTop: 10,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                      fontFamily: "sans-serif",
                                      fontSize: 12.5,
                                    }}
                                  >
                                    {l.seller_confirmed_at && (
                                      <span style={{ color: "#047857" }}>
                                        Confirmed: {new Date(l.seller_confirmed_at).toLocaleString()}
                                      </span>
                                    )}

                                    {l.seller_cancelled_at && (
                                      <span style={{ color: "#be123c" }}>
                                        Cancelled: {new Date(l.seller_cancelled_at).toLocaleString()}
                                      </span>
                                    )}

                                    {l.cancel_reason && (
                                      <span style={{ color: "#78716c" }}>
                                        Reason: {l.cancel_reason}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* qty */}
                                <div>
                                  <p
                                    style={{
                                      margin: "0 0 6px",
                                      fontSize: 11,
                                      color: "#a855f7",
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    Qty
                                  </p>
                                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                                    {l.qty}
                                  </p>
                                </div>

                                {/* price */}
                                <div>
                                  <p
                                    style={{
                                      margin: "0 0 6px",
                                      fontSize: 11,
                                      color: "#a855f7",
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    Price
                                  </p>
                                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                                    ৳{Number(l.price || 0).toLocaleString()}
                                  </p>
                                </div>

                                {/* discount */}
                                <div>
                                  <p
                                    style={{
                                      margin: "0 0 6px",
                                      fontSize: 11,
                                      color: "#a855f7",
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    Discount
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: 15,
                                      color: "#57534e",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    ৳{Number(l.discount_amount || 0).toLocaleString()}
                                  </p>
                                </div>

                                {/* badges */}
                                <div>
                                  <p
                                    style={{
                                      margin: "0 0 8px",
                                      fontSize: 11,
                                      color: "#a855f7",
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    Status
                                  </p>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <Badge
                                      bg={sellerStyle.bg}
                                      color={sellerStyle.color}
                                      border={sellerStyle.border}
                                    >
                                      {l.seller_status || "pending"}
                                    </Badge>

                                    <Badge
                                      bg={deliveryStyle.bg}
                                      color={deliveryStyle.color}
                                      border={deliveryStyle.border}
                                    >
                                      <Truck size={13} />
                                      {l.delivery_status || "not_ready"}
                                    </Badge>
                                  </div>
                                </div>

                                {/* actions */}
                                <div>
                                  <p
                                    style={{
                                      margin: "0 0 8px",
                                      fontSize: 11,
                                      color: "#a855f7",
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    Action
                                  </p>

                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <button
                                      onClick={() => confirmItem(l.order_item_id)}
                                      disabled={!isPending || isBusy}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 7,
                                        padding: "10px 14px",
                                        borderRadius: 13,
                                        border: "none",
                                        background: "linear-gradient(135deg,#22c55e,#16a34a)",
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fontFamily: "sans-serif",
                                        cursor: !isPending || isBusy ? "not-allowed" : "pointer",
                                        opacity: !isPending || isBusy ? 0.55 : 1,
                                      }}
                                    >
                                      <CheckCircle2 size={14} />
                                      {isBusy ? "Working..." : "Confirm"}
                                    </button>

                                    <button
                                      onClick={() => cancelItem(l.order_item_id)}
                                      disabled={!isPending || isBusy}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 7,
                                        padding: "10px 14px",
                                        borderRadius: 13,
                                        border: "none",
                                        background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fontFamily: "sans-serif",
                                        cursor: !isPending || isBusy ? "not-allowed" : "pointer",
                                        opacity: !isPending || isBusy ? 0.55 : 1,
                                      }}
                                    >
                                      <XCircle size={14} />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* footer */}
                    <div
                      style={{
                        borderTop: "1px solid #f1e7ef",
                        padding: "18px 24px 22px",
                        background: "#fffdfb",
                        borderBottomLeftRadius: 23,
                        borderBottomRightRadius: 23,
                        fontFamily: "sans-serif",
                        color: "#57534e",
                        fontSize: 14,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 18,
                      }}
                    >
                      <span>
                        Payment Method:{" "}
                        <strong style={{ color: "#1c1917", fontWeight: 600 }}>
                          {o.payment_method || "N/A"}
                        </strong>
                      </span>

                      {o.transaction_id ? (
                        <span>
                          Transaction ID:{" "}
                          <strong style={{ color: "#1c1917", fontWeight: 600 }}>{o.transaction_id}</strong>
                        </span>
                      ) : null}

                      {o.total_price ? (
                        <span>
                          Total Price:{" "}
                          <strong style={{ color: "#1c1917", fontWeight: 600 }}>
                            ৳{Number(o.total_price || 0).toLocaleString()}
                          </strong>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </GradientBorder>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}