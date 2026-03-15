"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      alert("Message sent successfully!");
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm">Your Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm">Message</label>
            <textarea
              required
              rows="5"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-800 pt-6 text-zinc-400 space-y-1">
          <p>Email: support@charisatelier.com</p>
          <p>Phone: +880 1700 000000</p>
          <p>Address: Dhaka, Bangladesh</p>
        </div>
      </div>
    </div>
  );
}