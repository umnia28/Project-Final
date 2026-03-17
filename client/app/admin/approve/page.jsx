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
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Approve <span className="text-slate-800 font-medium">Sellers</span>
      </h1>

      {sellers.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {sellers.map((seller) => (
            <div
              key={seller.user_id}
              className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">
                  {seller.business_name}
                </h2>

                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-700">Username:</span>{" "}
                    {seller.username}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Email:</span>{" "}
                    {seller.email}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Status:</span>{" "}
                    {seller.kyc_status}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Applied:</span>{" "}
                    {new Date(seller.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2 flex-wrap">
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
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
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
                  className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            No Application Pending
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  )
}