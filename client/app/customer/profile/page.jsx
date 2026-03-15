"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
};

export default function CustomerProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/customer/profile", {
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
      } catch (err) {
        console.error("Profile fetch error:", err);
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

      await axios.put("http://localhost:5000/api/customer/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading profile...</div>;

  return (
    <div className="text-white max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

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