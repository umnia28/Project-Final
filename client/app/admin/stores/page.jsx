"use client";

import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { StoreIcon, SparklesIcon, ShieldCheckIcon } from "lucide-react";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Fetch stores error:", err);
      toast.error(err.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const toggleIsActive = async (storeId, currentStatus) => {
    const token = localStorage.getItem("token");
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const res = await axios.patch(
      `http://localhost:5000/api/admin/stores/${storeId}/status`,
      {
        store_status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    setStores((prev) =>
      prev.map((store) =>
        store.store_id === storeId
          ? { ...store, store_status: newStatus }
          : store
      )
    );

    return res.data;
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.42),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.40),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto text-slate-600">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)] mb-8">
          <div className="bg-white/85 backdrop-blur-md rounded-3xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
                <ShieldCheckIcon size={16} />
                Store Management
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                Live{" "}
                <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                  Stores
                </span>
              </h1>

              <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                Manage store visibility and monitor which stores are currently active on the platform.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
              <div className="rounded-2xl bg-white/80 p-3">
                <StoreIcon size={28} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Visible Stores</p>
                <p className="text-2xl font-bold text-slate-800">{stores.length}</p>
              </div>
            </div>
          </div>
        </div>

        {stores.length ? (
          <div className="flex flex-col gap-5">
            {stores.map((store) => {
              const isActive = store.store_status === "active";

              return (
                <div
                  key={store.store_id}
                  className="rounded-[28px] bg-white/85 backdrop-blur-md border border-[#ebe7f5] shadow-[0_10px_35px_rgba(180,160,255,0.08)] hover:shadow-[0_18px_50px_rgba(180,160,255,0.14)] transition-all duration-300 p-6"
                >
                  <div className="flex max-md:flex-col md:items-center md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <StoreInfo store={store} />
                    </div>

                    <div className="rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#fcfdff] via-[#f8f6ff] to-[#faf8ef] px-5 py-4 min-w-[230px]">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Store Visibility Status</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${
                                isActive ? "bg-sky-500" : "bg-slate-400"
                              }`}
                            />
                            <p
                              className={`font-semibold ${
                                isActive ? "text-sky-600" : "text-slate-600"
                              }`}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={() =>
                              toast.promise(
                                toggleIsActive(store.store_id, store.store_status),
                                {
                                  loading: "Updating data...",
                                  success: isActive
                                    ? "Store set to inactive"
                                    : "Store set to active",
                                  error: (err) =>
                                    err?.response?.data?.message ||
                                    "Failed to update store status",
                                }
                              )
                            }
                            checked={isActive}
                          />
                          <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#dbeafe] peer-checked:via-[#c4b5fd] peer-checked:to-[#f5f5dc] transition-all duration-200"></div>
                          <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                        </label>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <SparklesIcon size={14} />
                        Visibility changes update the store status instantly.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-dashed border-[#d8dbe7] shadow-sm min-h-[320px] flex items-center justify-center">
            <div className="text-center px-6">
              <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4 mb-4">
                <StoreIcon size={32} className="text-violet-600" />
              </div>
              <h1 className="text-3xl text-slate-700 font-semibold">
                No Stores Available
              </h1>
              <p className="text-slate-400 mt-2">
                There are currently no stores to display in the admin panel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import StoreInfo from "@/components/admin/StoreInfo";
// import Loading from "@/components/Loading";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { StoreIcon, SparklesIcon, ShieldCheckIcon } from "lucide-react";

// export default function AdminStores() {
//   const [stores, setStores] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchStores = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get("http://localhost:5000/api/admin/stores", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setStores(res.data.stores || []);
//     } catch (err) {
//       console.error("Fetch stores error:", err);
//       toast.error(err.response?.data?.message || "Failed to load stores");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleIsActive = async (storeId, currentStatus) => {
//     const token = localStorage.getItem("token");
//     const newStatus = currentStatus === "active" ? "inactive" : "active";

//     const res = await axios.patch(
//       `http://localhost:5000/api/admin/stores/${storeId}/status`,
//       {
//         store_status: newStatus,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );

//     setStores((prev) =>
//       prev.map((store) =>
//         store.store_id === storeId
//           ? { ...store, store_status: newStatus }
//           : store
//       )
//     );

//     return res.data;
//   };

//   useEffect(() => {
//     fetchStores();
//   }, []);

//   if (loading) return <Loading />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
//       <div className="max-w-6xl mx-auto text-slate-600">
//         {/* Header */}
//         <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl mb-8">
//           <div className="bg-white rounded-3xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
//                 <ShieldCheckIcon size={16} />
//                 Store Management
//               </div>

//               <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
//                 Live <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Stores</span>
//               </h1>

//               <p className="mt-2 text-slate-500 max-w-2xl leading-7">
//               </p>
//             </div>

//             <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
//               <div className="rounded-2xl bg-white/70 p-3">
//                 <StoreIcon size={28} className="text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Total Visible Stores</p>
//                 <p className="text-2xl font-bold text-slate-800">{stores.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {stores.length ? (
//           <div className="flex flex-col gap-5">
//             {stores.map((store) => {
//               const isActive = store.store_status === "active";

//               return (
//                 <div
//                   key={store.store_id}
//                   className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300 p-6"
//                 >
//                   <div className="flex max-md:flex-col md:items-center md:justify-between gap-6">
//                     <div className="flex-1 min-w-0">
//                       <StoreInfo store={store} />
//                     </div>

//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 min-w-[230px]">
//                       <div className="flex items-center justify-between gap-4">
//                         <div>
//                           <p className="text-sm text-slate-500">Store Visibility Status</p>
//                           <div className="mt-2 flex items-center gap-2">
//                             <span
//                               className={`inline-block h-2.5 w-2.5 rounded-full ${
//                                 isActive ? "bg-emerald-500" : "bg-slate-400"
//                               }`}
//                             />
//                             <p
//                               className={`font-semibold ${
//                                 isActive ? "text-emerald-600" : "text-slate-600"
//                               }`}
//                             >
//                               {isActive ? "Active" : "Inactive"}
//                             </p>
//                           </div>
//                         </div>

//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             onChange={() =>
//                               toast.promise(
//                                 toggleIsActive(store.store_id, store.store_status),
//                                 {
//                                   loading: "Updating data...",
//                                   success: isActive
//                                     ? "Store set to inactive"
//                                     : "Store set to active",
//                                   error: (err) =>
//                                     err?.response?.data?.message ||
//                                     "Failed to update store status",
//                                 }
//                               )
//                             }
//                             checked={isActive}
//                           />
//                           <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:via-purple-500 peer-checked:to-orange-500 transition-all duration-200"></div>
//                           <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
//                         </label>
//                       </div>

//                       <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
//                         <SparklesIcon size={14} />
                        
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="rounded-3xl bg-white border border-dashed border-slate-300 shadow-sm min-h-[320px] flex items-center justify-center">
//             <div className="text-center px-6">
//               <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 mb-4">
//                 <StoreIcon size={32} className="text-purple-600" />
//               </div>
//               <h1 className="text-3xl text-slate-700 font-semibold">
//                 No Stores Available
//               </h1>
//               <p className="text-slate-400 mt-2">
//                 There are currently no stores to display in the admin panel.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }