/*"use client";

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
  */
 "use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import {
  StoreIcon,
  UserCircle2Icon,
  MailIcon,
  PhoneIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  StarIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

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

  const infoCards = [
    {
      title: "Business Name",
      value: form.business_name || "N/A",
      icon: StoreIcon,
    },
    {
      title: "KYC Status",
      value: form.kyc_status || "N/A",
      icon: ShieldCheckIcon,
    },
    {
      title: "Rating",
      value: form.rating_avg || 0,
      icon: StarIcon,
    },
    {
      title: "Approved At",
      value: extra.approved_at
        ? new Date(extra.approved_at).toLocaleDateString()
        : "N/A",
      icon: CalendarDaysIcon,
    },
    {
      title: "Account Status",
      value: extra.status || "N/A",
      icon: BadgeCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
          <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <StoreIcon size={16} />
                Seller Account
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mt-2">
                Seller Profile
              </h1>

              <p className="text-slate-500 mt-1">
                
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
              <UserCircle2Icon size={36} className="text-purple-500" />
              <div>
                <p className="font-semibold text-slate-700">
                  {form.full_name || form.username}
                </p>
                <p className="text-sm text-slate-500">{form.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white shadow-md border border-slate-200 p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <p>{card.title}</p>
                <card.icon size={18} />
              </div>

              <p className="text-xl font-semibold text-slate-800 mt-3 break-words">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-slate-500">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Contact No</label>
              <input
                type="text"
                name="contact_no"
                value={form.contact_no}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-500">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}