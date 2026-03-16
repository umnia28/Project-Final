"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  UserRound,
  Mail,
  Phone,
  VenusAndMars,
  Sparkles,
  ShieldCheck,
  PencilLine,
  Camera,
  ImagePlus,
} from "lucide-react";

const API = "http://localhost:5000";

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
  profile_img: "",
};

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 10,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#a855f7",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            color: "#a78bfa",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Icon size={16} strokeWidth={1.9} />
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: "18px 18px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,250,247,0.9))",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 10px 30px rgba(168,85,247,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8b5cf6",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 18,
          fontWeight: 600,
          color: "#1f172a",
          fontFamily: "Georgia, serif",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function CustomerProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/customer/profile`, {
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
          profile_img: user.profile_img || "",
        });

        setPreviewUrl(user.profile_img || "");
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("full_name", form.full_name);
      formData.append("contact_no", form.contact_no);
      formData.append("gender", form.gender);

      if (selectedImage) {
        formData.append("profile_img", selectedImage);
      }

      const res = await axios.put(`${API}/api/customer/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const updatedUser = res.data.user || {};

      setForm((prev) => ({
        ...prev,
        username: updatedUser.username || prev.username,
        email: updatedUser.email || prev.email,
        full_name: updatedUser.full_name || prev.full_name,
        contact_no: updatedUser.contact_no || prev.contact_no,
        gender: updatedUser.gender || prev.gender,
        profile_img: updatedUser.profile_img || prev.profile_img,
      }));

      if (updatedUser.profile_img) {
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(updatedUser.profile_img);
      }

      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(221,214,254,0.9)",
    borderRadius: 16,
    padding: "15px 16px 15px 44px",
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    color: "#1f172a",
    background: "rgba(255,255,255,0.72)",
    outline: "none",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  };

  const attachFocusStyles = {
    onFocus: (e) => {
      e.target.style.borderColor = "#c084fc";
      e.target.style.boxShadow = "0 0 0 4px rgba(192,132,252,0.12)";
      e.target.style.background = "#ffffff";
    },
    onBlur: (e) => {
      e.target.style.borderColor = "rgba(221,214,254,0.9)";
      e.target.style.boxShadow = "none";
      e.target.style.background = "rgba(255,255,255,0.72)";
    },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 24px",
          background:
            "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 28,
              padding: "36px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.8)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 50px rgba(168,85,247,0.08)",
              textAlign: "center",
              color: "#6b7280",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background:
          "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), radial-gradient(circle at bottom center, rgba(249,115,22,0.08), transparent 25%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Hero */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            padding: "34px 34px 30px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,250,247,0.78))",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 24px 70px rgba(168,85,247,0.10)",
            backdropFilter: "blur(20px)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(236,72,153,0.16), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -70,
              left: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 560 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                  color: "#7c3aed",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 16,
                }}
              >
                <Sparkles size={13} />
                Customer Profile
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 38,
                  lineHeight: 1.08,
                  color: "#18181b",
                  fontWeight: 600,
                  fontFamily: "Georgia, serif",
                }}
              >
                Your profile,
                <br />
                beautifully organized
              </h1>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "#6b7280",
                  fontFamily: "Inter, sans-serif",
                  maxWidth: 520,
                }}
              >
                
              </p>
            </div>

            <div
              style={{
                minWidth: 280,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 20px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.68)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 14px 30px rgba(236,72,153,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 16px 30px rgba(168,85,247,0.18)",
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <UserRound size={32} color="#fff" strokeWidth={1.7} />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePickImage}
                  style={{
                    position: "absolute",
                    right: -2,
                    bottom: -2,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "none",
                    background: "#fff",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Camera size={14} color="#7c3aed" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#18181b",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {form.full_name || form.username || "Customer"}
                </p>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 13,
                    color: "#8b5cf6",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {form.email || "Your account"}
                </p>
                <p
                  style={{
                    margin: "7px 0 0",
                    fontSize: 12,
                    color: "#6b7280",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Tap the camera icon to change your photo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <StatCard title="Username" value={form.username || "N/A"} />
          <StatCard title="Email" value={form.email || "N/A"} />
          <StatCard title="Contact" value={form.contact_no || "N/A"} />
          <StatCard title="Gender" value={form.gender || "Not set"} />
        </div>

        {/* Form card */}
        <div
          style={{
            borderRadius: 32,
            padding: "30px",
            background: "rgba(255,255,255,0.74)",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 24px 70px rgba(168,85,247,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 26,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 24px rgba(168,85,247,0.16)",
                  }}
                >
                  <PencilLine size={18} color="#fff" />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      color: "#18181b",
                      fontWeight: 600,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Edit Profile
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#6b7280",
                      fontSize: 13,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Update your personal details anytime.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(221,214,254,0.9)",
                color: "#6d28d9",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <ShieldCheck size={15} />
              Secure account details
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <Field label="Username" icon={UserRound}>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  style={inputStyle}
                  {...attachFocusStyles}
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  {...attachFocusStyles}
                />
              </Field>

              <Field label="Full Name" icon={UserRound}>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  style={inputStyle}
                  {...attachFocusStyles}
                />
              </Field>

              <Field label="Contact No" icon={Phone}>
                <input
                  type="text"
                  name="contact_no"
                  value={form.contact_no}
                  onChange={handleChange}
                  style={inputStyle}
                  {...attachFocusStyles}
                />
              </Field>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Gender" icon={VenusAndMars}>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    {...attachFocusStyles}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#a855f7",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Profile Image
                </label>

                <div
                  style={{
                    border: "1px dashed rgba(192,132,252,0.8)",
                    borderRadius: 20,
                    padding: "18px",
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 86,
                        height: 86,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "#f3e8ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Selected profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <ImagePlus size={28} color="#7c3aed" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 220 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#18181b",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Upload a new profile photo
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 13,
                          color: "#6b7280",
                          fontFamily: "Inter, sans-serif",
                          lineHeight: 1.7,
                        }}
                      >
                        Choose an image and it will be used as your main profile picture.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePickImage}
                      style={{
                        border: "none",
                        borderRadius: 14,
                        padding: "12px 18px",
                        background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Choose Image
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 14,
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  border: "none",
                  borderRadius: 16,
                  padding: "14px 26px",
                  background: saved
                    ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
                    : "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.8 : 1,
                  boxShadow: "0 16px 30px rgba(168,85,247,0.18)",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {saving ? "Saving..." : saved ? "Profile Updated" : "Update Profile"}
              </button>

              {saved && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    background: "rgba(139,92,246,0.08)",
                    color: "#7c3aed",
                    border: "1px solid rgba(196,181,253,0.9)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Changes saved successfully
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}