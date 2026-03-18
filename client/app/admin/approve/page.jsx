// 'use client'

// import { useEffect, useState } from "react"
// import Loading from "@/components/Loading"
// import toast from "react-hot-toast"

// const API = "http://localhost:5000"

// export default function AdminApprove() {
//   const [sellers, setSellers] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchSellers = async () => {
//     try {
//       setLoading(true)

//       const token = localStorage.getItem("token")
//       if (!token) throw new Error("Please login first")

//       const res = await fetch(`${API}/api/admin/sellers/pending`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to load pending applications")
//       }

//       setSellers(data.sellers || [])
//     } catch (err) {
//       setSellers([])
//       toast.error(err.message || "Failed to load pending applications")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleApprove = async ({ userId, status }) => {
//     const token = localStorage.getItem("token")
//     if (!token) throw new Error("Please login first")

//     const endpoint =
//       status === "approved"
//         ? `${API}/api/admin/sellers/${userId}/approve`
//         : `${API}/api/admin/sellers/${userId}/reject`

//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       throw new Error(data.message || `Failed to ${status} seller`)
//     }

//     setSellers((prev) => prev.filter((seller) => seller.user_id !== userId))

//     return data.message || `Seller ${status} successfully`
//   }

//   useEffect(() => {
//     fetchSellers()
//   }, [])

//   return !loading ? (
//     <div className="text-slate-500 mb-28">
//       <h1 className="text-2xl">
//         Approve <span className="text-slate-800 font-medium">Sellers</span>
//       </h1>

//       {sellers.length ? (
//         <div className="flex flex-col gap-4 mt-4">
//           {sellers.map((seller) => (
//             <div
//               key={seller.user_id}
//               className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
//             >
//               <div className="flex-1">
//                 <h2 className="text-lg font-semibold text-slate-800">
//                   {seller.business_name}
//                 </h2>

//                 <div className="mt-2 space-y-1 text-sm text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-700">Username:</span>{" "}
//                     {seller.username}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-700">Email:</span>{" "}
//                     {seller.email}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-700">Status:</span>{" "}
//                     {seller.kyc_status}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-700">Applied:</span>{" "}
//                     {new Date(seller.created_at).toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-2 flex-wrap">
//                 <button
//                   onClick={() =>
//                     toast.promise(
//                       handleApprove({
//                         userId: seller.user_id,
//                         status: "approved",
//                       }),
//                       {
//                         loading: "Approving...",
//                         success: (msg) => msg || "Seller approved ✅",
//                         error: (err) => err.message || "Approval failed",
//                       }
//                     )
//                   }
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
//                 >
//                   Approve
//                 </button>

//                 <button
//                   onClick={() =>
//                     toast.promise(
//                       handleApprove({
//                         userId: seller.user_id,
//                         status: "rejected",
//                       }),
//                       {
//                         loading: "Rejecting...",
//                         success: (msg) => msg || "Seller rejected",
//                         error: (err) => err.message || "Rejection failed",
//                       }
//                     )
//                   }
//                   className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-80">
//           <h1 className="text-3xl text-slate-400 font-medium">
//             No Application Pending
//           </h1>
//         </div>
//       )}
//     </div>
//   ) : (
//     <Loading />
//   )
// }

'use client'

import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"

const API = "http://localhost:5000"

export default function AdminApprove() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellers = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) throw new Error("Please login first")

      const res = await fetch(`${API}/api/admin/sellers/pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load pending applications")
      }

      setSellers(data.sellers || [])
    } catch (err) {
      setSellers([])
      toast.error(err.message || "Failed to load pending applications")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async ({ userId, status }) => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Please login first")

    const endpoint =
      status === "approved"
        ? `${API}/api/admin/sellers/${userId}/approve`
        : `${API}/api/admin/sellers/${userId}/reject`

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `Failed to ${status} seller`)
    }

    setSellers((prev) => prev.filter((seller) => seller.user_id !== userId))

    return data.message || `Seller ${status} successfully`
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  return !loading ? (
    <div className="mb-28 text-slate-600">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-700">
          Approve{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
            Sellers
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review seller applications in a softer pastel admin theme.
        </p>
      </div>

      {sellers.length ? (
        <div className="flex flex-col gap-5 mt-4">
          {sellers.map((seller) => (
            <div
              key={seller.user_id}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-[#ffe5ec] via-[#f3e8ff] to-[#dbeafe] p-[1px] shadow-[0_10px_30px_rgba(180,160,255,0.15)] max-w-4xl"
            >
              <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 flex max-md:flex-col gap-4 md:items-end">
                <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-pink-200/30 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-sky-200/30 blur-3xl" />

                <div className="relative flex-1">
                  <h2 className="text-xl font-semibold text-slate-700">
                    {seller.business_name}
                  </h2>

                  <div className="mt-3 grid gap-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-700">
                        Username:
                      </span>{" "}
                      {seller.username}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Email:
                      </span>{" "}
                      {seller.email}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Status:
                      </span>{" "}
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600">
                        {seller.kyc_status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Applied:
                      </span>{" "}
                      {new Date(seller.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-3 pt-2 flex-wrap">
                  <button
                    onClick={() =>
                      toast.promise(
                        handleApprove({
                          userId: seller.user_id,
                          status: "approved",
                        }),
                        {
                          loading: "Approving...",
                          success: (msg) => msg || "Seller approved ✅",
                          error: (err) => err.message || "Approval failed",
                        }
                      )
                    }
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 bg-gradient-to-r from-[#fbe4d8] via-[#e9d5ff] to-[#bfdbfe] shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      toast.promise(
                        handleApprove({
                          userId: seller.user_id,
                          status: "rejected",
                        }),
                        {
                          loading: "Rejecting...",
                          success: (msg) => msg || "Seller rejected",
                          error: (err) => err.message || "Rejection failed",
                        }
                      )
                    }
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 bg-gradient-to-r from-[#f8d7da] via-[#f5e6c8] to-[#ddd6fe] shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-80 items-center justify-center rounded-3xl border border-dashed border-purple-200 bg-gradient-to-r from-[#fff1f2] via-[#faf5ff] to-[#eff6ff]">
          <h1 className="text-3xl font-medium text-slate-400">
            No Application Pending
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  )
}