"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductModal from "@/components/seller/ProductModal";
import {
  Package2,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Tag,
  Store,
  Shapes,
} from "lucide-react";

const API = "http://localhost:5000";

function GradientBorder({ children, style = {}, radius = 22 }) {
  return (
    <div
      style={{
        padding: 1.5,
        background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
        borderRadius: radius + 2,
        ...style,
      }}
    >
      <div style={{ background: "#FFFCF8", borderRadius: radius }}>{children}</div>
    </div>
  );
}

const statusStyles = {
  active: {
    bg: "linear-gradient(135deg,#FAEAD7,#F1E7FB)",
    text: "#8D6DB3",
    dot: "#B79AD6",
  },
  inactive: {
    bg: "linear-gradient(135deg,#F8F2FE,#EAF4FF)",
    text: "#6F5A96",
    dot: "#9CBEEA",
  },
  pending: {
    bg: "linear-gradient(135deg,#F1E7FB,#FAEAD7)",
    text: "#8D6DB3",
    dot: "#D9C2F0",
  },
};

function StatusBadge({ status }) {
  const s = statusStyles[status?.toLowerCase()] || statusStyles.inactive;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.text,
        fontSize: 10,
        fontFamily: "sans-serif",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 999,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[45, 15, 15, 10, 12, 10].map((w, i) => (
        <td key={i} style={{ padding: "16px 20px" }}>
          <div
            style={{
              height: 13,
              width: `${w}%`,
              minWidth: 40,
              background: "linear-gradient(90deg,#FAEAD7 25%,#F1E7FB 50%,#EAF4FF 75%)",
              backgroundSize: "200% 100%",
              borderRadius: 6,
              animation: "shimmer 1.6s infinite",
            }}
          />
        </td>
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </tr>
  );
}

const cleanAttributesForBackend = (attributes = []) => {
  return attributes
    .filter((a) => a?.attribute_name && a?.attribute_value)
    .map((a) => ({
      attribute_name: String(a.attribute_name).trim(),
      attribute_value: String(a.attribute_value).trim(),
      base_spec: Boolean(a.base_spec),
    }));
};

export default function SellerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const token = localStorage.getItem("token");

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API}/api/seller/products`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API}/api/seller/products/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();

    if (!productsRes.ok) {
      throw new Error(productsData.message || "Failed to load products");
    }

    if (!categoriesRes.ok) {
      throw new Error(categoriesData.message || "Failed to load categories");
    }

    setProducts(productsData.products || []);
    setCategories(categoriesData.categories || []);
  };

  useEffect(() => {
    setLoading(true);
    load().catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const openEdit = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/seller/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load product details");

      setEditing(data.product);
      setOpen(true);
    } catch (e) {
      toast.error(e.message || "Failed to load product");
    }
  };

  const create = async (payload) => {
    const token = localStorage.getItem("token");
    const { attributes = [], ...productData } = payload;

    const res = await fetch(`${API}/api/seller/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create failed");

    const productId =
      data?.product?.product_id ||
      data?.product_id ||
      data?.data?.product_id;

    if (!productId) {
      throw new Error("Product created, but product_id was not returned from backend");
    }

    const cleanedAttributes = cleanAttributesForBackend(attributes);

    if (cleanedAttributes.length > 0) {
      const attrRes = await fetch(`${API}/api/seller/products/${productId}/attributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attributes: cleanedAttributes }),
      });

      const attrData = await attrRes.json().catch(() => ({}));
      if (!attrRes.ok) {
        throw new Error(attrData.message || "Product created, but attributes save failed");
      }
    }

    await load();
    setOpen(false);
    setEditing(null);
  };

  const update = async (payload) => {
    const token = localStorage.getItem("token");
    const { attributes = [], ...productData } = payload;

    const res = await fetch(`${API}/api/seller/products/${editing.product_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    const cleanedAttributes = cleanAttributesForBackend(attributes);

    const attrRes = await fetch(`${API}/api/seller/products/${editing.product_id}/attributes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ attributes: cleanedAttributes }),
    });

    const attrData = await attrRes.json().catch(() => ({}));
    if (!attrRes.ok) {
      throw new Error(attrData.message || "Product updated, but attributes update failed");
    }

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
    <div
      style={{
        position: "relative",
        padding: "52px 24px",
        maxWidth: 1180,
        margin: "0 auto",
        fontFamily: "Georgia,serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: -80,
          left: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: -60,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(217,194,240,0.22),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "40%",
          width: 380,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            padding: 1.5,
            background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
            borderRadius: 28,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              background: "#FFFCF8",
              borderRadius: 27,
              padding: "36px 44px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  padding: "5px 18px",
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                  borderRadius: 999,
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8D6DB3",
                }}
              >
                <Sparkles size={11} strokeWidth={2} />
                Seller Portal
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1c1917",
                  lineHeight: 1.2,
                }}
              >
                Products
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 15,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                  maxWidth: 520,
                  lineHeight: 1.75,
                }}
              >
                Manage your listed products, inventory, pricing, and category selection from one place.
              </p>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                {
                  label: "Total Products",
                  value: products.length,
                  bg: "linear-gradient(135deg,#FAEAD7,#F1E7FB)",
                  border: "#D9C2F0",
                  color: "#8D6DB3",
                },
                {
                  label: "Active",
                  value: products.filter((p) => String(p.status).toLowerCase() === "active").length,
                  bg: "linear-gradient(135deg,#F1E7FB,#EAF4FF)",
                  border: "#BFD7F6",
                  color: "#6F5A96",
                },
                {
                  label: "Categories",
                  value: categories.length,
                  bg: "linear-gradient(135deg,#FFF1DE,#F1E7FB)",
                  border: "#E7C9A9",
                  color: "#8B6A4E",
                },
              ].map(({ label, value, bg, border, color }) => (
                <div
                  key={label}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 18,
                    padding: "14px 20px",
                    minWidth: 120,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#1c1917" }}>{value}</p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 11,
                      color,
                      fontFamily: "sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}

              <button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s",
                  alignSelf: "stretch",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {!loading && categories.length > 0 && (
          <GradientBorder style={{ marginBottom: 26 }}>
            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#EAF4FF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shapes size={18} color="#8D6DB3" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, color: "#1c1917" }}>Category Reference</h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontFamily: "sans-serif",
                      fontSize: 13,
                      color: "#7c6f86",
                    }}
                  >
                    Use these category IDs while creating or editing products.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.category_id}
                    style={{
                      border: "1px solid #E8E1F0",
                      borderRadius: 16,
                      padding: "12px 14px",
                      background: "linear-gradient(135deg,#FFFDF9,#FCF8FF,#F8FBFF)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg,#FAEAD7,#F1E7FB)",
                        color: "#8D6DB3",
                        fontFamily: "sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      ID #{cat.category_id}
                    </div>

                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1c1917", fontFamily: "sans-serif" }}>
                      {cat.category_name}
                    </div>

                    {cat.parent_category_id && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "#8B6A4E",
                          fontFamily: "sans-serif",
                        }}
                      >
                        Parent: #{cat.parent_category_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GradientBorder>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1c1917" }}>All Products</h2>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(to right,#F3D3AD,#D9C2F0,#BFD7F6,transparent)",
            }}
          />
          {!loading && (
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 12,
                color: "#8D6DB3",
                background: "linear-gradient(135deg,#F1E7FB,#EAF4FF)",
                padding: "2px 10px",
                borderRadius: 999,
                border: "1px solid #D9C2F0",
              }}
            >
              {products.length} total
            </span>
          )}
        </div>

        {loading ? (
          <GradientBorder>
            <div style={{ borderRadius: 21, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)" }}>
                    {["Product", "Price", "Discount", "Stock", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: h === "Product" ? "left" : "center",
                          fontSize: 11,
                          fontFamily: "sans-serif",
                          fontWeight: 600,
                          color: "#8D6DB3",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </tbody>
              </table>
            </div>
          </GradientBorder>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              background: "#FFFCF8",
              borderRadius: 22,
              border: "1.5px dashed #D9C2F0",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                margin: "0 auto 18px",
                background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package2 size={24} color="#fff" strokeWidth={1.5} />
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#5C4A7A" }}>No products yet</p>
            <p
              style={{
                margin: "8px 0 24px",
                fontSize: 14,
                color: "#8D6DB3",
                fontFamily: "sans-serif",
              }}
            >
              Start by adding your first product to your store.
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                color: "#fff",
                border: "none",
                borderRadius: 13,
                fontFamily: "sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add your first product
            </button>
          </div>
        ) : (
          <GradientBorder>
            <div style={{ borderRadius: 21, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg,#F8F2FE,#EAF4FF)" }}>
                      {[
                        { label: "Product", align: "left" },
                        { label: "Price", align: "center" },
                        { label: "Discount", align: "center" },
                        { label: "Stock", align: "center" },
                        { label: "Status", align: "center" },
                        { label: "Actions", align: "right" },
                      ].map(({ label, align }) => (
                        <th
                          key={label}
                          style={{
                            padding: "15px 20px",
                            textAlign: align,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#8D6DB3",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            borderBottom: "1px solid #E8E1F0",
                          }}
                        >
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
                        onEdit={() => openEdit(p.product_id)}
                        onDelete={() =>
                          toast.promise(del(p.product_id), {
                            loading: "Deleting…",
                            success: "Deleted",
                            error: (e) => e.message,
                          })
                        }
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
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initial={editing}
        categories={categories}
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
        borderBottom: isLast ? "none" : "1px solid #E8E1F0",
        background: hovered ? "linear-gradient(135deg,#FFFCF855,#F1E7FB55,#EAF4FF55)" : "#FFFCF8",
        transition: "background 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Package2 size={16} color="#8D6DB3" strokeWidth={1.6} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#1c1917",
                fontFamily: "Georgia,serif",
              }}
            >
              {p.product_name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#8D6DB3",
                  fontFamily: "sans-serif",
                }}
              >
                <Tag size={10} strokeWidth={2} />
                ID: {p.product_id}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#8D6DB3",
                  fontFamily: "sans-serif",
                }}
              >
                <Store size={10} strokeWidth={2} />
                {p.store_name} (#{p.store_id})
              </span>
              {p.category_id && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#8B6A4E",
                    fontFamily: "sans-serif",
                  }}
                >
                  <Shapes size={10} strokeWidth={2} />
                  Category #{p.category_id}
                  {p.category_name ? ` · ${p.category_name}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", fontFamily: "sans-serif" }}>
          ৳{Number(p.price).toLocaleString()}
        </span>
      </td>

      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        {Number(p.discount) > 0 ? (
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontFamily: "sans-serif",
              background: "linear-gradient(135deg,#FAEAD7,#F1E7FB)",
              color: "#8B6A4E",
              padding: "3px 10px",
              borderRadius: 999,
              border: "1px solid #E9C79D",
              fontWeight: 500,
            }}
          >
            −৳{Number(p.discount).toLocaleString()}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#B79AD6", fontFamily: "sans-serif" }}>—</span>
        )}
      </td>

      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            fontFamily: "sans-serif",
            fontWeight: 600,
            background:
              Number(p.product_count) === 0
                ? "linear-gradient(135deg,#FFE4E6,#FBCFE8)"
                : Number(p.product_count) < 5
                ? "linear-gradient(135deg,#FAEAD7,#FFF1DE)"
                : "linear-gradient(135deg,#F1E7FB,#EAF4FF)",
            color:
              Number(p.product_count) === 0
                ? "#9F1239"
                : Number(p.product_count) < 5
                ? "#8B6A4E"
                : "#8D6DB3",
            padding: "3px 12px",
            borderRadius: 999,
          }}
        >
          {p.product_count}
        </span>
      </td>

      <td style={{ padding: "16px 20px", textAlign: "center" }}>
        <StatusBadge status={p.status} />
      </td>

      <td style={{ padding: "16px 20px", textAlign: "right" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: "1.5px solid #D9C2F0",
              background: "#FFFCF8",
              fontFamily: "sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#8D6DB3",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg,#F8F2FE,#EAF4FF)";
              e.currentTarget.style.borderColor = "#BFD7F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFCF8";
              e.currentTarget.style.borderColor = "#D9C2F0";
            }}
          >
            <Pencil size={13} strokeWidth={2} />
            Edit
          </button>

          <button
            onClick={onDelete}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#FFE4E6,#FBCFE8)",
              fontFamily: "sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#9F1239",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Trash2 size={13} strokeWidth={2} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}