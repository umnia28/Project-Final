"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgePercent,
  CalendarDays,
  Sparkles,
  Ticket,
  Copy,
} from "lucide-react";

const API = "http://localhost:5000";

export default function PromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromoId, setSelectedPromoId] = useState("");

  const loadPromos = async () => {
    const res = await fetch(`${API}/api/promos`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load promos");
    }

    setPromos(data.promos || []);
  };

  useEffect(() => {
    setLoading(true);
    loadPromos()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedPromo = useMemo(() => {
    return promos.find((p) => String(p.promo_id) === String(selectedPromoId)) || null;
  }, [promos, selectedPromoId]);

  const copyPromoCode = async (code) => {
    try {
      await navigator.clipboard.writeText(String(code));
      toast.success("Promo code copied");
    } catch {
      toast.success(`Promo code: ${code}`);
    }
  };

  const formatDate = (value) => {
    if (!value) return "No expiry";
    return new Date(value).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.22),_transparent_30%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md px-6 py-8 md:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] px-4 py-2 text-sm text-slate-600">
              <Sparkles size={16} />
              Customer Promos
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="rounded-2xl bg-[linear-gradient(90deg,#eff6ff,#f5f3ff,#faf8ef)] p-3">
                <Ticket size={24} className="text-violet-600" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
                  Active{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                    Promo Offers
                  </span>
                </h1>
                <p className="text-slate-500 mt-2">
                  Browse active promotions and copy a promo code for checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-6 shadow-[0_12px_35px_rgba(180,160,255,0.08)]">
          {loading ? (
            <p className="text-slate-500">Loading promos...</p>
          ) : promos.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4 mb-4">
                <BadgePercent size={28} className="text-violet-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-700">No Active Promos</h2>
              <p className="text-slate-400 mt-2">
                There are no active promotions available right now.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select an active promo
                </label>

                <select
                  value={selectedPromoId}
                  onChange={(e) => setSelectedPromoId(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8dbe7] bg-white px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-violet-200"
                >
                  <option value="">Choose a promo</option>
                  {promos.map((promo) => (
                    <option key={promo.promo_id} value={promo.promo_id}>
                      {promo.description} • {promo.discount}% off • Code: {promo.code}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPromo ? (
                <div className="rounded-3xl border border-[#ebe7f5] bg-gradient-to-r from-[#fcfdff] via-[#faf9ff] to-[#faf8ef] p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ff] px-3 py-1.5 text-xs font-medium text-violet-700">
                        <Ticket size={14} />
                        Active Promo
                      </div>

                      <h2 className="text-2xl font-semibold text-slate-800">
                        {selectedPromo.description}
                      </h2>

                      <p className="flex items-center gap-2 text-slate-600">
                        <BadgePercent size={18} className="text-sky-500" />
                        Discount:{" "}
                        <span className="font-semibold text-slate-800">
                          {Number(selectedPromo.discount || 0)}% off
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-slate-600">
                        <CalendarDays size={18} className="text-violet-500" />
                        Valid until:{" "}
                        <span className="font-medium text-slate-800">
                          {formatDate(selectedPromo.promo_end_date)}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#ebe7f5] bg-white/80 p-4 min-w-[220px]">
                      <p className="text-sm text-slate-500 mb-2">Promo Code</p>
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f7ff] px-4 py-3 border border-[#ebe7f5]">
                        <span className="font-semibold text-slate-800">
                          {selectedPromo.code}
                        </span>
                        <button
                          onClick={() => copyPromoCode(selectedPromo.code)}
                          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] px-3 py-1.5 text-sm font-medium text-slate-700 hover:opacity-90"
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8dbe7] p-6 text-slate-400 text-center">
                  Select a promo from the dropdown to view details.
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {promos.map((promo) => (
                  <div
                    key={promo.promo_id}
                    className="rounded-2xl border border-[#ebe7f5] bg-white/80 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          {promo.description}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Code: <span className="font-medium text-slate-700">{promo.code}</span>
                        </p>
                      </div>

                      <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-sm font-semibold text-sky-700">
                        {Number(promo.discount || 0)}% off
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                      Ends: {formatDate(promo.promo_end_date)}
                    </p>

                    <button
                      onClick={() => copyPromoCode(promo.code)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] px-4 py-2 text-sm font-medium text-slate-700 hover:opacity-90"
                    >
                      <Copy size={14} />
                      Copy Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}