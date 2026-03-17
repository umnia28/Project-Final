// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Loading from "@/components/Loading";
// import { Package, Store, Tag, CheckCircle, AlertCircle, BarChart3, Sparkles } from "lucide-react";

// const statusStyles = {
//   active:      { bg: "linear-gradient(135deg,#fce7f3,#fed7aa)", text: "#9a3412", dot: "#f97316" },
//   inactive:    { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" },
//   pending:     { bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", text: "#7e22ce", dot: "#a855f7" },
//   unavailable: { bg: "linear-gradient(135deg,#fce7f3,#fecdd3)", text: "#9f1239", dot: "#f43f5e" },
// };

// function StatusBadge({ status }) {
//   const s = statusStyles[status?.toLowerCase()] || statusStyles.inactive;
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 5,
//       background: s.bg, color: s.text, fontSize: 10,
//       fontFamily: "sans-serif", fontWeight: 600,
//       letterSpacing: "0.08em", textTransform: "uppercase",
//       padding: "3px 9px", borderRadius: 999,
//     }}>
//       <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
//       {status}
//     </span>
//   );
// }

// function StockBar({ count }) {
//   const n = Number(count);
//   const level = n === 0 ? 0 : n < 5 ? 28 : n < 20 ? 62 : 100;
//   const color = n === 0 ? "#f43f5e" : n < 5 ? "#f97316" : "#a855f7";
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//       <div style={{ flex: 1, height: 4, borderRadius: 99, background: "#f3e8ff", overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${level}%`, background: `linear-gradient(90deg,#ec4899,${color})`, borderRadius: 99, transition: "width 0.4s" }} />
//       </div>
//       <span style={{ fontSize: 11, color, fontFamily: "sans-serif", fontWeight: 600, minWidth: 20 }}>
//         {n === 0 ? "Out" : n < 5 ? "Low" : "OK"}
//       </span>
//     </div>
//   );
// }

// export default function SellerStockPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [savingId, setSavingId] = useState(null);
//   const [savedId, setSavedId] = useState(null);

//   useEffect(() => {
//     const fetchStock = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/seller/stock", {
//           headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
//         });
//         setItems(res.data.items || []);
//       } catch (err) { console.error("Seller stock fetch error:", err); }
//       finally { setLoading(false); }
//     };
//     fetchStock();
//   }, []);

//   const handleChange = (productId, value) =>
//     setItems((prev) => prev.map((item) => item.product_id === productId ? { ...item, product_count: value } : item));

//   const handleSave = async (productId, product_count) => {
//     try {
//       setSavingId(productId);
//       const token = localStorage.getItem("token");
//       await axios.put(`http://localhost:5000/api/seller/stock/${productId}`,
//         { product_count: Number(product_count) },
//         { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//       );
//       setSavedId(productId);
//       setTimeout(() => setSavedId(null), 2000);
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update stock");
//     } finally { setSavingId(null); }
//   };

//   if (loading) return <Loading />;

//   const totalStock = items.reduce((s, i) => s + Number(i.product_count || 0), 0);
//   const outOfStock = items.filter((i) => Number(i.product_count) === 0).length;
//   const lowStock   = items.filter((i) => Number(i.product_count) > 0 && Number(i.product_count) < 5).length;

//   const summaryCards = [
//     { icon: BarChart3,    label: "Total Stock",  value: totalStock, grad: "linear-gradient(135deg,#fce7f3,#e9d5ff)", iconColor: "#be185d", border: "#f9a8d4" },
//     { icon: AlertCircle,  label: "Out of Stock", value: outOfStock, grad: "linear-gradient(135deg,#fce7f3,#fed7aa)", iconColor: "#c2410c", border: "#fdba74" },
//     { icon: Package,      label: "Low Stock",    value: lowStock,   grad: "linear-gradient(135deg,#fdf4ff,#fce7f3)", iconColor: "#7e22ce", border: "#e9d5ff" },
//   ];

//   return (
//     <div style={{ position: "relative", padding: "52px 24px", maxWidth: 920, margin: "0 auto", fontFamily: "Georgia,serif" }}>
//       <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//       <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
//       <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

//       <div style={{ position: "relative", zIndex: 1 }}>

//         {/* header */}
//         <div style={{ textAlign: "center", marginBottom: 44 }}>
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
//             padding: "5px 18px",
//             background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//             borderRadius: 999, fontFamily: "sans-serif",
//             fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
//           }}>
//             <Sparkles size={11} strokeWidth={2} />
//             Seller Portal
//           </div>
//           <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>Stock Management</h1>
//           <p style={{ margin: "10px auto 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 400, lineHeight: 1.75 }}>
//             Monitor inventory levels and update product quantities.
//           </p>
//         </div>

//         {/* summary */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 42 }}>
//           {summaryCards.map(({ icon: Icon, label, value, grad, iconColor, border }) => (
//             <div key={label} style={{
//               background: grad, border: `1px solid ${border}`,
//               borderRadius: 18, padding: "18px 20px",
//               display: "flex", alignItems: "center", gap: 14,
//             }}>
//               <div style={{
//                 width: 42, height: 42, borderRadius: 12, flexShrink: 0,
//                 background: "#fff", border: `1px solid ${border}`,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <Icon size={18} color={iconColor} strokeWidth={1.7} />
//               </div>
//               <div>
//                 <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1c1917" }}>{value}</p>
//                 <p style={{ margin: "4px 0 0", fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>{label}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* section header */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//           <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Products</h2>
//           <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)" }} />
//           <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#a855f7", background: "linear-gradient(135deg,#fdf4ff,#fff7ed)", padding: "2px 10px", borderRadius: 999, border: "1px solid #e9d5ff" }}>
//             {items.length} total
//           </span>
//         </div>

//         {/* empty */}
//         {items.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "52px 24px", background: "#fffaf7", borderRadius: 22, border: "1.5px dashed #e9d5ff" }}>
//             <div style={{ width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px", background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Package size={22} color="#be185d" strokeWidth={1.5} />
//             </div>
//             <p style={{ margin: 0, fontSize: 15, color: "#3b0764", fontWeight: 600 }}>No products found</p>
//             <p style={{ margin: "6px 0 0", fontSize: 13, color: "#a78bfa", fontFamily: "sans-serif" }}>Add products to your store to manage stock here.</p>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//             {items.map((item) => {
//               const isSaving = savingId === item.product_id;
//               const isSaved  = savedId  === item.product_id;
//               return (
//                 <div
//                   key={item.product_id}
//                   style={{
//                     background: "#fffaf7",
//                     border: isSaved ? "1.5px solid #c084fc" : "1px solid #f3e8ff",
//                     borderRadius: 20, padding: "22px 26px",
//                     display: "flex", flexWrap: "wrap",
//                     alignItems: "center", justifyContent: "space-between", gap: 20,
//                     transition: "transform 0.2s, box-shadow 0.2s, border-color 0.3s",
//                   }}
//                   onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(168,85,247,0.10)"; }}
//                   onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
//                 >
//                   <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 200 }}>
//                     <div style={{
//                       width: 44, height: 44, borderRadius: 12, flexShrink: 0,
//                       background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                     }}>
//                       <Package size={18} color="#be185d" strokeWidth={1.6} />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>{item.product_name}</p>
//                       <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
//                         <StatusBadge status={item.status} />
//                         <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#a855f7", fontFamily: "sans-serif" }}>
//                           <Tag size={11} strokeWidth={2} /> ৳ {item.price}
//                         </span>
//                         <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#a855f7", fontFamily: "sans-serif" }}>
//                           <Store size={11} strokeWidth={2} /> {item.store_name}
//                         </span>
//                       </div>
//                       <div style={{ marginTop: 10, maxWidth: 180 }}>
//                         <StockBar count={item.product_count} />
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ textAlign: "center" }}>
//                       <label style={{ display: "block", fontSize: 10, fontFamily: "sans-serif", color: "#c084fc", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>Qty</label>
//                       <input
//                         type="number" min="0"
//                         value={item.product_count}
//                         onChange={(e) => handleChange(item.product_id, e.target.value)}
//                         style={{
//                           width: 88, padding: "10px 12px",
//                           fontSize: 15, fontWeight: 600, fontFamily: "sans-serif",
//                           textAlign: "center", color: "#1c1917",
//                           background: "#fffaf7", border: "1.5px solid #e9d5ff",
//                           borderRadius: 12, outline: "none", transition: "border-color 0.2s",
//                         }}
//                         onFocus={e => e.target.style.borderColor = "#c084fc"}
//                         onBlur={e  => e.target.style.borderColor = "#e9d5ff"}
//                       />
//                     </div>
//                     <button
//                       onClick={() => handleSave(item.product_id, item.product_count)}
//                       disabled={isSaving || isSaved}
//                       style={{
//                         marginTop: 18, display: "flex", alignItems: "center", gap: 6,
//                         padding: "11px 20px", borderRadius: 12, border: "none",
//                         fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
//                         cursor: isSaving || isSaved ? "default" : "pointer",
//                         transition: "opacity 0.2s, background 0.4s",
//                         background: isSaved
//                           ? "linear-gradient(135deg,#a855f7,#6d28d9)"
//                           : "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//                         color: "#fff", opacity: isSaving ? 0.7 : 1,
//                         minWidth: 90, justifyContent: "center",
//                       }}
//                       onMouseEnter={e => { if (!isSaving && !isSaved) e.currentTarget.style.opacity = "0.85"; }}
//                       onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
//                     >
//                       {isSaved ? <><CheckCircle size={14} strokeWidth={2} /> Saved</> : isSaving ? "Saving…" : "Save"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import { Package, Store, Tag, CheckCircle, AlertCircle, BarChart3, Sparkles } from "lucide-react";

const statusStyles = {
  active:      { bg: "linear-gradient(135deg,#FAEAD7,#EAF4FF)", text: "#8B6A4E", dot: "#F3D3AD" },
  inactive:    { bg: "linear-gradient(135deg,#F8F2FE,#EAF4FF)", text: "#6F5A96", dot: "#BFD7F6" },
  pending:     { bg: "linear-gradient(135deg,#F1E7FB,#FAEAD7)", text: "#8D6DB3", dot: "#D9C2F0" },
  unavailable: { bg: "linear-gradient(135deg,#FFE4E6,#FBCFE8)", text: "#9F1239", dot: "#F43F5E" },
};

function StatusBadge({ status }) {
  const s = statusStyles[status?.toLowerCase()] || statusStyles.inactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text, fontSize: 10,
      fontFamily: "sans-serif", fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 999,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

function StockBar({ count }) {
  const n = Number(count);
  const level = n === 0 ? 0 : n < 5 ? 28 : n < 20 ? 62 : 100;
  const color = n === 0 ? "#f43f5e" : n < 5 ? "#B08968" : "#8D6DB3";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 99, background: "#F1E7FB", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${level}%`, background: `linear-gradient(90deg,#D9C2F0,${color})`, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "sans-serif", fontWeight: 600, minWidth: 20 }}>
        {n === 0 ? "Out" : n < 5 ? "Low" : "OK"}
      </span>
    </div>
  );
}

export default function SellerStockPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/seller/stock", {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
        setItems(res.data.items || []);
      } catch (err) { console.error("Seller stock fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchStock();
  }, []);

  const handleChange = (productId, value) =>
    setItems((prev) => prev.map((item) => item.product_id === productId ? { ...item, product_count: value } : item));

  const handleSave = async (productId, product_count) => {
    try {
      setSavingId(productId);
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/seller/stock/${productId}`,
        { product_count: Number(product_count) },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setSavedId(productId);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    } finally { setSavingId(null); }
  };

  if (loading) return <Loading />;

  const totalStock = items.reduce((s, i) => s + Number(i.product_count || 0), 0);
  const outOfStock = items.filter((i) => Number(i.product_count) === 0).length;
  const lowStock   = items.filter((i) => Number(i.product_count) > 0 && Number(i.product_count) < 5).length;

  const summaryCards = [
    { icon: BarChart3,    label: "Total Stock",  value: totalStock, grad: "linear-gradient(135deg,#FAEAD7,#F1E7FB)", iconColor: "#8D6DB3", border: "#D9C2F0" },
    { icon: AlertCircle,  label: "Out of Stock", value: outOfStock, grad: "linear-gradient(135deg,#FAEAD7,#EAF4FF)", iconColor: "#B08968", border: "#E9C79D" },
    { icon: Package,      label: "Low Stock",    value: lowStock,   grad: "linear-gradient(135deg,#F8F2FE,#F1E7FB)", iconColor: "#8D6DB3", border: "#D9C2F0" },
  ];

  return (
    <div style={{ position: "relative", padding: "52px 24px", maxWidth: 920, margin: "0 auto", fontFamily: "Georgia,serif" }}>
      <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,194,240,0.22),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: 44 }}>
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
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>Stock Management</h1>
          <p style={{ margin: "10px auto 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 400, lineHeight: 1.75 }}>
            Monitor inventory levels and update product quantities.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 42 }}>
          {summaryCards.map(({ icon: Icon, label, value, grad, iconColor, border }) => (
            <div key={label} style={{
              background: grad, border: `1px solid ${border}`,
              borderRadius: 18, padding: "18px 20px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: "#fff", border: `1px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} color={iconColor} strokeWidth={1.7} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "#1c1917" }}>{value}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#78716c", fontFamily: "sans-serif" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>Products</h2>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#F3D3AD,#D9C2F0,#BFD7F6,transparent)" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8D6DB3", background: "linear-gradient(135deg,#F1E7FB,#EAF4FF)", padding: "2px 10px", borderRadius: 999, border: "1px solid #D9C2F0" }}>
            {items.length} total
          </span>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "52px 24px", background: "#FFFCF8", borderRadius: 22, border: "1.5px dashed #D9C2F0" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px", background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={22} color="#8D6DB3" strokeWidth={1.5} />
            </div>
            <p style={{ margin: 0, fontSize: 15, color: "#5C4A7A", fontWeight: 600 }}>No products found</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#8D6DB3", fontFamily: "sans-serif" }}>Add products to your store to manage stock here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((item) => {
              const isSaving = savingId === item.product_id;
              const isSaved  = savedId  === item.product_id;
              return (
                <div
                  key={item.product_id}
                  style={{
                    background: "#FFFCF8",
                    border: isSaved ? "1.5px solid #BFD7F6" : "1px solid #E8E1F0",
                    borderRadius: 20, padding: "22px 26px",
                    display: "flex", flexWrap: "wrap",
                    alignItems: "center", justifyContent: "space-between", gap: 20,
                    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.3s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(217,194,240,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 200 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Package size={18} color="#8D6DB3" strokeWidth={1.6} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>{item.product_name}</p>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
                        <StatusBadge status={item.status} />
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#8D6DB3", fontFamily: "sans-serif" }}>
                          <Tag size={11} strokeWidth={2} /> ৳ {item.price}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#8D6DB3", fontFamily: "sans-serif" }}>
                          <Store size={11} strokeWidth={2} /> {item.store_name}
                        </span>
                      </div>
                      <div style={{ marginTop: 10, maxWidth: 180 }}>
                        <StockBar count={item.product_count} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "center" }}>
                      <label style={{ display: "block", fontSize: 10, fontFamily: "sans-serif", color: "#8D6DB3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>Qty</label>
                      <input
                        type="number" min="0"
                        value={item.product_count}
                        onChange={(e) => handleChange(item.product_id, e.target.value)}
                        style={{
                          width: 88, padding: "10px 12px",
                          fontSize: 15, fontWeight: 600, fontFamily: "sans-serif",
                          textAlign: "center", color: "#1c1917",
                          background: "#FFFCF8", border: "1.5px solid #D9C2F0",
                          borderRadius: 12, outline: "none", transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "#BFD7F6"}
                        onBlur={e  => e.target.style.borderColor = "#D9C2F0"}
                      />
                    </div>
                    <button
                      onClick={() => handleSave(item.product_id, item.product_count)}
                      disabled={isSaving || isSaved}
                      style={{
                        marginTop: 18, display: "flex", alignItems: "center", gap: 6,
                        padding: "11px 20px", borderRadius: 12, border: "none",
                        fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
                        cursor: isSaving || isSaved ? "default" : "pointer",
                        transition: "opacity 0.2s, background 0.4s",
                        background: isSaved
                          ? "linear-gradient(135deg,#D9C2F0,#BFD7F6)"
                          : "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                        color: "#fff", opacity: isSaving ? 0.7 : 1,
                        minWidth: 90, justifyContent: "center",
                      }}
                      onMouseEnter={e => { if (!isSaving && !isSaved) e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                    >
                      {isSaved ? <><CheckCircle size={14} strokeWidth={2} /> Saved</> : isSaving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}