'use client';

import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  StoreIcon,
  UserIcon,
  MailIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

const API = "http://localhost:5000";

export default function AdminSellerApprovals() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/sellers/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    console.log("PENDING SELLERS RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to load pending sellers");
    }

    setSellers(Array.isArray(data.sellers) ? data.sellers : []);
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const safeSellers = Array.isArray(sellers) ? sellers : [];

  const approve = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/sellers/${userId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Approve failed");

    toast.success("Approved ✅");
    setSellers((prev) =>
      Array.isArray(prev) ? prev.filter((s) => s.user_id !== userId) : []
    );
  };

  const reject = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/sellers/${userId}/reject`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Reject failed");

    toast.success("Rejected ✅");
    setSellers((prev) =>
      Array.isArray(prev) ? prev.filter((s) => s.user_id !== userId) : []
    );
  };

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.42),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.40),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
            <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 py-8 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
                  <ShieldCheckIcon size={16} />
                  Seller Approval Control
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                  Seller{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                    Approvals
                  </span>
                </h1>

                <p className="mt-2 text-slate-500">
                  Approve or reject pending seller applications.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                  <StoreIcon size={28} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pending Sellers</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {safeSellers.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-8 text-slate-500 shadow-sm">
              Loading...
            </div>
          ) : safeSellers.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[#d8dbe7] bg-white/85 backdrop-blur-md min-h-[220px] flex items-center justify-center shadow-sm">
              <div className="text-center px-6">
                <div className="mx-auto mb-4 w-fit rounded-2xl bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
                  <CheckCircle2Icon size={30} className="text-violet-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-700">
                  No Pending Requests
                </h2>
                <p className="mt-2 text-slate-400">Everything is up to date.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {safeSellers.map((s) => (
                <div
                  key={s.user_id}
                  className="rounded-[28px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 md:p-6 shadow-[0_10px_35px_rgba(180,160,255,0.08)] hover:shadow-[0_18px_50px_rgba(180,160,255,0.14)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-[#f5f3ff] p-2">
                          <StoreIcon size={18} className="text-violet-600" />
                        </div>
                        <p className="text-xl font-semibold text-slate-800">
                          {s.business_name}
                        </p>
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-500">
                        <p className="flex items-center gap-2">
                          <UserIcon size={15} className="text-slate-400" />
                          <span className="text-slate-700 font-medium">
                            {s.username}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <MailIcon size={15} className="text-slate-400" />
                          <span>{s.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          toast.promise(approve(s.user_id), {
                            loading: "Approving...",
                          })
                        }
                        className="px-4 py-2.5 rounded-xl font-medium transition bg-gradient-to-r from-[#dbeafe] to-[#c4b5fd] text-slate-700 hover:opacity-90"
                      >
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2Icon size={16} />
                          Approve
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          toast.promise(reject(s.user_id), {
                            loading: "Rejecting...",
                          })
                        }
                        className="px-4 py-2.5 rounded-xl font-medium transition bg-gradient-to-r from-[#f5f3ff] to-[#f5f5dc] text-slate-700 hover:opacity-90"
                      >
                        <span className="inline-flex items-center gap-2">
                          <XCircleIcon size={16} />
                          Reject
                        </span>
                      </button>
                    </div>
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

// 'use client';

// import { useEffect, useState } from "react";
// import RequireRole from "@/components/RequireRole";
// import toast from "react-hot-toast";

// const API = "http://localhost:5000";

// export default function AdminSellerApprovals() {
//   const [loading, setLoading] = useState(true);
//   const [sellers, setSellers] = useState([]); // ✅ always array

//   const load = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch(`${API}/api/admin/sellers/pending`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();

//     // ✅ Helpful debug (remove later)
//     console.log("PENDING SELLERS RESPONSE:", data);

//     if (!res.ok) {
//       throw new Error(data.message || "Failed to load pending sellers");
//     }

//     // ✅ GUARANTEE array
//     setSellers(Array.isArray(data.sellers) ? data.sellers : []);
//   };

//   useEffect(() => {
//     setLoading(true);
//     load()
//       .catch((e) => toast.error(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   // ✅ ALWAYS use safe array in UI
//   const safeSellers = Array.isArray(sellers) ? sellers : [];

//   const approve = async (userId) => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API}/api/admin/sellers/${userId}/approve`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Approve failed");

//     toast.success("Approved ✅");
//     setSellers((prev) => (Array.isArray(prev) ? prev.filter((s) => s.user_id !== userId) : []));
//   };

//   const reject = async (userId) => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API}/api/admin/sellers/${userId}/reject`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Reject failed");

//     toast.success("Rejected ✅");
//     setSellers((prev) => (Array.isArray(prev) ? prev.filter((s) => s.user_id !== userId) : []));
//   };

//   return (
//     <RequireRole allowedRoles={["admin"]}>
//       <div className="p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-semibold text-slate-800">Seller Approvals</h1>
//         <p className="text-slate-500 mt-1">Approve or reject pending seller applications.</p>

//         {loading ? (
//           <p className="mt-6 text-slate-500">Loading...</p>
//         ) : safeSellers.length === 0 ? (
//           <p className="mt-6 text-slate-500">No pending requests ✅</p>
//         ) : (
//           <div className="mt-6 space-y-3">
//             {safeSellers.map((s) => (
//               <div
//                 key={s.user_id}
//                 className="border rounded-xl p-4 flex items-center justify-between"
//               >
//                 <div>
//                   <p className="font-medium text-slate-800">{s.business_name}</p>
//                   <p className="text-sm text-slate-500">
//                     {s.username} • {s.email}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => toast.promise(approve(s.user_id), { loading: "Approving..." })}
//                     className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => toast.promise(reject(s.user_id), { loading: "Rejecting..." })}
//                     className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </RequireRole>
//   );
// }
