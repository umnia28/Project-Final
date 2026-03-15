'use client';

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
    <div className="min-h-[70vh] mx-6">
      {loading ? (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
          <h1 className="text-2xl sm:text-4xl font-semibold">Loading orders...</h1>
        </div>
      ) : orders.length > 0 ? (
        <div className="my-20 max-w-7xl mx-auto">
          <PageTitle
            heading="My Orders"
            text={`Showing total ${orders.length} orders`}
            linkText={"Go to home"}
          />

          <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
            <thead>
              <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                <th className="text-left">Product</th>
                <th className="text-center">Total Price</th>
                <th className="text-left">Address</th>
                <th className="text-left">Status</th>
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
      ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
          <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
        </div>
      )}
    </div>
  );
}


// 'use client'
// import PageTitle from "@/components/PageTitle"
// import { useEffect, useState } from "react";
// import OrderItem from "@/components/OrderItem";
// import { orderDummyData } from "@/assets/assets";

// export default function Orders() {

//     const [orders, setOrders] = useState([]);

//     useEffect(() => {
//         setOrders(orderDummyData)
//     }, []);

//     return (
//         <div className="min-h-[70vh] mx-6">
//             {orders.length > 0 ? (
//                 (
//                     <div className="my-20 max-w-7xl mx-auto">
//                         <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

//                         <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
//                             <thead>
//                                 <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
//                                     <th className="text-left">Product</th>
//                                     <th className="text-center">Total Price</th>
//                                     <th className="text-left">Address</th>
//                                     <th className="text-left">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {orders.map((order) => (
//                                     <OrderItem order={order} key={order.id} />
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )
//             ) : (
//                 <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
//                     <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
//                 </div>
//             )}
//         </div>
//     )
// }
