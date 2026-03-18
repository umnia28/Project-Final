'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import OrderTimeline from "@/components/OrderTimeline";
import { PackageSearch, Sparkles } from "lucide-react";

const API = "http://localhost:5000";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.orderId;

  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/orders/${orderId}/timeline`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load timeline");
    setTimeline(data.timeline || []);
  };

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    loadTimeline()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.22),_transparent_30%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 py-8 md:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
              <Sparkles size={16} />
              Order Tracking
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="rounded-2xl bg-[linear-gradient(90deg,#eff6ff,#f5f3ff,#faf8ef)] p-3">
                <PackageSearch size={24} className="text-violet-600" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
                  Order{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                    #{orderId}
                  </span>
                </h1>
                <p className="text-slate-500 mt-2">
                  Track status updates and progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-6 shadow-[0_12px_35px_rgba(180,160,255,0.08)]">
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <OrderTimeline timeline={timeline} />
          )}
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useParams } from "next/navigation";
// import OrderTimeline from "@/components/OrderTimeline";

// const API = "http://localhost:5000";

// export default function OrderTrackingPage() {
//   const params = useParams();
//   const orderId = params?.orderId;

//   const [loading, setLoading] = useState(true);
//   const [timeline, setTimeline] = useState([]);

//   const loadTimeline = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API}/api/orders/${orderId}/timeline`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to load timeline");
//     setTimeline(data.timeline || []);
//   };

//   useEffect(() => {
//     if (!orderId) return;
//     setLoading(true);
//     loadTimeline().catch((e) => toast.error(e.message)).finally(() => setLoading(false));
//   }, [orderId]);

//   return (
//     <div className="max-w-4xl mx-auto p-6 text-slate-700">
//       <h1 className="text-2xl font-semibold">Order #{orderId}</h1>
//       <p className="text-slate-500 mt-2">Track status updates and progress.</p>

//       {loading ? (
//         <p className="text-slate-500 mt-6">Loading...</p>
//       ) : (
//         <OrderTimeline timeline={timeline} />
//       )}
//     </div>
//   );
// }
