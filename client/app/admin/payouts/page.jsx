"use client";

import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import Loading from "@/components/Loading";
import {
  CircleDollarSignIcon,
  WalletIcon,
  StoreIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  BadgeDollarSignIcon,
} from "lucide-react";

export default function AdminPayoutsPage() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [preview, setPreview] = useState({
    unpaid_items: 0,
    pending_amount: 0,
    seller_id: null,
    store_name: "",
  });
  const [payouts, setPayouts] = useState([]);
  const [creating, setCreating] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const [payForm, setPayForm] = useState({
    method: "",
    reference_no: "",
  });

  const API = "http://localhost:5000/api";

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const fetchStores = async () => {
    try {
      const token = getToken();

      const res = await fetch(`${API}/admin/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setStores(data.stores || data.data || []);
      } else {
        console.error("Failed to load stores:", data);
      }
    } catch (err) {
      console.error("Store fetch failed", err);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const token = getToken();

      const res = await fetch(`${API}/payouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPayouts(data.payouts || data.data || []);
      } else {
        console.error("Failed to load payouts:", data);
      }
    } catch (err) {
      console.error("Payout history fetch failed", err);
    }
  };

  const fetchPreview = async (storeId) => {
    if (!storeId) return;

    try {
      const token = getToken();

      const res = await fetch(`${API}/payouts/preview/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPreview({
          unpaid_items: Number(data.unpaid_items || 0),
          pending_amount: Number(data.pending_amount || 0),
          seller_id: data.seller_id || null,
          store_name: data.store_name || "",
        });
      } else {
        console.error("Preview fetch failed:", data);
        setPreview({
          unpaid_items: 0,
          pending_amount: 0,
          seller_id: null,
          store_name: "",
        });
      }
    } catch (err) {
      console.error("Preview fetch failed", err);
    }
  };

  const handleCreatePayout = async () => {
    if (!selectedStore) {
      alert("Please select a store first.");
      return;
    }

    if (preview.unpaid_items <= 0) {
      alert("No payout-eligible delivered items found for this store.");
      return;
    }

    try {
      setCreating(true);
      const token = getToken();

      const res = await fetch(`${API}/payouts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          store_id: Number(selectedStore),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create payout");
        return;
      }

      alert("Payout created successfully");
      await fetchPreview(selectedStore);
      await fetchPayoutHistory();
    } catch (err) {
      console.error("Create payout failed", err);
      alert("Create payout failed");
    } finally {
      setCreating(false);
    }
  };

  const handleMarkPaid = async (payoutId) => {
    if (!payForm.method || !payForm.reference_no) {
      alert("Please enter payment method and reference number.");
      return;
    }

    try {
      setPayingId(payoutId);
      const token = getToken();

      const res = await fetch(`${API}/payouts/${payoutId}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: payForm.method,
          reference_no: payForm.reference_no,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to mark payout as paid");
        return;
      }

      alert("Payout marked as paid");
      setPayForm({ method: "", reference_no: "" });
      await fetchPayoutHistory();
      if (selectedStore) await fetchPreview(selectedStore);
    } catch (err) {
      console.error("Mark paid failed", err);
      alert("Mark paid failed");
    } finally {
      setPayingId(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchStores(), fetchPayoutHistory()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchPreview(selectedStore);
    } else {
      setPreview({
        unpaid_items: 0,
        pending_amount: 0,
        seller_id: null,
        store_name: "",
      });
    }
  }, [selectedStore]);

  if (loading) return <Loading />;

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.42),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.40),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-4 md:p-6">
        <div className="mx-auto max-w-7xl text-slate-600">
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
            <div className="flex flex-col gap-6 rounded-3xl bg-white/85 backdrop-blur-md px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
                  <ShieldCheckIcon size={16} />
                  Admin Payout Control
                </div>

                <h1 className="mt-4 text-3xl font-bold text-slate-800 md:text-4xl">
                  Admin{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                    Payouts
                  </span>
                </h1>

                <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                  Manage seller payout creation and mark completed payouts safely.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                  <BadgeDollarSignIcon size={28} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Payout Records</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {payouts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-[24px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(180,160,255,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Selected Store Pending</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-800">
                    {currency}
                    {Number(preview.pending_amount || 0).toLocaleString()}
                  </h2>
                </div>
                <WalletIcon className="h-11 w-11 rounded-full bg-[#eff6ff] p-2.5 text-sky-600" />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(180,160,255,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Eligible Delivered Items</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-800">
                    {preview.unpaid_items}
                  </h2>
                </div>
                <CircleDollarSignIcon className="h-11 w-11 rounded-full bg-[#f5f3ff] p-2.5 text-violet-600" />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(180,160,255,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Selected Store</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-800">
                    {preview.store_name || "None"}
                  </h2>
                </div>
                <StoreIcon className="h-11 w-11 rounded-full bg-[#faf8ef] p-2.5 text-amber-700" />
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-[28px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-6 shadow-[0_10px_35px_rgba(180,160,255,0.08)] md:p-7">
            <h2 className="mb-5 text-xl font-semibold text-slate-800">
              Create Payout
            </h2>

            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
              <div className="w-full md:w-96">
                <label className="mb-2 block text-sm text-slate-600">
                  Select Store
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
                >
                  <option value="">Choose store</option>
                  {stores.map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                      {store.store_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreatePayout}
                disabled={creating || !selectedStore || preview.unpaid_items <= 0}
                className="rounded-xl bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] px-5 py-3 text-slate-700 transition hover:opacity-90 disabled:opacity-50 font-medium shadow-sm"
              >
                {creating ? "Creating..." : "Create Payout"}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Only delivered, non-cancelled, non-refunded items are included in payout.
            </p>
          </div>

          <div className="mb-8 rounded-[28px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-6 shadow-[0_10px_35px_rgba(180,160,255,0.08)] md:p-7">
            <h2 className="mb-5 text-xl font-semibold text-slate-800">
              Mark Payout as Paid
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Method (bkash / bank / নগদ)"
                value={payForm.method}
                onChange={(e) =>
                  setPayForm((prev) => ({ ...prev, method: e.target.value }))
                }
                className="rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
              />

              <input
                type="text"
                placeholder="Reference No"
                value={payForm.reference_no}
                onChange={(e) =>
                  setPayForm((prev) => ({
                    ...prev,
                    reference_no: e.target.value,
                  }))
                }
                className="rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-[28px] border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-6 shadow-[0_10px_35px_rgba(180,160,255,0.08)] md:p-7">
            <h2 className="mb-5 text-xl font-semibold text-slate-800">
              Payout History
            </h2>

            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="border-b border-[#ebe7f5] text-left text-slate-600">
                  <th className="py-3 pr-4">Payout ID</th>
                  <th className="py-3 pr-4">Store ID</th>
                  <th className="py-3 pr-4">Seller ID</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Reference</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-10 text-center text-slate-400">
                      No payouts found
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr
                      key={payout.payout_id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-4 pr-4">{payout.payout_id}</td>
                      <td className="py-4 pr-4">{payout.store_id}</td>
                      <td className="py-4 pr-4">{payout.seller_id}</td>
                      <td className="py-4 pr-4">
                        {currency}
                        {Number(payout.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            payout.payout_status === "paid"
                              ? "bg-[#eff6ff] text-sky-700"
                              : "bg-[#f5f3ff] text-violet-700"
                          }`}
                        >
                          {payout.payout_status}
                        </span>
                      </td>
                      <td className="py-4 pr-4">{payout.method || "-"}</td>
                      <td className="py-4 pr-4">{payout.reference_no || "-"}</td>
                      <td className="py-4 pr-4">
                        {payout.payout_date
                          ? new Date(payout.payout_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 pr-4">
                        {payout.payout_status !== "paid" ? (
                          <button
                            onClick={() => handleMarkPaid(payout.payout_id)}
                            disabled={
                              payingId === payout.payout_id ||
                              !payForm.method ||
                              !payForm.reference_no
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#dbeafe] to-[#c4b5fd] px-3 py-2 text-xs text-slate-700 disabled:opacity-50 hover:opacity-90 font-medium"
                          >
                            <CheckCircle2Icon className="h-4 w-4" />
                            {payingId === payout.payout_id
                              ? "Updating..."
                              : "Mark Paid"}
                          </button>
                        ) : (
                          <span className="text-slate-400">Done</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import RequireRole from "@/components/RequireRole";
// import Loading from "@/components/Loading";
// import {
//   CircleDollarSignIcon,
//   WalletIcon,
//   StoreIcon,
//   CheckCircle2Icon,
//   ShieldCheckIcon,
//   BadgeDollarSignIcon,
// } from "lucide-react";

// export default function AdminPayoutsPage() {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

//   const [loading, setLoading] = useState(true);
//   const [stores, setStores] = useState([]);
//   const [selectedStore, setSelectedStore] = useState("");
//   const [preview, setPreview] = useState({
//     unpaid_items: 0,
//     pending_amount: 0,
//     seller_id: null,
//     store_name: "",
//   });
//   const [payouts, setPayouts] = useState([]);
//   const [creating, setCreating] = useState(false);
//   const [payingId, setPayingId] = useState(null);

//   const [payForm, setPayForm] = useState({
//     method: "",
//     reference_no: "",
//   });

//   const API = "http://localhost:5000/api";

//   const getToken = () => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   };

//   const fetchStores = async () => {
//     try {
//       const token = getToken();

//       const res = await fetch(`${API}/admin/stores`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setStores(data.stores || data.data || []);
//       } else {
//         console.error("Failed to load stores:", data);
//       }
//     } catch (err) {
//       console.error("Store fetch failed", err);
//     }
//   };

//   const fetchPayoutHistory = async () => {
//     try {
//       const token = getToken();

//       const res = await fetch(`${API}/payouts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setPayouts(data.payouts || data.data || []);
//       } else {
//         console.error("Failed to load payouts:", data);
//       }
//     } catch (err) {
//       console.error("Payout history fetch failed", err);
//     }
//   };

//   const fetchPreview = async (storeId) => {
//     if (!storeId) return;

//     try {
//       const token = getToken();

//       const res = await fetch(`${API}/payouts/preview/${storeId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setPreview({
//           unpaid_items: Number(data.unpaid_items || 0),
//           pending_amount: Number(data.pending_amount || 0),
//           seller_id: data.seller_id || null,
//           store_name: data.store_name || "",
//         });
//       } else {
//         console.error("Preview fetch failed:", data);
//         setPreview({
//           unpaid_items: 0,
//           pending_amount: 0,
//           seller_id: null,
//           store_name: "",
//         });
//       }
//     } catch (err) {
//       console.error("Preview fetch failed", err);
//     }
//   };

//   const handleCreatePayout = async () => {
//     if (!selectedStore) {
//       alert("Please select a store first.");
//       return;
//     }

//     if (preview.unpaid_items <= 0) {
//       alert("No payout-eligible delivered items found for this store.");
//       return;
//     }

//     try {
//       setCreating(true);
//       const token = getToken();

//       const res = await fetch(`${API}/payouts/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           store_id: Number(selectedStore),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to create payout");
//         return;
//       }

//       alert("Payout created successfully");
//       await fetchPreview(selectedStore);
//       await fetchPayoutHistory();
//     } catch (err) {
//       console.error("Create payout failed", err);
//       alert("Create payout failed");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleMarkPaid = async (payoutId) => {
//     if (!payForm.method || !payForm.reference_no) {
//       alert("Please enter payment method and reference number.");
//       return;
//     }

//     try {
//       setPayingId(payoutId);
//       const token = getToken();

//       const res = await fetch(`${API}/payouts/${payoutId}/pay`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           method: payForm.method,
//           reference_no: payForm.reference_no,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to mark payout as paid");
//         return;
//       }

//       alert("Payout marked as paid");
//       setPayForm({ method: "", reference_no: "" });
//       await fetchPayoutHistory();
//       if (selectedStore) await fetchPreview(selectedStore);
//     } catch (err) {
//       console.error("Mark paid failed", err);
//       alert("Mark paid failed");
//     } finally {
//       setPayingId(null);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await Promise.all([fetchStores(), fetchPayoutHistory()]);
//       setLoading(false);
//     };
//     init();
//   }, []);

//   useEffect(() => {
//     if (selectedStore) {
//       fetchPreview(selectedStore);
//     } else {
//       setPreview({
//         unpaid_items: 0,
//         pending_amount: 0,
//         seller_id: null,
//         store_name: "",
//       });
//     }
//   }, [selectedStore]);

//   if (loading) return <Loading />;

//   return (
//     <RequireRole allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
//         <div className="mx-auto max-w-7xl text-slate-600">
//           <div className="mb-8 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
//             <div className="flex flex-col gap-6 rounded-3xl bg-white px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
//                   <ShieldCheckIcon size={16} />
//                   Admin Payout Control
//                 </div>

//                 <h1 className="mt-4 text-3xl font-bold text-slate-800 md:text-4xl">
//                   Admin{" "}
//                   <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
//                     Payouts
//                   </span>
//                 </h1>

//                 <p className="mt-2 max-w-2xl leading-7 text-slate-500">
//                   Manage seller payout creation and mark completed payouts safely.
//                 </p>
//               </div>

//               <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4">
//                 <div className="rounded-2xl bg-white/70 p-3">
//                   <BadgeDollarSignIcon size={28} className="text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-500">Payout Records</p>
//                   <p className="text-2xl font-bold text-slate-800">
//                     {payouts.length}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
//             <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Selected Store Pending</p>
//                   <h2 className="mt-2 text-2xl font-semibold text-slate-800">
//                     {currency}
//                     {Number(preview.pending_amount || 0).toLocaleString()}
//                   </h2>
//                 </div>
//                 <WalletIcon className="h-11 w-11 rounded-full bg-pink-100 p-2.5 text-pink-600" />
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Eligible Delivered Items</p>
//                   <h2 className="mt-2 text-2xl font-semibold text-slate-800">
//                     {preview.unpaid_items}
//                   </h2>
//                 </div>
//                 <CircleDollarSignIcon className="h-11 w-11 rounded-full bg-purple-100 p-2.5 text-purple-600" />
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Selected Store</p>
//                   <h2 className="mt-2 text-lg font-semibold text-slate-800">
//                     {preview.store_name || "None"}
//                   </h2>
//                 </div>
//                 <StoreIcon className="h-11 w-11 rounded-full bg-orange-100 p-2.5 text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] md:p-7">
//             <h2 className="mb-5 text-xl font-semibold text-slate-800">
//               Create Payout
//             </h2>

//             <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
//               <div className="w-full md:w-96">
//                 <label className="mb-2 block text-sm text-slate-600">
//                   Select Store
//                 </label>
//                 <select
//                   value={selectedStore}
//                   onChange={(e) => setSelectedStore(e.target.value)}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200"
//                 >
//                   <option value="">Choose store</option>
//                   {stores.map((store) => (
//                     <option key={store.store_id} value={store.store_id}>
//                       {store.store_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={handleCreatePayout}
//                 disabled={creating || !selectedStore || preview.unpaid_items <= 0}
//                 className="rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
//               >
//                 {creating ? "Creating..." : "Create Payout"}
//               </button>
//             </div>

//             <p className="mt-3 text-xs text-slate-400">
//               Only delivered, non-cancelled, non-refunded items are included in payout.
//             </p>
//           </div>

//           <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] md:p-7">
//             <h2 className="mb-5 text-xl font-semibold text-slate-800">
//               Mark Payout as Paid
//             </h2>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 placeholder="Method (bkash / bank / নগদ)"
//                 value={payForm.method}
//                 onChange={(e) =>
//                   setPayForm((prev) => ({ ...prev, method: e.target.value }))
//                 }
//                 className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
//               />

//               <input
//                 type="text"
//                 placeholder="Reference No"
//                 value={payForm.reference_no}
//                 onChange={(e) =>
//                   setPayForm((prev) => ({
//                     ...prev,
//                     reference_no: e.target.value,
//                   }))
//                 }
//                 className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] md:p-7">
//             <h2 className="mb-5 text-xl font-semibold text-slate-800">
//               Payout History
//             </h2>

//             <table className="min-w-[900px] w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-200 text-left text-slate-600">
//                   <th className="py-3 pr-4">Payout ID</th>
//                   <th className="py-3 pr-4">Store ID</th>
//                   <th className="py-3 pr-4">Seller ID</th>
//                   <th className="py-3 pr-4">Amount</th>
//                   <th className="py-3 pr-4">Status</th>
//                   <th className="py-3 pr-4">Method</th>
//                   <th className="py-3 pr-4">Reference</th>
//                   <th className="py-3 pr-4">Date</th>
//                   <th className="py-3 pr-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {payouts.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="py-10 text-center text-slate-400">
//                       No payouts found
//                     </td>
//                   </tr>
//                 ) : (
//                   payouts.map((payout) => (
//                     <tr
//                       key={payout.payout_id}
//                       className="border-b border-slate-100"
//                     >
//                       <td className="py-4 pr-4">{payout.payout_id}</td>
//                       <td className="py-4 pr-4">{payout.store_id}</td>
//                       <td className="py-4 pr-4">{payout.seller_id}</td>
//                       <td className="py-4 pr-4">
//                         {currency}
//                         {Number(payout.amount || 0).toLocaleString()}
//                       </td>
//                       <td className="py-4 pr-4">
//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-medium ${
//                             payout.payout_status === "paid"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-yellow-100 text-yellow-700"
//                           }`}
//                         >
//                           {payout.payout_status}
//                         </span>
//                       </td>
//                       <td className="py-4 pr-4">{payout.method || "-"}</td>
//                       <td className="py-4 pr-4">{payout.reference_no || "-"}</td>
//                       <td className="py-4 pr-4">
//                         {payout.payout_date
//                           ? new Date(payout.payout_date).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td className="py-4 pr-4">
//                         {payout.payout_status !== "paid" ? (
//                           <button
//                             onClick={() => handleMarkPaid(payout.payout_id)}
//                             disabled={
//                               payingId === payout.payout_id ||
//                               !payForm.method ||
//                               !payForm.reference_no
//                             }
//                             className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs text-white disabled:opacity-50 hover:bg-blue-700"
//                           >
//                             <CheckCircle2Icon className="h-4 w-4" />
//                             {payingId === payout.payout_id
//                               ? "Updating..."
//                               : "Mark Paid"}
//                           </button>
//                         ) : (
//                           <span className="text-slate-400">Done</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </RequireRole>
//   );
// }