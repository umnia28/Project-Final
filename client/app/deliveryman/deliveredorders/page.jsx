"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Package, CheckCircle2, Wallet, MapPin, BadgeInfo } from "lucide-react";

const API = "http://localhost:5000";

const deliveredBadgeClass =
  "bg-emerald-100 text-emerald-700 border-emerald-200";

export default function DeliverymanDeliveredOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error("Delivered orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deliveredOrders = useMemo(() => {
    return orders
      .map((order) => {
        const deliveredItems = (order.items || []).filter(
          (item) => item.delivery_status === "delivered"
        );

        return {
          ...order,
          deliveredItems,
        };
      })
      .filter((order) => order.deliveredItems.length > 0);
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="rounded-[28px] border border-[#d9e9fb] bg-white/70 px-8 py-6 text-slate-600 shadow-[0_12px_35px_rgba(160,180,220,0.16)] backdrop-blur-md">
          Loading delivered orders...
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
              Delivered Orders
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View orders that have already been delivered successfully.
            </p>
          </div>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="rounded-[28px] border border-[#d9e9fb] bg-white/75 p-8 text-slate-500 shadow-[0_12px_35px_rgba(160,180,220,0.14)] backdrop-blur-md">
            No delivered orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {deliveredOrders.map((order) => (
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

                    <div className="mt-4 space-y-2">
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

                      {order.delivery_time && (
                        <p className="text-sm text-slate-500">
                          Delivered at: {new Date(order.delivery_time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {(order.shipping_address ||
                      order.city ||
                      order.shipping_state ||
                      order.zip_code ||
                      order.country) && (
                      <div className="rounded-[24px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] p-4 text-sm text-slate-600">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                          <MapPin className="h-4 w-4 text-sky-500" />
                          Delivery Address
                        </div>
                        {order.shipping_address && <p>{order.shipping_address}</p>}
                        {order.city && <p>{order.city}</p>}
                        {order.shipping_state && <p>{order.shipping_state}</p>}
                        {order.zip_code && <p>{order.zip_code}</p>}
                        {order.country && <p>{order.country}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {order.deliveredItems.map((item) => (
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
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${deliveredBadgeClass}`}
                            >
                              <BadgeInfo className="h-3.5 w-3.5" />
                              {item.delivery_status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}