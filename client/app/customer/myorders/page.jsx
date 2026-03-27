
/*'use client';

import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OrderItem from "@/components/OrderItem";

const API = "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const token = localStorage.getItem("token");

    const ordersRes = await fetch(`${API}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ordersData = await ordersRes.json();

    if (!ordersRes.ok) {
      throw new Error(ordersData.message || "Failed to load orders");
    }

    const detailedOrders = await Promise.all(
      (ordersData.orders || []).map(async (order) => {
        const res = await fetch(`${API}/api/orders/${order.order_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Failed to load order ${order.order_id}`);
        }

        return {
          ...order,
          ...(data.order || {}),
          items: data.items || [],
          timeline: data.timeline || [],
          tracker: data.tracker || null,
        };
      })
    );

    setOrders(detailedOrders);
  };

  useEffect(() => {
    setLoading(true);
    loadOrders()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.35),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(221,214,254,0.28),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.26),_transparent_24%),linear-gradient(to_bottom,_#fbfcff,_#f8fbff,_#faf7ff)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 left-[-80px] h-56 w-56 rounded-full bg-sky-200/20 blur-3xl" />
        <div className="absolute top-28 right-[-60px] h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-100/20 blur-3xl" />
      </div>

      {loading ? (
        <div className="relative min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/60 bg-white/75 backdrop-blur-2xl px-8 py-12 text-center shadow-[0_24px_80px_rgba(167,139,219,0.12)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dbeafe,#ede9fe,#f5f5dc)] shadow-inner">
              <div className="h-8 w-8 rounded-full border-[3px] border-white/70 border-t-sky-500 animate-spin" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-[linear-gradient(90deg,#475569,#7c3aed,#0ea5e9)] bg-clip-text text-transparent">
              Curating your orders...
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Gathering your purchases, delivery details, and order timeline.
            </p>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="relative mx-auto my-10 max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_80px_rgba(148,163,184,0.14)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(219,234,254,0.28),rgba(233,213,255,0.18),rgba(245,245,220,0.16))]" />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#7dd3fc,#c4b5fd,#e7d3a7)]" />

            <div className="relative px-6 py-8 md:px-8 lg:px-10">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <PageTitle
                    heading="My Orders"
                    text={`An overview of your ${orders.length} order${orders.length > 1 ? "s" : ""}`}
                    linkText={"Go to home"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:min-w-[360px]">
                  <div className="group rounded-[1.5rem] border border-white/60 bg-white/65 px-5 py-5 shadow-[0_10px_30px_rgba(125,211,252,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                      Total Orders
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-800">
                      {orders.length}
                    </p>
                    <div className="mt-3 h-1.5 w-20 rounded-full bg-[linear-gradient(90deg,#bae6fd,#c4b5fd)]" />
                  </div>

                  <div className="group rounded-[1.5rem] border border-white/60 bg-white/65 px-5 py-5 shadow-[0_10px_30px_rgba(167,139,250,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700/80">
                      Experience
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Your order history with status, address, and price details in one view.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/60 bg-white/72 backdrop-blur-2xl shadow-[0_24px_80px_rgba(148,163,184,0.12)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.20),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(233,213,255,0.16),transparent_35%)]" />

            <div className="relative border-b border-white/50 px-6 py-6 md:px-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                  Order Gallery
                </h2>
                <p className="max-w-2xl text-sm text-slate-500">
                  Explore your placed orders with a softer, refined layout designed to make tracking and reviewing purchases feel cleaner and more premium.
                </p>
              </div>
            </div>

            <div className="relative overflow-x-auto px-4 py-5 md:px-6 md:py-6">
              <table className="w-full min-w-[920px] table-auto border-separate border-spacing-y-6 border-spacing-x-4 text-slate-600">
                <thead>
                  <tr className="max-md:hidden">
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Product
                    </th>
                    <th className="px-3 pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Total Price
                    </th>
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Address
                    </th>
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <OrderItem
                      order={order}
                      key={order.order_id}
                      onReload={loadOrders}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 backdrop-blur-2xl px-8 py-14 text-center shadow-[0_24px_80px_rgba(148,163,184,0.10)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dbeafe,#ede9fe,#f5f5dc)] shadow-[inset_0_2px_12px_rgba(255,255,255,0.7)]">
              <span className="text-3xl">🛍️</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight bg-[linear-gradient(90deg,#64748b,#8b5cf6,#0ea5e9)] bg-clip-text text-transparent">
              No orders yet
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-7 text-slate-500">
              Your order history will appear here once you place your first purchase. When it does, this space will transform into your personal collection of order details and delivery updates.
            </p>

            <div className="mx-auto mt-6 h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,#bae6fd,#ddd6fe,#e7d3a7)]" />
          </div>
        </div>
      )}
    </div>
  );
}
  */

'use client';

import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OrderItem from "@/components/OrderItem";
import { Sparkles, Receipt, ArrowUpRight } from "lucide-react";

const API = "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const token = localStorage.getItem("token");

    const ordersRes = await fetch(`${API}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ordersData = await ordersRes.json();

    if (!ordersRes.ok) {
      throw new Error(ordersData.message || "Failed to load orders");
    }

    const detailedOrders = await Promise.all(
      (ordersData.orders || []).map(async (order) => {
        const res = await fetch(`${API}/api/orders/${order.order_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Failed to load order ${order.order_id}`);
        }

        return {
          ...order,
          ...(data.order || {}),
          items: data.items || [],
          timeline: data.timeline || [],
          tracker: data.tracker || null,
        };
      })
    );

    setOrders(detailedOrders);
  };

  useEffect(() => {
    setLoading(true);
    loadOrders()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), radial-gradient(circle at bottom center, rgba(249,115,22,0.08), transparent 25%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 left-[-80px] h-56 w-56 rounded-full blur-3xl"
          style={{ background: "rgba(244,114,182,0.16)" }}
        />
        <div
          className="absolute top-24 right-[-60px] h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(168,85,247,0.14)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "rgba(251,146,60,0.10)" }}
        />
      </div>

      {loading ? (
        <div className="relative min-h-[80vh] flex items-center justify-center">
          <div
            className="w-full max-w-xl rounded-[2rem] px-8 py-12 text-center"
            style={{
              border: "1px solid rgba(255,255,255,0.82)",
              background: "rgba(255,255,255,0.76)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(168,85,247,0.10)",
            }}
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full shadow-inner"
              style={{
                background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
              }}
            >
              <div
                className="h-8 w-8 rounded-full border-[3px] border-white/70 animate-spin"
                style={{ borderTopColor: "#a855f7" }}
              />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-semibold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg,#be185d,#7c3aed,#ea580c)",
                fontFamily: "Georgia, serif",
              }}
            >
              Curating your orders...
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Gathering your purchases, delivery details, and order timeline.
            </p>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="relative mx-auto my-10 max-w-7xl">
          <div
            className="relative overflow-hidden rounded-[2rem]"
            style={{
              border: "1px solid rgba(255,255,255,0.86)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,250,247,0.80))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(168,85,247,0.10)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(252,231,243,0.30), rgba(237,233,254,0.22), rgba(255,237,213,0.20))",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg,#f9a8d4,#c4b5fd,#fdba74)",
              }}
            />

            <div className="relative px-6 py-8 md:px-8 lg:px-10">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                      color: "#7c3aed",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    <Sparkles size={13} />
                    Order Gallery
                  </div>

                  <PageTitle
                    heading="My Orders"
                    text={`An overview of your ${orders.length} order${orders.length > 1 ? "s" : ""}`}
                    linkText={"Go to home"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:min-w-[380px]">
                  <div
                    className="group rounded-[1.5rem] px-5 py-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: "1px solid rgba(249,168,212,0.35)",
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(14px)",
                      boxShadow: "0 12px 32px rgba(236,72,153,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-700/80">
                        Total Orders
                      </p>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                        style={{
                          background: "rgba(255,255,255,0.90)",
                          border: "1px solid rgba(249,168,212,0.35)",
                        }}
                      >
                        <Receipt size={17} className="text-rose-600" />
                      </div>
                    </div>

                    <p
                      className="mt-3 text-3xl font-semibold"
                      style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
                    >
                      {orders.length}
                    </p>

                    <div
                      className="mt-3 h-1.5 w-20 rounded-full"
                      style={{
                        background: "linear-gradient(90deg,#f9a8d4,#c4b5fd)",
                      }}
                    />
                  </div>

                  <div
                    className="group rounded-[1.5rem] px-5 py-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: "1px solid rgba(196,181,253,0.40)",
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(14px)",
                      boxShadow: "0 12px 32px rgba(168,85,247,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700/80">
                        Experience
                      </p>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                        style={{
                          background: "rgba(255,255,255,0.90)",
                          border: "1px solid rgba(196,181,253,0.40)",
                        }}
                      >
                        <ArrowUpRight size={17} className="text-violet-600" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Your order history with status, address, and price details in one view.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative mt-8 overflow-hidden rounded-[2rem]"
            style={{
              border: "1px solid rgba(255,255,255,0.86)",
              background: "rgba(255,255,255,0.76)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(168,85,247,0.08)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at top, rgba(252,231,243,0.20), transparent 40%), radial-gradient(circle at bottom right, rgba(237,233,254,0.18), transparent 35%)",
              }}
            />

            <div
              className="relative px-6 py-6 md:px-8"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.65)" }}
            >
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
                >
                  Order Gallery
                </h2>
                <p className="max-w-2xl text-sm text-slate-500">
                  Explore your placed orders with a softer, refined layout designed to make tracking and reviewing purchases feel cleaner and more premium.
                </p>
              </div>
            </div>

            <div className="relative overflow-x-auto px-4 py-5 md:px-6 md:py-6">
              <table className="w-full min-w-[920px] table-auto border-separate border-spacing-y-6 border-spacing-x-4 text-slate-600">
                <thead>
                  <tr className="max-md:hidden">
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Product
                    </th>
                    <th className="px-3 pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Total Price
                    </th>
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Address
                    </th>
                    <th className="px-3 pb-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <OrderItem
                      order={order}
                      key={order.order_id}
                      onReload={loadOrders}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-[80vh] flex items-center justify-center">
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] px-8 py-14 text-center"
            style={{
              border: "1px solid rgba(255,255,255,0.86)",
              background: "rgba(255,255,255,0.76)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(168,85,247,0.08)",
            }}
          >
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                boxShadow: "inset 0 2px 12px rgba(255,255,255,0.7)",
              }}
            >
              <span className="text-3xl">🛍️</span>
            </div>

            <h1
              className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg,#be185d,#7c3aed,#ea580c)",
                fontFamily: "Georgia, serif",
              }}
            >
              No orders yet
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-7 text-slate-500">
              Your order history will appear here once you place your first purchase. When it does, this space will transform into your personal collection of order details and delivery updates.
            </p>

            <div
              className="mx-auto mt-6 h-1.5 w-28 rounded-full"
              style={{
                background: "linear-gradient(90deg,#f9a8d4,#c4b5fd,#fdba74)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import PageTitle from "@/components/PageTitle";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import OrderItem from "@/components/OrderItem";

// const API = "http://localhost:5000";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadOrders = async () => {
//     const token = localStorage.getItem("token");

//     const ordersRes = await fetch(`${API}/api/orders`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const ordersData = await ordersRes.json();

//     if (!ordersRes.ok) {
//       throw new Error(ordersData.message || "Failed to load orders");
//     }

//     const detailedOrders = await Promise.all(
//       (ordersData.orders || []).map(async (order) => {
//         const res = await fetch(`${API}/api/orders/${order.order_id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || `Failed to load order ${order.order_id}`);
//         }

//         return {
//           ...order,
//           items: data.items || [],
//           timeline: data.timeline || [],
//           tracker: data.tracker || null,
//         };
//       })
//     );

//     setOrders(detailedOrders);
//   };

//   useEffect(() => {
//     setLoading(true);
//     loadOrders()
//       .catch((e) => toast.error(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.22),_transparent_30%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] px-4 py-8">
//       {loading ? (
//         <div className="min-h-[80vh] flex items-center justify-center">
//           <div className="rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md px-8 py-10 text-slate-500 shadow-[0_12px_35px_rgba(180,160,255,0.08)]">
//             <h1 className="text-2xl sm:text-4xl font-semibold">Loading orders...</h1>
//           </div>
//         </div>
//       ) : orders.length > 0 ? (
//         <div className="my-12 max-w-7xl mx-auto">
//           <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)] mb-8">
//             <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 py-8 md:px-8">
//               <PageTitle
//                 heading="Orders"
//                 text={`Showing total ${orders.length} orders`}
//                 linkText={"Go to home"}
//               />
//             </div>
//           </div>

//           <div className="rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-4 md:p-6 shadow-[0_12px_35px_rgba(180,160,255,0.08)]">
//             <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-8 border-spacing-x-4">
//               <thead>
//                 <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
//                   <th className="text-left">Product</th>
//                   <th className="text-center">Total Price</th>
//                   <th className="text-left">Address</th>
//                   <th className="text-left">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <OrderItem
//                     order={order}
//                     key={order.order_id}
//                     onReload={loadOrders}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="min-h-[80vh] flex items-center justify-center">
//           <div className="rounded-3xl border border-dashed border-[#d8dbe7] bg-white/85 backdrop-blur-md px-8 py-10 text-slate-400 shadow-sm">
//             <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // 'use client';

// // import PageTitle from "@/components/PageTitle";
// // import { useEffect, useState } from "react";
// // import toast from "react-hot-toast";
// // import OrderItem from "@/components/OrderItem";

// // const API = "http://localhost:5000";

// // export default function Orders() {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const loadOrders = async () => {
// //     const token = localStorage.getItem("token");

// //     const ordersRes = await fetch(`${API}/api/orders`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });

// //     const ordersData = await ordersRes.json();

// //     if (!ordersRes.ok) {
// //       throw new Error(ordersData.message || "Failed to load orders");
// //     }

// //     const detailedOrders = await Promise.all(
// //       (ordersData.orders || []).map(async (order) => {
// //         const res = await fetch(`${API}/api/orders/${order.order_id}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         const data = await res.json();

// //         if (!res.ok) {
// //           throw new Error(data.message || `Failed to load order ${order.order_id}`);
// //         }

// //         return {
// //           ...order,
// //           items: data.items || [],
// //           timeline: data.timeline || [],
// //           tracker: data.tracker || null,
// //         };
// //       })
// //     );

// //     setOrders(detailedOrders);
// //   };

// //   useEffect(() => {
// //     setLoading(true);
// //     loadOrders()
// //       .catch((e) => toast.error(e.message))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   return (
// //     <div className="min-h-[70vh] mx-6">
// //       {loading ? (
// //         <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
// //           <h1 className="text-2xl sm:text-4xl font-semibold">Loading orders...</h1>
// //         </div>
// //       ) : orders.length > 0 ? (
// //         <div className="my-20 max-w-7xl mx-auto">
// //           <PageTitle
// //             heading="My Orders"
// //             text={`Showing total ${orders.length} orders`}
// //             linkText={"Go to home"}
// //           />

// //           <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
// //             <thead>
// //               <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
// //                 <th className="text-left">Product</th>
// //                 <th className="text-center">Total Price</th>
// //                 <th className="text-left">Address</th>
// //                 <th className="text-left">Status</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {orders.map((order) => (
// //                 <OrderItem
// //                   order={order}
// //                   key={order.order_id}
// //                   onReload={loadOrders}
// //                 />
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       ) : (
// //         <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
// //           <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }