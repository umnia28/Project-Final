"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliverymanSalaryPage() {
  const [data, setData] = useState({
    salary: 0,
    joining_date: "",
    total_orders: 0,
    full_name: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/deliveryman/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData({
          salary: res.data.user?.salary || 0,
          joining_date: res.data.user?.joining_date || "",
          total_orders: res.data.user?.total_orders || 0,
          full_name: res.data.user?.full_name || "",
          username: res.data.user?.username || "",
        });
      } catch (err) {
        console.error("Salary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryInfo();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading salary info...</div>;
  }

  return (
    <div className="text-white max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Salary</h1>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Delivery Man</p>
          <h2 className="text-xl font-semibold mt-2">
            {data.full_name || data.username || "N/A"}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Monthly Salary</p>
          <h2 className="text-3xl font-bold mt-2">৳ {data.salary}</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Joining Date</p>
          <h2 className="text-lg font-semibold mt-2">
            {data.joining_date
              ? new Date(data.joining_date).toLocaleDateString()
              : "N/A"}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Total Delivered Orders</p>
          <h2 className="text-3xl font-bold mt-2">{data.total_orders}</h2>
        </div>
      </div>
    </div>
  );
}