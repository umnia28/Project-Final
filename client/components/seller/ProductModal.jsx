"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Sparkles,
  Boxes,
  Package,
  Image as ImageIcon,
  Tag,
  Shapes,
} from "lucide-react";

const emptyVariant = { attribute_name: "", attribute_value: "", base_spec: false };

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          padding: "6px 12px",
          borderRadius: 999,
          background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#EAF4FF)",
          color: "#8D6DB3",
          fontFamily: "sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <Icon size={13} strokeWidth={2} />
        {title}
      </div>

      {subtitle ? (
        <p
          style={{
            margin: 0,
            color: "#7c6f86",
            fontSize: 13,
            lineHeight: 1.7,
            fontFamily: "sans-serif",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function FieldLabel({ icon: Icon, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#8D6DB3",
        fontFamily: "sans-serif",
      }}
    >
      <Icon size={14} strokeWidth={2} />
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        border: "1.5px solid #E6DDF2",
        background: "linear-gradient(180deg,#ffffff,#fffdfa)",
        borderRadius: 16,
        padding: "13px 14px",
        fontSize: 14,
        color: "#1c1917",
        outline: "none",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        border: "1.5px solid #E6DDF2",
        background: "linear-gradient(180deg,#ffffff,#fffdfa)",
        borderRadius: 16,
        padding: "13px 14px",
        fontSize: 14,
        color: "#1c1917",
        outline: "none",
        resize: "vertical",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        border: "1.5px solid #E6DDF2",
        background: "linear-gradient(180deg,#ffffff,#fffdfa)",
        borderRadius: 16,
        padding: "13px 14px",
        fontSize: 14,
        color: "#1c1917",
        outline: "none",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

function CardSection({ children, style = {} }) {
  return (
    <div
      style={{
        border: "1.5px solid #E6DDF2",
        borderRadius: 24,
        background: "linear-gradient(135deg,#FFFDF9,#FCF8FF,#F8FBFF)",
        padding: 22,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function ProductModal({ open, onClose, onSubmit, initial, categories = [] }) {
  const [form, setForm] = useState({
    store_id: "",
    category_id: "",
    product_name: "",
    price: "",
    discount: 0,
    product_count: 0,
    product_description: "",
    imagesText: "",
  });

  const [attributes, setAttributes] = useState([emptyVariant]);

  useEffect(() => {
    if (!open) return;

    setForm({
      store_id: initial?.store_id ? String(initial.store_id) : "",
      category_id: initial?.category_id ? String(initial.category_id) : "",
      product_name: initial?.product_name || "",
      price: initial?.price != null ? String(initial.price) : "",
      discount: initial?.discount != null ? Number(initial.discount) : 0,
      product_count: initial?.product_count != null ? Number(initial.product_count) : 0,
      product_description: initial?.product_description || "",
      imagesText: Array.isArray(initial?.images) ? initial.images.join("\n") : "",
    });

    if (Array.isArray(initial?.attributes) && initial.attributes.length > 0) {
      setAttributes(
        initial.attributes.map((attr) => ({
          attribute_name: attr?.attribute_name || "",
          attribute_value: attr?.attribute_value || "",
          base_spec: Boolean(attr?.base_spec),
        }))
      );
    } else {
      setAttributes([emptyVariant]);
    }
  }, [open, initial]);

  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.category_id) === String(form.category_id)),
    [categories, form.category_id]
  );

  if (!open) return null;

  const updateVariant = (index, key, value) => {
    setAttributes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addVariant = () => {
    setAttributes((prev) => [...prev, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    setAttributes((prev) => {
      if (prev.length === 1) return [emptyVariant];
      return prev.filter((_, i) => i !== index);
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const images = form.imagesText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const cleanedAttributes = attributes
      .filter((a) => a.attribute_name?.trim() && a.attribute_value?.trim())
      .map((a) => ({
        attribute_name: a.attribute_name.trim(),
        attribute_value: a.attribute_value.trim(),
        base_spec: Boolean(a.base_spec),
      }));

    onSubmit({
      store_id: Number(form.store_id),
      category_id: form.category_id ? Number(form.category_id) : null,
      product_name: form.product_name.trim(),
      price: Number(form.price),
      discount: Number(form.discount || 0),
      product_count: Number(form.product_count || 0),
      product_description: form.product_description?.trim() || null,
      images,
      attributes: cleanedAttributes,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(243,211,173,0.16), transparent 24%), radial-gradient(circle at top right, rgba(217,194,240,0.18), transparent 28%), rgba(20,16,24,0.34)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1040,
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: 32,
          padding: 1.5,
          background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
          boxShadow: "0 36px 90px rgba(68, 38, 102, 0.24)",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.9), rgba(255,252,248,1) 42%), linear-gradient(180deg,#FFFCF8,#FFFDFB)",
            borderRadius: 30,
            padding: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 26,
              paddingBottom: 22,
              borderBottom: "1px solid rgba(230,221,242,0.9)",
            }}
          >
            <div style={{ maxWidth: 680 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  padding: "7px 16px",
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#EAF4FF)",
                  borderRadius: 999,
                  color: "#8D6DB3",
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                <Sparkles size={12} strokeWidth={2} />
                Product Editor
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 31,
                  fontWeight: 600,
                  color: "#1c1917",
                  lineHeight: 1.15,
                }}
              >
                {initial ? "Edit Product" : "Create Product"}
              </h2>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#7c6f86",
                  fontSize: 14,
                  fontFamily: "sans-serif",
                  lineHeight: 1.8,
                }}
              >
                Fill in product details, images, variants, and category.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                border: "1.5px solid #E6DDF2",
                background: "linear-gradient(180deg,#ffffff,#fff8fd)",
                color: "#8D6DB3",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "0 8px 18px rgba(180,150,220,0.12)",
              }}
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 22 }}>
            <CardSection>
              <SectionTitle
                icon={Package}
                title="Basic Information"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <div style={{ gridColumn: "span 4" }}>
                  <FieldLabel icon={Tag}>Store ID</FieldLabel>
                  <Input
                    placeholder="Enter store ID"
                    value={form.store_id}
                    onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                    required
                  />
                </div>

                <div style={{ gridColumn: "span 8" }}>
                  <FieldLabel icon={Shapes}>Category</FieldLabel>
                  <Select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        #{cat.category_id} — {cat.category_name}
                      </option>
                    ))}
                  </Select>

                  {selectedCategory && (
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg,#FFF1DE,#F6EDFF)",
                        color: "#8B6A4E",
                        fontSize: 12,
                        fontFamily: "sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Selected: #{selectedCategory.category_id} — {selectedCategory.category_name}
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <FieldLabel icon={Package}>Product Name</FieldLabel>
                  <Input
                    placeholder="Enter product name"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <FieldLabel icon={Tag}>Price</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <FieldLabel icon={Tag}>Discount</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Enter discount"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: "span 4" }}>
                  <FieldLabel icon={Boxes}>Stock</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Enter stock"
                    value={form.product_count}
                    onChange={(e) => setForm({ ...form, product_count: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <FieldLabel icon={Package}>Description</FieldLabel>
                  <Textarea
                    rows={4}
                    placeholder="Write a short, attractive description"
                    value={form.product_description}
                    onChange={(e) => setForm({ ...form, product_description: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <FieldLabel icon={ImageIcon}>Images</FieldLabel>
                  <Textarea
                    rows={4}
                    placeholder="Paste image URLs, one per line"
                    value={form.imagesText}
                    onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                  />
                </div>
              </div>
            </CardSection>

            {categories.length > 0 && (
              <CardSection>
                <SectionTitle
                  icon={Shapes}
                  title="Category ID Guide"
                  subtitle="Choose quickly from this artistic reference grid. Clicking a card fills the category automatically."
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: 12,
                  }}
                >
                  {categories.map((cat) => {
                    const active = String(form.category_id) === String(cat.category_id);

                    return (
                      <button
                        key={cat.category_id}
                        type="button"
                        onClick={() => setForm({ ...form, category_id: String(cat.category_id) })}
                        style={{
                          textAlign: "left",
                          border: active ? "1.5px solid #D7B8F2" : "1px solid #E9E1F0",
                          borderRadius: 18,
                          padding: "14px 15px",
                          background: active
                            ? "linear-gradient(135deg,#FAEAD7,#F1E7FB,#EAF4FF)"
                            : "linear-gradient(180deg,#ffffff,#fffdfa)",
                          cursor: "pointer",
                          boxShadow: active
                            ? "0 10px 24px rgba(180,150,220,0.16)"
                            : "0 4px 12px rgba(180,150,220,0.05)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 8,
                            padding: "5px 10px",
                            borderRadius: 999,
                            background: active
                              ? "rgba(255,255,255,0.65)"
                              : "linear-gradient(135deg,#FFF1DE,#F6EDFF)",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#8D6DB3",
                            fontFamily: "sans-serif",
                          }}
                        >
                          ID #{cat.category_id}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            color: "#1c1917",
                            fontFamily: "sans-serif",
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          {cat.category_name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardSection>
            )}

            <CardSection>
              <SectionTitle
                icon={Boxes}
                title="Variants"
                subtitle="Organize product variations elegantly with clear rows and better visual breathing room."
              />

              <div style={{ display: "grid", gap: 14 }}>
                {attributes.map((attr, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #E9E1F0",
                      borderRadius: 20,
                      background: "linear-gradient(180deg,#ffffff,#fffdfa)",
                      padding: 16,
                      boxShadow: "0 6px 16px rgba(180,150,220,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr auto",
                        gap: 12,
                        alignItems: "end",
                      }}
                    >
                      <div>
                        <FieldLabel icon={Tag}>Attribute Name</FieldLabel>
                        <Input
                          placeholder="e.g. Color"
                          value={attr.attribute_name}
                          onChange={(e) => updateVariant(index, "attribute_name", e.target.value)}
                        />
                      </div>

                      <div>
                        <FieldLabel icon={Tag}>Attribute Value</FieldLabel>
                        <Input
                          placeholder="e.g. Blue"
                          value={attr.attribute_value}
                          onChange={(e) => updateVariant(index, "attribute_value", e.target.value)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        style={{
                          height: 48,
                          padding: "0 16px",
                          borderRadius: 15,
                          border: "1.5px solid #F1D3DA",
                          background: "linear-gradient(135deg,#FFF1F4,#FFE4E6)",
                          color: "#A33A59",
                          fontFamily: "sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxShadow: "0 8px 18px rgba(244,114,182,0.08)",
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 14,
                        cursor: "pointer",
                        fontSize: 13,
                        color: "#6F5A96",
                        fontFamily: "sans-serif",
                        fontWeight: 600,
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg,#F8F2FE,#FBF7FF)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(attr.base_spec)}
                        onChange={(e) => updateVariant(index, "base_spec", e.target.checked)}
                      />
                      Mark as base spec
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVariant}
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  borderRadius: 15,
                  border: "1.5px solid #D9C2F0",
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#EAF4FF)",
                  color: "#8D6DB3",
                  fontFamily: "sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 22px rgba(180,150,220,0.10)",
                }}
              >
                <Plus size={15} strokeWidth={2.4} />
                Add Variant
              </button>
            </CardSection>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                paddingTop: 2,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "13px 20px",
                  borderRadius: 16,
                  border: "1.5px solid #E6DDF2",
                  background: "linear-gradient(180deg,#ffffff,#fff8fd)",
                  color: "#7C6F86",
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 22px",
                  borderRadius: 16,
                  border: "none",
                  background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                  color: "#fff",
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 14px 34px rgba(180, 150, 220, 0.30)",
                }}
              >
                <Tag size={15} strokeWidth={2.2} />
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}