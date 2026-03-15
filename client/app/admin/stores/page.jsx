"use client";

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
}