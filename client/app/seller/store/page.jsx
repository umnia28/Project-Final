// 'use client';

// import { useEffect, useState } from "react";
// import RequireRole from "@/components/RequireRole";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Store, Hash, Calendar, Tag, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

// const API = "http://localhost:5000";

// const statusStyles = {
//   active:   { bg: "linear-gradient(135deg,#fce7f3,#fed7aa)", text: "#9a3412", dot: "#f97316" },
//   pending:  { bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", text: "#7e22ce", dot: "#a855f7" },
//   inactive: { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" },
// };

// function StatusBadge({ status }) {
//   const s = statusStyles[status?.toLowerCase()] || statusStyles.inactive;
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 5,
//       background: s.bg, color: s.text,
//       fontSize: 10, fontFamily: "sans-serif", fontWeight: 600,
//       letterSpacing: "0.08em", textTransform: "uppercase",
//       padding: "3px 10px", borderRadius: 999,
//     }}>
//       <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
//       {status}
//     </span>
//   );
// }

// function GradientBorder({ children, style = {} }) {
//   return (
//     <div style={{
//       padding: 1.5,
//       background: "linear-gradient(135deg, #ec4899, #a855f7, #f97316)",
//       borderRadius: 22, ...style,
//     }}>
//       <div style={{ background: "#fffaf7", borderRadius: 21 }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// function StoreCard({ s, isMyStore = false }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <GradientBorder style={{ opacity: hovered ? 1 : 0.85, transition: "opacity 0.3s" }}>
//       <div
//         style={{
//           padding: "26px 26px 20px",
//           fontFamily: "Georgia, serif",
//           transform: hovered ? "translateY(-2px)" : "none",
//           transition: "transform 0.25s",
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {isMyStore && (
//           <div style={{
//             display: "inline-block", marginBottom: 14,
//             background: "linear-gradient(135deg, #ec4899, #a855f7, #f97316)",
//             borderRadius: 999, padding: "3px 14px",
//             fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
//             letterSpacing: "0.12em", color: "#fff", textTransform: "uppercase",
//           }}>
//             ✦ My Store
//           </div>
//         )}

//         <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
//           <div style={{
//             width: 44, height: 44, borderRadius: 13, flexShrink: 0,
//             background: "linear-gradient(135deg, #fce7f3, #e9d5ff, #fed7aa)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <Store size={18} color="#be185d" strokeWidth={1.6} />
//           </div>
//           <div>
//             <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1e1a18", lineHeight: 1.3 }}>
//               {s.store_name}
//             </p>
//             <div style={{ marginTop: 6 }}>
//               <StatusBadge status={s.store_status} />
//             </div>
//           </div>
//         </div>

//         <div style={{ borderTop: "1px solid #f3e8ff", paddingTop: 14, display: "grid", gap: 8, fontFamily: "sans-serif" }}>
//           {[
//             { icon: Hash,     label: "Store ID", value: s.store_id },
//             s.ref_no && { icon: Tag, label: "Ref No", value: s.ref_no },
//             { icon: Calendar, label: "Created",  value: new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
//           ].filter(Boolean).map(({ icon: Icon, label, value }) => (
//             <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Icon size={12} color="#a855f7" strokeWidth={2} style={{ flexShrink: 0 }} />
//               <span style={{ fontSize: 11, color: "#a78bfa", minWidth: 60 }}>{label}</span>
//               <span style={{ fontSize: 12, color: "#3b0764", fontFamily: "monospace" }}>{value}</span>
//             </div>
//           ))}
//         </div>

//         {isMyStore && (
//           <div style={{
//             marginTop: 16, padding: "10px 14px",
//             background: "linear-gradient(135deg, #fdf4ff, #fff7ed)",
//             borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "sans-serif",
//           }}>
//             <ShieldCheck size={13} color="#a855f7" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
//             <p style={{ margin: 0, fontSize: 12, color: "#6b21a8", lineHeight: 1.5 }}>
//               Use this <strong>Store ID</strong> when creating products.
//             </p>
//           </div>
//         )}
//       </div>
//     </GradientBorder>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div style={{ borderRadius: 22, border: "1px solid #f3e8ff", padding: "26px", background: "#fffaf7" }}>
//       {[80, 55, 65, 50].map((w, i) => (
//         <div key={i} style={{
//           height: i === 0 ? 18 : 11, width: `${w}%`,
//           background: "linear-gradient(90deg,#fce7f3 25%,#e9d5ff 50%,#fce7f3 75%)",
//           backgroundSize: "200% 100%",
//           borderRadius: 6, marginBottom: 12,
//           animation: "shimmer 1.6s infinite",
//         }} />
//       ))}
//       <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div style={{ textAlign: "center", padding: "52px 24px", background: "#fffaf7", borderRadius: 22, border: "1.5px dashed #e9d5ff" }}>
//       <div style={{
//         width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px",
//         background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>
//         <Store size={22} color="#be185d" strokeWidth={1.5} />
//       </div>
//       <p style={{ margin: 0, fontSize: 15, color: "#3b0764", fontWeight: 600, fontFamily: "Georgia,serif" }}>No stores yet</p>
//       <p style={{ margin: "6px 0 0", fontSize: 13, color: "#a78bfa", fontFamily: "sans-serif" }}>Stores will appear here once created.</p>
//     </div>
//   );
// }

// export default function SellerStorePage() {
//   const router = useRouter();
//   const [store, setStore] = useState(null);
//   const [stores, setStores] = useState([]);
//   const [form, setForm] = useState({ store_name: "", ref_no: "" });
//   const [loading, setLoading] = useState(true);

//   const loadStores = async () => {
//     const res = await fetch(`${API}/api/seller/stores`);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to load stores");
//     setStores(Array.isArray(data.stores) ? data.stores : []);
//   };

//   const loadMyStore = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API}/api/seller/store`, { headers: { Authorization: `Bearer ${token}` } });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to load store");
//     setStore(data.store);
//   };

//   useEffect(() => {
//     setLoading(true);
//     Promise.allSettled([loadStores(), loadMyStore()]).finally(() => setLoading(false));
//   }, []);

//   const create = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const payload = { store_name: form.store_name.trim(), ref_no: form.ref_no.trim() || null };
//     const res = await fetch(`${API}/api/seller/store`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify(payload),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Create failed");
//     setStore(data.store);
//     await loadStores();
//     router.refresh();
//     return data;
//   };

//   const inputStyle = {
//     width: "100%", boxSizing: "border-box",
//     border: "1.5px solid #e9d5ff", borderRadius: 13,
//     padding: "13px 16px", fontSize: 14,
//     fontFamily: "sans-serif", color: "#1c1917",
//     background: "#fffaf7", outline: "none",
//     transition: "border-color 0.2s, box-shadow 0.2s",
//   };

//   return (
//     <RequireRole allowedRoles={["seller"]}>
//       <div style={{ position: "relative", padding: "52px 24px", maxWidth: 900, margin: "0 auto", fontFamily: "Georgia,serif", overflow: "hidden" }}>

//         {/* glows */}
//         <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//         <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//         <div style={{ position: "fixed", bottom: 0, left: "45%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

//         <div style={{ position: "relative", zIndex: 1 }}>

//           {/* header */}
//           <div style={{ textAlign: "center", marginBottom: 50 }}>
//             <div style={{
//               display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
//               padding: "5px 18px",
//               background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//               borderRadius: 999, fontFamily: "sans-serif",
//               fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
//             }}>
//               <Sparkles size={11} strokeWidth={2} />
//               Seller Portal
//             </div>
//             <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#1c1917", lineHeight: 1.2 }}>
//               Your Storefronts
//             </h1>
//             <p style={{ margin: "10px auto 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 420, lineHeight: 1.75 }}>
//               Manage your atelier stores and track your seller presence.
//             </p>
//           </div>

//           {/* my store */}
//           <div style={{ marginBottom: 52 }}>
//             <SectionHeader title="My Store" count={null} />
//             {loading ? <SkeletonCard /> : store ? (
//               <div style={{ maxWidth: 480 }}><StoreCard s={store} isMyStore /></div>
//             ) : (
//               <CreateStoreForm form={form} setForm={setForm} create={create} inputStyle={inputStyle} />
//             )}
//           </div>

//           {/* all stores */}
//           <div>
//             <SectionHeader title="All Stores" count={!loading ? stores.length : null} />
//             {loading ? (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
//                 <SkeletonCard /><SkeletonCard />
//               </div>
//             ) : stores.length === 0 ? <EmptyState /> : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
//                 {stores.map((s) => <StoreCard key={s.store_id} s={s} />)}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </RequireRole>
//   );
// }

// function SectionHeader({ title, count }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//       <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>{title}</h2>
//       <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)" }} />
//       {count != null && (
//         <span style={{
//           fontFamily: "sans-serif", fontSize: 12, color: "#a855f7",
//           background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", padding: "2px 10px",
//           borderRadius: 999, border: "1px solid #e9d5ff",
//         }}>
//           {count} total
//         </span>
//       )}
//     </div>
//   );
// }

// function CreateStoreForm({ form, setForm, create, inputStyle }) {
//   return (
//     <GradientBorder style={{ maxWidth: 460 }}>
//       <div style={{ padding: "30px 28px", fontFamily: "Georgia,serif" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
//           <div style={{
//             width: 42, height: 42, borderRadius: 12, flexShrink: 0,
//             background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <Store size={18} color="#be185d" strokeWidth={1.6} />
//           </div>
//           <div>
//             <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>Create your store</p>
//             <p style={{ margin: 0, fontSize: 12, color: "#a78bfa", fontFamily: "sans-serif" }}>Set up your atelier storefront</p>
//           </div>
//         </div>

//         <form
//           onSubmit={(e) => toast.promise(create(e), {
//             loading: "Creating...", success: "Store created ✅",
//             error: (err) => err.message || "Create failed",
//           })}
//           style={{ display: "grid", gap: 14 }}
//         >
//           {[
//             { name: "store_name", label: "Store Name", placeholder: "e.g. Charis Silk Collection", required: true },
//             { name: "ref_no",     label: "Reference No", placeholder: "Unique identifier (optional)", required: false },
//           ].map(({ name, label, placeholder, required }) => (
//             <div key={name}>
//               <label style={{ display: "block", fontSize: 11, fontFamily: "sans-serif", color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
//                 {label} {!required && <span style={{ color: "#c4b5fd" }}>(optional)</span>}
//               </label>
//               <input
//                 style={inputStyle}
//                 placeholder={placeholder}
//                 value={form[name]}
//                 onChange={(e) => setForm({ ...form, [name]: e.target.value })}
//                 onFocus={e => { e.target.style.borderColor = "#c084fc"; e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)"; }}
//                 onBlur={e =>  { e.target.style.borderColor = "#e9d5ff"; e.target.style.boxShadow = "none"; }}
//                 required={required}
//               />
//             </div>
//           ))}

//           <button
//             type="submit"
//             style={{
//               marginTop: 6, width: "100%",
//               background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//               color: "#fff", border: "none", borderRadius: 13,
//               padding: "14px 0", fontSize: 14, fontFamily: "sans-serif",
//               fontWeight: 500, letterSpacing: "0.05em",
//               cursor: "pointer", transition: "opacity 0.2s",
//             }}
//             onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
//             onMouseLeave={e => e.currentTarget.style.opacity = "1"}
//           >
//             Create Store
//           </button>

//           <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", borderRadius: 11, padding: "10px 14px", fontFamily: "sans-serif" }}>
//             <AlertCircle size={13} color="#a855f7" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
//             <p style={{ margin: 0, fontSize: 12, color: "#6b21a8", lineHeight: 1.6 }}>
//               You must be <strong>approved</strong> by an admin before creating a store.
//             </p>
//           </div>
//         </form>
//       </div>
//     </GradientBorder>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Store, Hash, Calendar, Tag, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

const API = "http://localhost:5000";

const statusStyles = {
  active:   { bg: "linear-gradient(135deg,#FAEAD7,#EAF4FF)", text: "#8B6A4E", dot: "#F3D3AD" },
  pending:  { bg: "linear-gradient(135deg,#F1E7FB,#FAEAD7)", text: "#8D6DB3", dot: "#D9C2F0" },
  inactive: { bg: "linear-gradient(135deg,#F8F2FE,#EAF4FF)", text: "#6F5A96", dot: "#BFD7F6" },
};

function StatusBadge({ status }) {
  const s = statusStyles[status?.toLowerCase()] || statusStyles.inactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      fontSize: 10, fontFamily: "sans-serif", fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 10px", borderRadius: 999,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function GradientBorder({ children, style = {} }) {
  return (
    <div style={{
      padding: 1.5,
      background: "linear-gradient(135deg, #F3D3AD, #D9C2F0, #BFD7F6)",
      borderRadius: 22, ...style,
    }}>
      <div style={{ background: "#FFFCF8", borderRadius: 21 }}>
        {children}
      </div>
    </div>
  );
}

function StoreCard({ s, isMyStore = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <GradientBorder style={{ opacity: hovered ? 1 : 0.9, transition: "opacity 0.3s" }}>
      <div
        style={{
          padding: "26px 26px 20px",
          fontFamily: "Georgia, serif",
          transform: hovered ? "translateY(-2px)" : "none",
          transition: "transform 0.25s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isMyStore && (
          <div style={{
            display: "inline-block", marginBottom: 14,
            background: "linear-gradient(135deg, #F3D3AD, #D9C2F0, #BFD7F6)",
            borderRadius: 999, padding: "3px 14px",
            fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
            letterSpacing: "0.12em", color: "#fff", textTransform: "uppercase",
          }}>
            ✦ My Store
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: "linear-gradient(135deg, #FAEAD7, #F1E7FB, #E7F1FD)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Store size={18} color="#8D6DB3" strokeWidth={1.6} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1e1a18", lineHeight: 1.3 }}>
              {s.store_name}
            </p>
            <div style={{ marginTop: 6 }}>
              <StatusBadge status={s.store_status} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #E8E1F0", paddingTop: 14, display: "grid", gap: 8, fontFamily: "sans-serif" }}>
          {[
            { icon: Hash,     label: "Store ID", value: s.store_id },
            s.ref_no && { icon: Tag, label: "Ref No", value: s.ref_no },
            { icon: Calendar, label: "Created",  value: new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
          ].filter(Boolean).map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={12} color="#8D6DB3" strokeWidth={2} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#A08BB8", minWidth: 60 }}>{label}</span>
              <span style={{ fontSize: 12, color: "#5C4A7A", fontFamily: "monospace" }}>{value}</span>
            </div>
          ))}
        </div>

        {isMyStore && (
          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: "linear-gradient(135deg, #F8F2FE, #EAF4FF)",
            borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "sans-serif",
          }}>
            <ShieldCheck size={13} color="#8D6DB3" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#6F5A96", lineHeight: 1.5 }}>
              Use this <strong>Store ID</strong> when creating products.
            </p>
          </div>
        )}
      </div>
    </GradientBorder>
  );
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 22, border: "1px solid #E8E1F0", padding: "26px", background: "#FFFCF8" }}>
      {[80, 55, 65, 50].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 18 : 11, width: `${w}%`,
          background: "linear-gradient(90deg,#FAEAD7 25%,#F1E7FB 50%,#EAF4FF 75%)",
          backgroundSize: "200% 100%",
          borderRadius: 6, marginBottom: 12,
          animation: "shimmer 1.6s infinite",
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px", background: "#FFFCF8", borderRadius: 22, border: "1.5px dashed #D9C2F0" }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px",
        background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Store size={22} color="#8D6DB3" strokeWidth={1.5} />
      </div>
      <p style={{ margin: 0, fontSize: 15, color: "#5C4A7A", fontWeight: 600, fontFamily: "Georgia,serif" }}>No stores yet</p>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#8D6DB3", fontFamily: "sans-serif" }}>Stores will appear here once created.</p>
    </div>
  );
}

export default function SellerStorePage() {
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ store_name: "", ref_no: "" });
  const [loading, setLoading] = useState(true);

  const loadStores = async () => {
    const res = await fetch(`${API}/api/seller/stores`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load stores");
    setStores(Array.isArray(data.stores) ? data.stores : []);
  };

  const loadMyStore = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/seller/store`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load store");
    setStore(data.store);
  };

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([loadStores(), loadMyStore()]).finally(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { store_name: form.store_name.trim(), ref_no: form.ref_no.trim() || null };
    const res = await fetch(`${API}/api/seller/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create failed");
    setStore(data.store);
    await loadStores();
    router.refresh();
    return data;
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "1.5px solid #D9C2F0", borderRadius: 13,
    padding: "13px 16px", fontSize: 14,
    fontFamily: "sans-serif", color: "#1c1917",
    background: "#FFFCF8", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <RequireRole allowedRoles={["seller"]}>
      <div style={{ position: "relative", padding: "52px 24px", maxWidth: 900, margin: "0 auto", fontFamily: "Georgia,serif", overflow: "hidden" }}>

        <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,194,240,0.22),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: 0, left: "45%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
              padding: "5px 18px",
              background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
              borderRadius: 999, fontFamily: "sans-serif",
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8D6DB3",
            }}>
              <Sparkles size={11} strokeWidth={2} />
              Seller Portal
            </div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#1c1917", lineHeight: 1.2 }}>
              Your Storefronts
            </h1>
            <p style={{ margin: "10px auto 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 420, lineHeight: 1.75 }}>
              Manage your atelier stores and track your seller presence.
            </p>
          </div>

          <div style={{ marginBottom: 52 }}>
            <SectionHeader title="My Store" count={null} />
            {loading ? <SkeletonCard /> : store ? (
              <div style={{ maxWidth: 480 }}><StoreCard s={store} isMyStore /></div>
            ) : (
              <CreateStoreForm form={form} setForm={setForm} create={create} inputStyle={inputStyle} />
            )}
          </div>

          <div>
            <SectionHeader title="All Stores" count={!loading ? stores.length : null} />
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : stores.length === 0 ? <EmptyState /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                {stores.map((s) => <StoreCard key={s.store_id} s={s} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#F3D3AD,#D9C2F0,#BFD7F6,transparent)" }} />
      {count != null && (
        <span style={{
          fontFamily: "sans-serif", fontSize: 12, color: "#8D6DB3",
          background: "linear-gradient(135deg,#F1E7FB,#EAF4FF)", padding: "2px 10px",
          borderRadius: 999, border: "1px solid #D9C2F0",
        }}>
          {count} total
        </span>
      )}
    </div>
  );
}

function CreateStoreForm({ form, setForm, create, inputStyle }) {
  return (
    <GradientBorder style={{ maxWidth: 460 }}>
      <div style={{ padding: "30px 28px", fontFamily: "Georgia,serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Store size={18} color="#8D6DB3" strokeWidth={1.6} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>Create your store</p>
            <p style={{ margin: 0, fontSize: 12, color: "#8D6DB3", fontFamily: "sans-serif" }}>Set up your atelier storefront</p>
          </div>
        </div>

        <form
          onSubmit={(e) => toast.promise(create(e), {
            loading: "Creating...", success: "Store created ✅",
            error: (err) => err.message || "Create failed",
          })}
          style={{ display: "grid", gap: 14 }}
        >
          {[
            { name: "store_name", label: "Store Name", placeholder: "e.g. Charis Silk Collection", required: true },
            { name: "ref_no",     label: "Reference No", placeholder: "Unique identifier (optional)", required: false },
          ].map(({ name, label, placeholder, required }) => (
            <div key={name}>
              <label style={{ display: "block", fontSize: 11, fontFamily: "sans-serif", color: "#8D6DB3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                {label} {!required && <span style={{ color: "#B79AD6" }}>(optional)</span>}
              </label>
              <input
                style={inputStyle}
                placeholder={placeholder}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                onFocus={e => { e.target.style.borderColor = "#BFD7F6"; e.target.style.boxShadow = "0 0 0 3px rgba(191,215,246,0.18)"; }}
                onBlur={e =>  { e.target.style.borderColor = "#D9C2F0"; e.target.style.boxShadow = "none"; }}
                required={required}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              marginTop: 6, width: "100%",
              background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
              color: "#fff", border: "none", borderRadius: 13,
              padding: "14px 0", fontSize: 14, fontFamily: "sans-serif",
              fontWeight: 500, letterSpacing: "0.05em",
              cursor: "pointer", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Create Store
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)", borderRadius: 11, padding: "10px 14px", fontFamily: "sans-serif" }}>
            <AlertCircle size={13} color="#8D6DB3" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#6F5A96", lineHeight: 1.6 }}>
              You must be <strong>approved</strong> by an admin before creating a store.
            </p>
          </div>
        </form>
      </div>
    </GradientBorder>
  );
}