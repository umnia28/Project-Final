"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const emptyAddress = {
  city: "",
  address: "",
  shipping_state: "",
  zip_code: "",
  country: "Bangladesh",
  visibility_status: true,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/customer/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("Fetch addresses error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/customer/addresses/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/customer/addresses", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }

      await fetchAddresses();
      resetForm();
    } catch (err) {
      console.error("Save address error:", err);
      alert(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr) => {
    setForm({
      city: addr.city || "",
      address: addr.address || "",
      shipping_state: addr.shipping_state || "",
      zip_code: addr.zip_code || "",
      country: addr.country || "Bangladesh",
      visibility_status:
        typeof addr.visibility_status === "boolean"
          ? addr.visibility_status
          : true,
    });
    setEditingId(addr.address_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/customer/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setAddresses((prev) => prev.filter((addr) => addr.address_id !== id));

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Delete address error:", err);
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Loading addresses...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>

      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street Address"
            required
            className="p-3 bg-zinc-800 rounded border border-zinc-700 outline-none"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="p-3 bg-zinc-800 rounded border border-zinc-700 outline-none"
          />

          <input
            name="shipping_state"
            value={form.shipping_state}
            onChange={handleChange}
            placeholder="State / Area"
            className="p-3 bg-zinc-800 rounded border border-zinc-700 outline-none"
          />

          <input
            name="zip_code"
            value={form.zip_code}
            onChange={handleChange}
            placeholder="Zip Code"
            className="p-3 bg-zinc-800 rounded border border-zinc-700 outline-none"
          />

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="p-3 bg-zinc-800 rounded border border-zinc-700 outline-none"
          />

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="visibility_status"
              checked={form.visibility_status}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Visible / Active
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-pink-600 rounded font-semibold hover:bg-pink-700 transition disabled:opacity-60"
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Address"
                : "Add Address"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-zinc-400">
            No addresses found.
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.address_id}
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{addr.address}</p>
                  {addr.city && <p className="text-zinc-300">{addr.city}</p>}
                  {addr.shipping_state && (
                    <p className="text-zinc-300">{addr.shipping_state}</p>
                  )}
                  {addr.zip_code && (
                    <p className="text-zinc-300">{addr.zip_code}</p>
                  )}
                  {addr.country && (
                    <p className="text-zinc-300">{addr.country}</p>
                  )}
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    addr.visibility_status
                      ? "bg-green-600/20 text-green-400"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {addr.visibility_status ? "Visible" : "Hidden"}
                </span>
              </div>

              <p className="text-xs text-zinc-500 mt-3">
                Added: {new Date(addr.created_at).toLocaleString()}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(addr)}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(addr.address_id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}