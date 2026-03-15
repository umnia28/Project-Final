"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
  business_name: "",
  kyc_status: "",
  rating_avg: "",
};

export default function SellerProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [extra, setExtra] = useState({
    approved_at: "",
    created_at: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/seller/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const user = res.data.user || {};

        setForm({
          username: user.username || "",
          email: user.email || "",
          full_name: user.full_name || "",
          contact_no: user.contact_no || "",
          gender: user.gender || "",
          business_name: user.business_name || "",
          kyc_status: user.kyc_status || "",
          rating_avg: user.rating_avg || "",
        });

        setExtra({
          approved_at: user.approved_at || "",
          created_at: user.created_at || "",
          status: user.status || "",
        });
      } catch (err) {
        console.error("Seller profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5000/api/seller/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Seller profile update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="text-white max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Profile</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <p className="text-zinc-400 text-sm">Business Name</p>
          <p className="mt-1">{form.business_name || "N/A"}</p>
        </div>

        <div>
          <p className="text-zinc-400 text-sm">KYC Status</p>
          <p className="mt-1">{form.kyc_status || "N/A"}</p>
        </div>

        <div>
          <p className="text-zinc-400 text-sm">Rating</p>
          <p className="mt-1">{form.rating_avg || 0}</p>
        </div>

        <div>
          <p className="text-zinc-400 text-sm">Approved At</p>
          <p className="mt-1">
            {extra.approved_at ? new Date(extra.approved_at).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-zinc-400 text-sm">Account Status</p>
          <p className="mt-1">{extra.status || "N/A"}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block mb-2 text-sm text-zinc-400">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">Contact No</label>
          <input
            type="text"
            name="contact_no"
            value={form.contact_no}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition font-semibold"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}