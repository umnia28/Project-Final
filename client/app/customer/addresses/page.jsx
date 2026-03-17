"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPinIcon,
  Globe2Icon,
  Building2Icon,
  MapPinnedIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  SparklesIcon,
  HomeIcon,
} from "lucide-react";

const emptyAddress = {
  city: "",
  address: "",
  shipping_state: "",
  zip_code: "",
  country: "Bangladesh",
  visibility_status: true,
};

function GradientBorder({ children, style = {} }) {
  return (
    <div
      style={{
        padding: 1.5,
        background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
        borderRadius: 24,
        ...style,
      }}
    >
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
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: "18px 20px",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 10px 30px rgba(168,85,247,0.12)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#78716c",
            fontFamily: "sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "#fff",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={iconColor} strokeWidth={1.8} />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 17,
          fontWeight: 600,
          color: "#1c1917",
          fontFamily: "Georgia,serif",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

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
    return (
      <div style={{ position: "relative", minHeight: "100vh", padding: "44px 24px", fontFamily: "Georgia,serif" }}>
        <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
          <GradientBorder>
            <div style={{ padding: "40px 32px", textAlign: "center", color: "#78716c", fontFamily: "sans-serif" }}>
              Loading addresses...
            </div>
          </GradientBorder>
        </div>
      </div>
    );
  }

  const visibleCount = addresses.filter((a) => a.visibility_status).length;
  const hiddenCount = addresses.filter((a) => !a.visibility_status).length;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1.5px solid #e9d5ff",
    borderRadius: 13,
    padding: "13px 16px",
    fontSize: 14,
    fontFamily: "sans-serif",
    color: "#1c1917",
    background: "#fffaf7",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontFamily: "sans-serif",
    color: "#a855f7",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 7,
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "44px 24px", fontFamily: "Georgia,serif" }}>
      <div style={{ position: "fixed", top: -80, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 0, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, left: "40%", width: 380, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        {/* hero */}
        <div style={{ padding: 1.5, background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)", borderRadius: 28, marginBottom: 36 }}>
          <div
            style={{
              background: "#fffaf7",
              borderRadius: 27,
              padding: "36px 44px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
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
                  background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                  borderRadius: 999,
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7e22ce",
                }}
              >
                <SparklesIcon size={11} strokeWidth={2} />
                Address Book
              </div>

              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>
                My Addresses
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 15,
                  color: "#78716c",
                  fontFamily: "sans-serif",
                  lineHeight: 1.75,
                }}
              >
                Manage your saved shipping and delivery addresses.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 22px",
                background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HomeIcon size={24} color="#fff" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                  {addresses.length} Saved
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#a855f7", fontFamily: "sans-serif" }}>
                  Delivery locations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 14, marginBottom: 36 }}>
          <InfoCard
            title="Total Addresses"
            value={addresses.length}
            icon={MapPinnedIcon}
            gradFrom="#fce7f3"
            gradTo="#e9d5ff"
            border="#f9a8d4"
            iconColor="#be185d"
          />
          <InfoCard
            title="Visible"
            value={visibleCount}
            icon={EyeIcon}
            gradFrom="#ecfdf5"
            gradTo="#dcfce7"
            border="#86efac"
            iconColor="#15803d"
          />
          <InfoCard
            title="Hidden"
            value={hiddenCount}
            icon={EyeOffIcon}
            gradFrom="#f5f3ff"
            gradTo="#ede9fe"
            border="#c4b5fd"
            iconColor="#6d28d9"
          />
          <InfoCard
            title="Default Country"
            value={form.country || "Bangladesh"}
            icon={Globe2Icon}
            gradFrom="#fff7ed"
            gradTo="#fed7aa"
            border="#fdba74"
            iconColor="#c2410c"
          />
        </div>

        {/* form */}
        <GradientBorder style={{ marginBottom: 36 }}>
          <div style={{ padding: "36px 36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1c1917" }}>
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)" }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Street Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street Address"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c084fc";
                      e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9d5ff";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c084fc";
                      e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9d5ff";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>State / Area</label>
                  <input
                    name="shipping_state"
                    value={form.shipping_state}
                    onChange={handleChange}
                    placeholder="State / Area"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c084fc";
                      e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9d5ff";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Zip Code</label>
                  <input
                    name="zip_code"
                    value={form.zip_code}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c084fc";
                      e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9d5ff";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c084fc";
                      e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9d5ff";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      border: "1px solid #e9d5ff",
                      borderRadius: 14,
                      background: "linear-gradient(135deg,#fff7fb,#faf5ff)",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                      color: "#57534e",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="visibility_status"
                      checked={form.visibility_status}
                      onChange={handleChange}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 14 }}>
                      Visible / Active
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 32px",
                    background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 13,
                    fontFamily: "sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    cursor: saving ? "default" : "pointer",
                    transition: "opacity 0.2s",
                    opacity: saving ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <PlusIcon size={16} />
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
                    style={{
                      padding: "13px 24px",
                      background: "#e7e5e4",
                      color: "#44403c",
                      border: "none",
                      borderRadius: 13,
                      fontFamily: "sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </GradientBorder>

        {/* cards */}
        {addresses.length === 0 ? (
          <GradientBorder>
            <div style={{ padding: "42px 30px", textAlign: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  margin: "0 auto",
                  borderRadius: 18,
                  background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPinIcon size={24} color="#fff" />
              </div>

              <p style={{ margin: "16px 0 6px", fontSize: 20, fontWeight: 600, color: "#1c1917" }}>
                No addresses found
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#78716c", fontFamily: "sans-serif" }}>
                Add your first delivery address to get started.
              </p>
            </div>
          </GradientBorder>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
            {addresses.map((addr) => (
              <GradientBorder key={addr.address_id}>
                <div style={{ padding: "24px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 14,
                            background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <MapPinIcon size={18} color="#fff" />
                        </div>

                        <div>
                          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1917" }}>
                            Address #{addr.address_id}
                          </p>
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a855f7", fontFamily: "sans-serif" }}>
                            Saved delivery location
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <p style={{ margin: 0, fontSize: 15, color: "#1c1917", fontWeight: 600 }}>
                          {addr.address}
                        </p>

                        {addr.city && (
                          <p style={{ margin: 0, fontSize: 14, color: "#57534e", fontFamily: "sans-serif" }}>
                            <Building2Icon size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                            {addr.city}
                          </p>
                        )}

                        {addr.shipping_state && (
                          <p style={{ margin: 0, fontSize: 14, color: "#57534e", fontFamily: "sans-serif" }}>
                            <MapPinnedIcon size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                            {addr.shipping_state}
                          </p>
                        )}

                        {addr.zip_code && (
                          <p style={{ margin: 0, fontSize: 14, color: "#57534e", fontFamily: "sans-serif" }}>
                            Zip: {addr.zip_code}
                          </p>
                        )}

                        {addr.country && (
                          <p style={{ margin: 0, fontSize: 14, color: "#57534e", fontFamily: "sans-serif" }}>
                            <Globe2Icon size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                            {addr.country}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontFamily: "sans-serif",
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: addr.visibility_status ? "#dcfce7" : "#f1f5f9",
                        color: addr.visibility_status ? "#047857" : "#475569",
                        border: `1px solid ${addr.visibility_status ? "#a7f3d0" : "#e2e8f0"}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {addr.visibility_status ? <EyeIcon size={13} /> : <EyeOffIcon size={13} />}
                      {addr.visibility_status ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      paddingTop: 14,
                      borderTop: "1px solid #f1e7ef",
                      fontSize: 12.5,
                      color: "#78716c",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Added: {new Date(addr.created_at).toLocaleString()}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleEdit(addr)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "10px 16px",
                        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        fontFamily: "sans-serif",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <PencilIcon size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(addr.address_id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "10px 16px",
                        background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        fontFamily: "sans-serif",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <Trash2Icon size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </GradientBorder>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}