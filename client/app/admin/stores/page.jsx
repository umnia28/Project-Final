/*"use client";

import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

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

  return !loading ? (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Live <span className="text-slate-800 font-medium">Stores</span>
      </h1>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              <StoreInfo store={store} />

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <p>{store.store_status === "active" ? "Active" : "Inactive"}</p>

                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(
                        toggleIsActive(store.store_id, store.store_status),
                        {
                          loading: "Updating data...",
                          success:
                            store.store_status === "active"
                              ? "Store set to inactive"
                              : "Store set to active",
                          error: (err) =>
                            err?.response?.data?.message ||
                            "Failed to update store status",
                        }
                      )
                    }
                    checked={store.store_status === "active"}
                  />
                  <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                  <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            No stores Available
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}t
*/
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto text-slate-600">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl mb-8">
          <div className="bg-white rounded-3xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
                <ShieldCheckIcon size={16} />
                Store Management
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                Live <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Stores</span>
              </h1>

              <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                Monitor seller storefronts, review live status, and quickly activate
                or deactivate stores from one elegant admin panel.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
              <div className="rounded-2xl bg-white/70 p-3">
                <StoreIcon size={28} className="text-purple-600" />
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
                  className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300 p-6"
                >
                  <div className="flex max-md:flex-col md:items-center md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <StoreInfo store={store} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 min-w-[230px]">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Store Visibility Status</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <p
                              className={`font-semibold ${
                                isActive ? "text-emerald-600" : "text-slate-600"
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
                          <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:via-purple-500 peer-checked:to-orange-500 transition-all duration-200"></div>
                          <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                        </label>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <SparklesIcon size={14} />
                        
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-dashed border-slate-300 shadow-sm min-h-[320px] flex items-center justify-center">
            <div className="text-center px-6">
              <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 mb-4">
                <StoreIcon size={32} className="text-purple-600" />
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