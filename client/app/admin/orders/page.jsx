'use client';

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

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

  const loadOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load admin orders");

    setOrdersRaw(data.orders || []);
  };

  const loadDeliveryMen = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/orders/delivery-men`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
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
    return ordersRaw.map((o) => ({
      ...o,
      selectedDeliveryManId:
        selectedDeliveryMan[o.order_id] ??
        (o.delivery_man_id ? String(o.delivery_man_id) : ""),
    }));
  }, [ordersRaw, selectedDeliveryMan]);

  const handleAssign = async (orderId) => {
    const delivery_man_id = selectedDeliveryMan[orderId];

    if (!delivery_man_id) {
      toast.error("Please select a delivery man");
      return;
    }

    try {
      setBusy(`assign-${orderId}`, true);

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

      const data = await res.json();
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

      const data = await res.json();
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

      const res = await fetch(`${API}/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
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
    <div className="text-slate-700">
      <h1 className="text-2xl font-semibold">Admin Orders</h1>
      <p className="text-slate-500 mt-2">
        Manage all orders, assign delivery men, cancel, and refund.
      </p>

      {loading ? (
        <p className="text-slate-500 mt-6">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-slate-500 mt-6">No orders found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.order_id} className="border rounded-xl p-4 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{o.order_id}</p>
                  <p className="text-xs text-slate-500">
                    {o.date_added ? new Date(o.date_added).toLocaleString() : ""}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: {o.customer_full_name || o.customer_username || "N/A"}
                    {o.customer_email ? ` (${o.customer_email})` : ""}
                  </p>
                </div>

                <div className="text-sm text-slate-600 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-slate-100 capitalize">
                    {o.latest_status || "placed"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100">
                    {o.payment_status || "pending"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100">
                    ৳{Number(o.total_price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Shipping Address</p>
                  <p className="text-sm text-slate-600">{o.shipping_address || "N/A"}</p>
                  <p className="text-sm text-slate-500">
                    {[o.city, o.shipping_state, o.zip_code, o.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Assigned Delivery Man</p>
                  <p className="text-sm text-slate-600">
                    {o.delivery_man_full_name || o.delivery_man_username || "Not assigned"}
                  </p>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <select
                      value={o.selectedDeliveryManId}
                      onChange={(e) =>
                        setSelectedDeliveryMan((prev) => ({
                          ...prev,
                          [o.order_id]: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-3 py-2 text-sm w-full"
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
                      className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60"
                    >
                      {actionLoading[`assign-${o.order_id}`]
                        ? "Saving..."
                        : o.delivery_man_id
                        ? "Reassign"
                        : "Assign"}
                    </button>
                  </div>
                </div>
              </div>

              {o.items?.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="text-left py-2">Product</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map((l) => (
                        <tr key={l.order_item_id} className="border-t">
                          <td className="py-2">
                            {l.product_name}
                            {l.product_id ? ` (#${l.product_id})` : ""}
                          </td>
                          <td className="py-2 text-center">{l.qty}</td>
                          <td className="py-2 text-center">
                            ৳{Number(l.price || 0).toLocaleString()}
                          </td>
                          <td className="py-2 text-center">
                            ৳{Number(l.discount_amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCancel(o.order_id)}
                  disabled={!!actionLoading[`cancel-${o.order_id}`]}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {actionLoading[`cancel-${o.order_id}`] ? "Cancelling..." : "Cancel Order"}
                </button>

                <button
                  onClick={() => handleRefund(o.order_id)}
                  disabled={!!actionLoading[`refund-${o.order_id}`]}
                  className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  {actionLoading[`refund-${o.order_id}`] ? "Refunding..." : "Refund Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}