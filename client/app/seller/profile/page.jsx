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
  StoreIcon, UserCircle2Icon, MailIcon, PhoneIcon,
  BadgeCheckIcon, CalendarDaysIcon, StarIcon,
  ShieldCheckIcon, SparklesIcon,
} from "lucide-react";

const emptyProfile = { username: "", email: "", full_name: "", contact_no: "", gender: "", business_name: "", kyc_status: "", rating_avg: "" };

function GradientBorder({ children, style = {} }) {
  return (
    <div style={{ padding: 1.5, background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)", borderRadius: 24, ...style }}>
      <div style={{ background: "#fffaf7", borderRadius: 23 }}>{children}</div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, gradFrom, gradTo, border, iconColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
        border: `1px solid ${border}`, borderRadius: 18,
        padding: "18px 20px",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 10px 30px rgba(168,85,247,0.12)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#78716c", fontFamily: "sans-serif", letterSpacing: "0.06em" }}>{title}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: "#fff", border: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={14} color={iconColor} strokeWidth={1.8} />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1c1917", fontFamily: "Georgia,serif", wordBreak: "break-word" }}>
        {value}
      </p>
    </div>
  );
}

export default function SellerProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [extra, setExtra] = useState({ approved_at: "", created_at: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/seller/profile", {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
        const user = res.data.user || {};
        setForm({ username: user.username || "", email: user.email || "", full_name: user.full_name || "", contact_no: user.contact_no || "", gender: user.gender || "", business_name: user.business_name || "", kyc_status: user.kyc_status || "", rating_avg: user.rating_avg || "" });
        setExtra({ approved_at: user.approved_at || "", created_at: user.created_at || "", status: user.status || "" });
      } catch (err) { console.error("Seller profile fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/seller/profile", form, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  const infoCards = [
    { title: "Business Name",  value: form.business_name || "N/A", icon: StoreIcon,         gradFrom: "#fce7f3", gradTo: "#e9d5ff", border: "#f9a8d4", iconColor: "#be185d" },
    { title: "KYC Status",     value: form.kyc_status || "N/A",   icon: ShieldCheckIcon,   gradFrom: "#e9d5ff", gradTo: "#ddd6fe", border: "#c4b5fd", iconColor: "#7c3aed" },
    { title: "Rating",         value: form.rating_avg || "0",      icon: StarIcon,          gradFrom: "#fdf4ff", gradTo: "#fce7f3", border: "#e9d5ff", iconColor: "#a855f7" },
    { title: "Approved At",    value: extra.approved_at ? new Date(extra.approved_at).toLocaleDateString() : "N/A", icon: CalendarDaysIcon, gradFrom: "#fce7f3", gradTo: "#fed7aa", border: "#fdba74", iconColor: "#c2410c" },
    { title: "Account Status", value: extra.status || "N/A",       icon: BadgeCheckIcon,    gradFrom: "#fdf4ff", gradTo: "#e9d5ff", border: "#c4b5fd", iconColor: "#6d28d9" },
  ];

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "1.5px solid #e9d5ff", borderRadius: 13,
    padding: "13px 16px", fontSize: 14,
    fontFamily: "sans-serif", color: "#1c1917",
    background: "#fffaf7", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "44px 24px", fontFamily: "Georgia,serif" }}>
      <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>

        {/* hero */}
        <div style={{ padding: 1.5, background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)", borderRadius: 28, marginBottom: 36 }}>
          <div style={{
            background: "#fffaf7", borderRadius: 27, padding: "36px 44px",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 28,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
                padding: "5px 18px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                borderRadius: 999, fontFamily: "sans-serif",
                fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
              }}>
                <StoreIcon size={11} strokeWidth={2} />
                Seller Account
              </div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>Seller Profile</h1>
              <p style={{ margin: "10px 0 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", lineHeight: 1.75 }}>
                Manage your personal and business information.
              </p>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 22px",
              background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
              borderRadius: 20,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <UserCircle2Icon size={26} color="#fff" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>{form.full_name || form.username}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#a855f7", fontFamily: "sans-serif" }}>{form.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 14, marginBottom: 36 }}>
          {infoCards.map((card) => <InfoCard key={card.title} {...card} />)}
        </div>

        {/* edit form */}
        <GradientBorder>
          <div style={{ padding: "36px 36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1c1917" }}>Edit Profile</h2>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)" }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { name: "username",   label: "Username",   type: "text"  },
                  { name: "email",      label: "Email",      type: "email" },
                  { name: "full_name",  label: "Full Name",  type: "text"  },
                  { name: "contact_no", label: "Contact No", type: "text"  },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label style={{ display: "block", fontSize: 11, fontFamily: "sans-serif", color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>
                      {label}
                    </label>
                    <input
                      type={type} name={name}
                      value={form[name]} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#c084fc"; e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)"; }}
                      onBlur={e  => { e.target.style.borderColor = "#e9d5ff"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 11, fontFamily: "sans-serif", color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>
                    Gender
                  </label>
                  <select
                    name="gender" value={form.gender} onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={e => { e.target.style.borderColor = "#c084fc"; e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)"; }}
                    onBlur={e  => { e.target.style.borderColor = "#e9d5ff"; e.target.style.boxShadow = "none"; }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "13px 32px",
                    background: saved
                      ? "linear-gradient(135deg,#a855f7,#6d28d9)"
                      : "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                    color: "#fff", border: "none", borderRadius: 13,
                    fontFamily: "sans-serif", fontSize: 14, fontWeight: 500,
                    letterSpacing: "0.05em", cursor: saving ? "default" : "pointer",
                    transition: "opacity 0.2s, background 0.4s",
                    opacity: saving ? 0.75 : 1,
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {saved ? "✦ Profile Updated" : saving ? "Saving…" : "Update Profile"}
                </button>

                {saved && (
                  <span style={{ fontSize: 13, color: "#a855f7", fontFamily: "sans-serif" }}>
                    Changes saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>
        </GradientBorder>
      </div>
    </div>
  );
}