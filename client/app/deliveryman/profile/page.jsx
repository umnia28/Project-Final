"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Phone, CalendarDays, Wallet, PackageCheck } from "lucide-react";

const API = "http://localhost:5000";

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
};

export default function DeliverymanProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [extra, setExtra] = useState({
    joining_date: "",
    salary: 0,
    total_orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/deliveryman/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setForm({
          username: res.data.user?.username || "",
          email: res.data.user?.email || "",
          full_name: res.data.user?.full_name || "",
          contact_no: res.data.user?.contact_no || "",
          gender: res.data.user?.gender || "",
        });

        setExtra({
          joining_date: res.data.user?.joining_date || "",
          salary: res.data.user?.salary || 0,
          total_orders: res.data.user?.total_orders || 0,
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile");
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

      await axios.put(`${API}/api/deliveryman/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="rounded-[28px] border border-[#d9e9fb] bg-white/70 px-8 py-6 text-slate-600 shadow-[0_12px_35px_rgba(160,180,220,0.16)] backdrop-blur-md">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(221,214,254,0.28),_transparent_22%),linear-gradient(to_bottom,_#fffdf9,_#f7fbff,_#faf7ff)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 rounded-[30px] bg-gradient-to-r from-[#f4dec2] via-[#ddd6fe] to-[#bae6fd] p-[2px] shadow-[0_18px_45px_rgba(181,190,222,0.22)]">
          <div className="rounded-[30px] bg-white/75 px-6 py-7 backdrop-blur-md md:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and update delivery account information.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-8">
          <div className="rounded-[28px] bg-gradient-to-r from-[#fff1db] via-[#f8f3ff] to-[#eef8ff] p-[2px] shadow-[0_12px_32px_rgba(170,180,210,0.14)]">
            <div className="rounded-[28px] bg-white/80 px-5 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3e2] text-[#9a6b2f]">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Joining Date</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {extra.joining_date
                      ? new Date(extra.joining_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-r from-[#eef8ff] via-[#f8f3ff] to-[#fff1db] p-[2px] shadow-[0_12px_32px_rgba(170,180,210,0.14)]">
            <div className="rounded-[28px] bg-white/80 px-5 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Salary</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    ৳ {Number(extra.salary || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-r from-[#eefcf4] via-[#f8f3ff] to-[#eef8ff] p-[2px] shadow-[0_12px_32px_rgba(170,180,210,0.14)]">
            <div className="rounded-[28px] bg-white/80 px-5 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Delivered Orders</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {extra.total_orders}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-white/70 bg-white/75 p-5 shadow-[0_16px_40px_rgba(170,180,210,0.16)] backdrop-blur-md md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <User className="h-4 w-4 text-[#7a5db4]" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-[18px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] px-4 py-3 text-slate-700 outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#ddd6fe]"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Mail className="h-4 w-4 text-sky-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-[18px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] px-4 py-3 text-slate-700 outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#ddd6fe]"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <User className="h-4 w-4 text-[#9a6b2f]" />
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full rounded-[18px] border border-[#eadfcf] bg-gradient-to-r from-[#fff7ec] via-white to-[#f8f3ff] px-4 py-3 text-slate-700 outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#ddd6fe]"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Phone className="h-4 w-4 text-emerald-500" />
                Contact No
              </label>
              <input
                type="text"
                name="contact_no"
                value={form.contact_no}
                onChange={handleChange}
                className="w-full rounded-[18px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] px-4 py-3 text-slate-700 outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#ddd6fe]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-[18px] border border-[#d9e9fb] bg-gradient-to-r from-[#eef8ff] via-white to-[#f8f3ff] px-4 py-3 text-slate-700 outline-none transition focus:border-[#a78bfa] focus:ring-2 focus:ring-[#ddd6fe]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f4dec2] via-[#c4b5fd] to-[#7dd3fc] px-6 py-3 text-sm font-semibold text-slate-800 shadow-[0_12px_28px_rgba(167,139,250,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}