'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductModal from "@/components/seller/ProductModal";
import { Package2, Plus, Pencil, Trash2, Sparkles, Tag, Store } from "lucide-react";

const API = "http://localhost:5000";

function GradientBorder({ children, style = {}, radius = 22 }) {
  return (
    <div style={{ padding: 1.5, background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)", borderRadius: radius + 2, ...style }}>
      <div style={{ background: "#fffaf7", borderRadius: radius }}>{children}</div>
    </div>
  );
}

const statusStyles = {
  active:   { bg: "linear-gradient(135deg,#fce7f3,#e9d5ff)", text: "#7e22ce", dot: "#a855f7" },
  inactive: { bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", text: "#4c1d95", dot: "#8b5cf6" },
  pending:  { bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", text: "#be185d", dot: "#ec4899" },
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

function SkeletonRow() {
  return (
    <tr>
      {[45, 15, 15, 10, 12, 10].map((w, i) => (
        <td key={i} style={{ padding: "16px 20px" }}>
          <div style={{
            height: 13, width: `${w}%`, minWidth: 40,
            background: "linear-gradient(90deg,#fce7f3 25%,#e9d5ff 50%,#fce7f3 75%)",
            backgroundSize: "200% 100%", borderRadius: 6,
            animation: "shimmer 1.6s infinite",
          }} />
        </td>
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </tr>
  );
}

export default function SellerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/seller/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load products");
    setProducts(data.products || []);
  };

  useEffect(() => {
    setLoading(true);
    load().catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const create = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/seller/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create failed");
    await load();
    setOpen(false);
  };

  const update = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/seller/products/${editing.product_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");
    await load();
    setEditing(null);
    setOpen(false);
  };

  const del = async (product_id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/seller/products/${product_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Delete failed");
    setProducts((prev) => prev.filter((p) => p.product_id !== product_id));
  };

  return (
    <div style={{
      position: "relative", padding: "52px 24px",
      maxWidth: 1100, margin: "0 auto",
      fontFamily: "Georgia,serif",
    }}>

      {/* ambient glows */}
      <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Hero header ── */}
        <div style={{ padding: 1.5, background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)", borderRadius: 28, marginBottom: 36 }}>
          <div style={{
            background: "#fffaf7", borderRadius: 27,
            padding: "36px 44px",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: 24,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
                padding: "5px 18px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                borderRadius: 999, fontFamily: "sans-serif",
                fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7e22ce",
              }}>
                <Sparkles size={11} strokeWidth={2} />
                Seller Portal
              </div>

              <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#1c1917", lineHeight: 1.2 }}>
                Products
              </h1>
              <p style={{ margin: "10px 0 0", fontSize: 15, color: "#78716c", fontFamily: "sans-serif", maxWidth: 420, lineHeight: 1.75 }}>
                Manage your listed products, inventory, and pricing from one place.
              </p>
            </div>

            {/* stats strip */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                { label: "Total Products", value: products.length,                                                bg: "linear-gradient(135deg,#fce7f3,#e9d5ff)", border: "#f9a8d4", color: "#be185d" },
                { label: "Active",         value: products.filter(p => String(p.status).toLowerCase() === "active").length, bg: "linear-gradient(135deg,#e9d5ff,#ddd6fe)", border: "#c4b5fd", color: "#7c3aed" },
              ].map(({ label, value, bg, border, color }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 18, padding: "14px 20px", minWidth: 120 }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#1c1917" }}>{value}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color, fontFamily: "sans-serif", letterSpacing: "0.05em" }}>{label}</p>
                </div>
              ))}

              <button
                onClick={() => { setEditing(null); setOpen(true); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  color: "#fff", border: "none", borderRadius: 16,
                  fontFamily: "sans-serif", fontSize: 14, fontWeight: 500,
                  letterSpacing: "0.04em", cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s",
                  alignSelf: "stretch",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* ── Section header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>All Products</h2>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)" }} />
          {!loading && (
            <span style={{
              fontFamily: "sans-serif", fontSize: 12, color: "#a855f7",
              background: "linear-gradient(135deg,#fdf4ff,#fff7ed)",
              padding: "2px 10px", borderRadius: 999, border: "1px solid #e9d5ff",
            }}>
              {products.length} total
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <GradientBorder>
            <div style={{ borderRadius: 21, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)" }}>
                    {["Product", "Price", "Discount", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: h === "Product" ? "left" : "center", fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, color: "#a855f7", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow />
                </tbody>
              </table>
            </div>
          </GradientBorder>

        ) : products.length === 0 ? (

          /* ── Empty state ── */
          <div style={{
            textAlign: "center", padding: "64px 24px",
            background: "#fffaf7", borderRadius: 22,
            border: "1.5px dashed #e9d5ff",
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: 18, margin: "0 auto 18px",
              background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Package2 size={24} color="#fff" strokeWidth={1.5} />
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#3b0764" }}>No products yet</p>
            <p style={{ margin: "8px 0 24px", fontSize: 14, color: "#a78bfa", fontFamily: "sans-serif" }}>
              Start by adding your first product to your store.
            </p>
            <button
              onClick={() => { setEditing(null); setOpen(true); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 28px",
                background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                color: "#fff", border: "none", borderRadius: 13,
                fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add your first product
            </button>
          </div>

        ) : (

          /* ── Table ── */
          <GradientBorder>
            <div style={{ borderRadius: 21, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg,#fdf4ff,#fff7ed)" }}>
                      {[
                        { label: "Product",  align: "left"   },
                        { label: "Price",    align: "center" },
                        { label: "Discount", align: "center" },
                        { label: "Stock",    align: "center" },
                        { label: "Status",   align: "center" },
                        { label: "Actions",  align: "right"  },
                      ].map(({ label, align }) => (
                        <th key={label} style={{
                          padding: "15px 20px", textAlign: align,
                          fontSize: 11, fontWeight: 600, color: "#a855f7",
                          letterSpacing: "0.1em", textTransform: "uppercase",
                          borderBottom: "1px solid #f3e8ff",
                        }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p, idx) => (
                      <ProductRow
                        key={p.product_id}
                        p={p}
                        isLast={idx === products.length - 1}
                        onEdit={() => { setEditing(p); setOpen(true); }}
                        onDelete={() => toast.promise(del(p.product_id), { loading: "Deleting…", success: "Deleted", error: (e) => e.message })}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GradientBorder>
        )}
      </div>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSubmit={(payload) =>
          toast.promise(editing ? update(payload) : create(payload), {
            loading: editing ? "Updating..." : "Creating...",
            success: "Saved ✅",
            error: (e) => e.message || "Failed",
          })
        }
      />
    </div>
  );
}

function ProductRow({ p, isLast, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      style={{
        borderBottom: isLast ? "none" : "1px solid #f3e8ff",
        background: hovered ? "linear-gradient(135deg,#fdf4ff55,#fff7ed55)" : "#fffaf7",
        transition: "background 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* product name + meta */}
      <td style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Package2 size={16} color="#be185d" strokeWidth={1.6} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1c1917", fontFamily: "Georgia,serif" }}>
              {p.product_name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#a855f7", fontFamily: "sans-serif" }}>
                <Tag size={10} strokeWidth={2} />
                ID: {p.product_id}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#a855f7", fontFamily: "sans-serif" }}>
                <Store size={10} strokeWidth={2} />
                {p.store_name} (#{p.store_id})
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* price */}
      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", fontFamily: "sans-serif" }}>
          ৳{Number(p.price).toLocaleString()}
        </span>
      </td>

      {/* discount */}
      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        {Number(p.discount) > 0 ? (
          <span style={{
            display: "inline-block", fontSize: 12, fontFamily: "sans-serif",
            background: "linear-gradient(135deg,#fce7f3,#fed7aa)",
            color: "#c2410c", padding: "3px 10px", borderRadius: 999,
            border: "1px solid #fdba74", fontWeight: 500,
          }}>
            −৳{Number(p.discount).toLocaleString()}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#c4b5fd", fontFamily: "sans-serif" }}>—</span>
        )}
      </td>

      {/* stock */}
      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600,
          background: Number(p.product_count) === 0
            ? "linear-gradient(135deg,#fce7f3,#fecdd3)"
            : Number(p.product_count) < 5
            ? "linear-gradient(135deg,#fce7f3,#fed7aa)"
            : "linear-gradient(135deg,#e9d5ff,#ddd6fe)",
          color: Number(p.product_count) === 0
            ? "#9f1239"
            : Number(p.product_count) < 5
            ? "#9a3412"
            : "#6d28d9",
          padding: "3px 12px", borderRadius: 999,
        }}>
          {p.product_count}
        </span>
      </td>

      {/* status */}
      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <StatusBadge status={p.status} />
      </td>

      {/* actions */}
      <td style={{ padding: "16px 20px", textAlign: "right" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 10,
              border: "1.5px solid #e9d5ff", background: "#fffaf7",
              fontFamily: "sans-serif", fontSize: 12, fontWeight: 500,
              color: "#7e22ce", cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#fdf4ff,#fce7f3)"; e.currentTarget.style.borderColor = "#c084fc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fffaf7"; e.currentTarget.style.borderColor = "#e9d5ff"; }}
          >
            <Pencil size={13} strokeWidth={2} />
            Edit
          </button>

          <button
            onClick={onDelete}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#fce7f3,#fecdd3)",
              fontFamily: "sans-serif", fontSize: 12, fontWeight: 500,
              color: "#9f1239", cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <Trash2 size={13} strokeWidth={2} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}