/*'use client';
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    promo_name: "",
    promo_discount: "",
    promo_status: "inactive",
  });

  const load = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/promos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    setPromos(data.promos || []);
  };

  useEffect(() => { load().catch(()=>{}); }, []);

  const createPromo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/promos`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({
        promo_name: form.promo_name,
        promo_discount: Number(form.promo_discount),
        promo_status: form.promo_status,
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create failed");
    toast.success("Promo created ✅");
    setForm({ promo_name:"", promo_discount:"", promo_status:"inactive" });
    await load();
  };

  const setStatus = async (promo_id, promo_status) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/promos/${promo_id}/status`, {
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({ promo_status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");
    toast.success("Updated ✅");
    await load();
  };

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Promos</h1>

        <form onSubmit={(e)=>toast.promise(createPromo(e),{loading:"Creating..."})} className="border rounded-xl p-4 grid gap-3">
          <p className="font-medium">Create Promo</p>
          <input className="border p-2 rounded" placeholder="Promo name"
            value={form.promo_name} onChange={e=>setForm({...form,promo_name:e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Discount amount"
            value={form.promo_discount} onChange={e=>setForm({...form,promo_discount:e.target.value})} required />
          <select className="border p-2 rounded"
            value={form.promo_status} onChange={e=>setForm({...form,promo_status:e.target.value})}>
            <option value="inactive">inactive</option>
            <option value="active">active</option>
          </select>
          <button className="bg-slate-800 text-white py-2 rounded">Create</button>
        </form>

        <div className="space-y-3">
          {promos.map(p => (
            <div key={p.promo_id} className="border rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.promo_name}</p>
                <p className="text-sm text-slate-500">
                  Discount: ৳{Number(p.promo_discount).toLocaleString()} • Status: {p.promo_status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={()=>toast.promise(setStatus(p.promo_id,"active"),{loading:"Updating..."})}
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Activate
                </button>
                <button
                  onClick={()=>toast.promise(setStatus(p.promo_id,"inactive"),{loading:"Updating..."})}
                  className="px-3 py-1 rounded bg-slate-600 text-white"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireRole>
  );
}
  */
 'use client';
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import toast from "react-hot-toast";
import {
  BadgePercentIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TicketPercentIcon,
  CircleCheckBigIcon,
  CircleOffIcon,
} from "lucide-react";

const API = "http://localhost:5000";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    promo_name: "",
    promo_discount: "",
    promo_status: "inactive",
  });

  const load = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/promos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load promos");
    setPromos(data.promos || []);
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch((e) => toast.error(e.message || "Failed to load promos"))
      .finally(() => setLoading(false));
  }, []);

  const createPromo = async (e) => {
    e.preventDefault();

    const promo_name = form.promo_name.trim();
    const promo_discount = Number(form.promo_discount);

    if (!promo_name) {
      throw new Error("Promo name is required");
    }

    if (!Number.isFinite(promo_discount) || promo_discount <= 0) {
      throw new Error("Discount must be a valid positive number");
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/promos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        promo_name,
        promo_discount,
        promo_status: form.promo_status,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create failed");

    toast.success("Promo created ✅");
    setForm({
      promo_name: "",
      promo_discount: "",
      promo_status: "inactive",
    });

    await load();
  };

  const setStatus = async (promo_id, promo_status, currentStatus) => {
    if (promo_status === currentStatus) {
      toast("Promo already in that status");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/admin/promos/${promo_id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ promo_status }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    toast.success("Updated ✅");
    await load();
  };

  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
            <div className="bg-white rounded-3xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 px-4 py-2 text-sm text-slate-600">
                  <ShieldCheckIcon size={16} />
                  Promo Management
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
                  Promo <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Campaigns</span>
                </h1>

                <p className="mt-2 text-slate-500 max-w-2xl leading-7">
                  
                </p>
              </div>

              <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
                <div className="rounded-2xl bg-white/70 p-3">
                  <TicketPercentIcon size={28} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Promos</p>
                  <p className="text-2xl font-bold text-slate-800">{promos.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Form */}
          <form
            onSubmit={(e) =>
              toast.promise(createPromo(e), {
                loading: "Creating promo...",
              })
            }
            className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-3">
                <BadgePercentIcon size={22} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Create Promo</h2>
                <p className="text-sm text-slate-500">
                  Add a new promotion and control whether it starts as active or inactive.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm text-slate-500 mb-2">Promo Name</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-pink-200"
                  placeholder="Enter promo name"
                  value={form.promo_name}
                  onChange={(e) =>
                    setForm({ ...form, promo_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm text-slate-500 mb-2">Discount Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter discount amount"
                  value={form.promo_discount}
                  onChange={(e) =>
                    setForm({ ...form, promo_discount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm text-slate-500 mb-2">Initial Status</label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-orange-200"
                  value={form.promo_status}
                  onChange={(e) =>
                    setForm({ ...form, promo_status: e.target.value })
                  }
                >
                  <option value="inactive">inactive</option>
                  <option value="active">active</option>
                </select>
              </div>
            </div>

            <button className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold shadow-md hover:opacity-90 transition">
              Create Promo
            </button>
          </form>

          {/* Promo List */}
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-slate-500 shadow-sm">
                Loading promos...
              </div>
            ) : promos.length === 0 ? (
              <div className="rounded-3xl bg-white border border-dashed border-slate-300 shadow-sm min-h-[260px] flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 mb-4">
                    <TicketPercentIcon size={32} className="text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-700">No Promos Available</h2>
                  <p className="text-slate-400 mt-2">
                    Create your first promo campaign to start offering discounts.
                  </p>
                </div>
              </div>
            ) : (
              promos.map((p) => {
                const isActive = p.promo_status === "active";

                return (
                  <div
                    key={p.promo_id}
                    className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-300 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-slate-800">
                          {p.promo_name}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.promo_status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-2">
                        Discount:{" "}
                        <span className="font-medium text-slate-700">
                          ৳{Number(p.promo_discount || 0).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          toast.promise(
                            setStatus(p.promo_id, "active", p.promo_status),
                            { loading: "Updating..." }
                          )
                        }
                        disabled={isActive}
                        className={`px-4 py-2.5 rounded-xl text-white font-medium transition ${
                          isActive
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <CircleCheckBigIcon size={16} />
                          Activate
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          toast.promise(
                            setStatus(p.promo_id, "inactive", p.promo_status),
                            { loading: "Updating..." }
                          )
                        }
                        disabled={!isActive}
                        className={`px-4 py-2.5 rounded-xl text-white font-medium transition ${
                          !isActive
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-slate-600 hover:bg-slate-700"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <CircleOffIcon size={16} />
                          Deactivate
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
