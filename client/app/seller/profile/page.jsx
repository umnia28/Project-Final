
// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Loading from "@/components/Loading";
// import {
//   StoreIcon, UserCircle2Icon, MailIcon, PhoneIcon,
//   BadgeCheckIcon, CalendarDaysIcon, StarIcon,
//   ShieldCheckIcon, SparklesIcon, Camera, ImagePlus,
// } from "lucide-react";

// const API = "http://localhost:5000";

// const resolveProfileImage = (img) => {
//   if (!img || typeof img !== "string") return "";

//   const clean = img.trim().replace(/^"+|"+$/g, "");
//   if (!clean) return "";

//   if (clean.startsWith("http://") || clean.startsWith("https://")) {
//     return clean;
//   }

//   if (clean.startsWith("/uploads/")) {
//     return `${API}${clean}`;
//   }

//   if (clean.startsWith("/")) {
//     return `${API}${clean}`;
//   }

//   return `${API}/uploads/${clean}`;
// };

// const emptyProfile = {
//   username: "",
//   email: "",
//   full_name: "",
//   contact_no: "",
//   gender: "",
//   business_name: "",
//   kyc_status: "",
//   rating_avg: "",
//   profile_img: "",
// };

// function GradientBorder({ children, style = {} }) {
//   return (
//     <div
//       style={{
//         padding: 1.5,
//         background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//         borderRadius: 24,
//         ...style,
//       }}
//     >
//       <div style={{ background: "#fffaf7", borderRadius: 23 }}>{children}</div>
//     </div>
//   );
// }

// function InfoCard({ icon: Icon, title, value, gradFrom, gradTo, border, iconColor }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       style={{
//         background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
//         border: `1px solid ${border}`,
//         borderRadius: 18,
//         padding: "18px 20px",
//         transform: hovered ? "translateY(-2px)" : "none",
//         boxShadow: hovered ? "0 10px 30px rgba(168,85,247,0.12)" : "none",
//         transition: "transform 0.2s, box-shadow 0.2s",
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 12,
//         }}
//       >
//         <span
//           style={{
//             fontSize: 11,
//             color: "#78716c",
//             fontFamily: "sans-serif",
//             letterSpacing: "0.06em",
//           }}
//         >
//           {title}
//         </span>
//         <div
//           style={{
//             width: 30,
//             height: 30,
//             borderRadius: 9,
//             background: "#fff",
//             border: `1px solid ${border}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Icon size={14} color={iconColor} strokeWidth={1.8} />
//         </div>
//       </div>
//       <p
//         style={{
//           margin: 0,
//           fontSize: 17,
//           fontWeight: 600,
//           color: "#1c1917",
//           fontFamily: "Georgia,serif",
//           wordBreak: "break-word",
//         }}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// export default function SellerProfilePage() {
//   const [form, setForm] = useState(emptyProfile);
//   const [extra, setExtra] = useState({ approved_at: "", created_at: "", status: "" });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/seller/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });

//         const user = res.data.user || {};

//         setForm({
//           username: user.username || "",
//           email: user.email || "",
//           full_name: user.full_name || "",
//           contact_no: user.contact_no || "",
//           gender: user.gender || "",
//           business_name: user.business_name || "",
//           kyc_status: user.kyc_status || "",
//           rating_avg: user.rating_avg || "",
//           profile_img: user.profile_img || "",
//         });

//         setExtra({
//           approved_at: user.approved_at || "",
//           created_at: user.created_at || "",
//           status: user.status || "",
//         });

//         setPreviewUrl(resolveProfileImage(user.profile_img || ""));
//       } catch (err) {
//         console.error("Seller profile fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (previewUrl && previewUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePickImage = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please select a valid image file.");
//       return;
//     }

//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       URL.revokeObjectURL(previewUrl);
//     }

//     setSelectedImage(file);
//     const localUrl = URL.createObjectURL(file);
//     setPreviewUrl(localUrl);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("username", form.username);
//       formData.append("email", form.email);
//       formData.append("full_name", form.full_name);
//       formData.append("contact_no", form.contact_no);
//       formData.append("gender", form.gender);

//       if (selectedImage) {
//         formData.append("profile_img", selectedImage);
//       }

//       const res = await axios.put("http://localhost:5000/api/seller/profile", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       const user = res.data.user || {};

//       setForm((prev) => ({
//         ...prev,
//         username: user.username || prev.username,
//         email: user.email || prev.email,
//         full_name: user.full_name || prev.full_name,
//         contact_no: user.contact_no || prev.contact_no,
//         gender: user.gender || prev.gender,
//         business_name: user.business_name || prev.business_name,
//         kyc_status: user.kyc_status || prev.kyc_status,
//         rating_avg: user.rating_avg || prev.rating_avg,
//         profile_img: user.profile_img || prev.profile_img,
//       }));

//       setExtra((prev) => ({
//         ...prev,
//         approved_at: user.approved_at || prev.approved_at,
//         created_at: user.created_at || prev.created_at,
//         status: user.status || prev.status,
//       }));

//       if (user.profile_img) {
//         if (previewUrl && previewUrl.startsWith("blob:")) {
//           URL.revokeObjectURL(previewUrl);
//         }
//         setPreviewUrl(resolveProfileImage(user.profile_img));
//       }

//       setSelectedImage(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Loading />;

//   const infoCards = [
//     {
//       title: "Business Name",
//       value: form.business_name || "N/A",
//       icon: StoreIcon,
//       gradFrom: "#fce7f3",
//       gradTo: "#e9d5ff",
//       border: "#f9a8d4",
//       iconColor: "#be185d",
//     },
//     {
//       title: "KYC Status",
//       value: form.kyc_status || "N/A",
//       icon: ShieldCheckIcon,
//       gradFrom: "#e9d5ff",
//       gradTo: "#ddd6fe",
//       border: "#c4b5fd",
//       iconColor: "#7c3aed",
//     },
//     {
//       title: "Rating",
//       value: form.rating_avg || "0",
//       icon: StarIcon,
//       gradFrom: "#fdf4ff",
//       gradTo: "#fce7f3",
//       border: "#e9d5ff",
//       iconColor: "#a855f7",
//     },
//     {
//       title: "Approved At",
//       value: extra.approved_at
//         ? new Date(extra.approved_at).toLocaleDateString()
//         : "N/A",
//       icon: CalendarDaysIcon,
//       gradFrom: "#fce7f3",
//       gradTo: "#fed7aa",
//       border: "#fdba74",
//       iconColor: "#c2410c",
//     },
//     {
//       title: "Account Status",
//       value: extra.status || "N/A",
//       icon: BadgeCheckIcon,
//       gradFrom: "#fdf4ff",
//       gradTo: "#e9d5ff",
//       border: "#c4b5fd",
//       iconColor: "#6d28d9",
//     },
//   ];

//   const inputStyle = {
//     width: "100%",
//     boxSizing: "border-box",
//     border: "1.5px solid #e9d5ff",
//     borderRadius: 13,
//     padding: "13px 16px",
//     fontSize: 14,
//     fontFamily: "sans-serif",
//     color: "#1c1917",
//     background: "#fffaf7",
//     outline: "none",
//     transition: "border-color 0.2s, box-shadow 0.2s",
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         minHeight: "100vh",
//         padding: "44px 24px",
//         fontFamily: "Georgia,serif",
//       }}
//     >
//       <div
//         style={{
//           position: "fixed",
//           top: -80,
//           left: -80,
//           width: 420,
//           height: 420,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle,rgba(236,72,153,0.13),transparent 70%)",
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           right: -60,
//           width: 340,
//           height: 340,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)",
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: "40%",
//           width: 380,
//           height: 280,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle,rgba(249,115,22,0.10),transparent 70%)",
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       />

//       <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
//         {/* hero */}
//         <div
//           style={{
//             padding: 1.5,
//             background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//             borderRadius: 28,
//             marginBottom: 36,
//           }}
//         >
//           <div
//             style={{
//               background: "#fffaf7",
//               borderRadius: 27,
//               padding: "36px 44px",
//               display: "flex",
//               flexWrap: "wrap",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 28,
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                   marginBottom: 18,
//                   padding: "5px 18px",
//                   background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//                   borderRadius: 999,
//                   fontFamily: "sans-serif",
//                   fontSize: 11,
//                   letterSpacing: "0.18em",
//                   textTransform: "uppercase",
//                   color: "#7e22ce",
//                 }}
//               >
//                 <StoreIcon size={11} strokeWidth={2} />
//                 Seller Account
//               </div>
//               <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>
//                 Seller Profile
//               </h1>
//               <p
//                 style={{
//                   margin: "10px 0 0",
//                   fontSize: 15,
//                   color: "#78716c",
//                   fontFamily: "sans-serif",
//                   lineHeight: 1.75,
//                 }}
//               >
//                 Manage your personal and business information.
//               </p>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 16,
//                 padding: "18px 22px",
//                 background: "linear-gradient(135deg,#fce7f3,#e9d5ff,#fed7aa)",
//                 borderRadius: 20,
//               }}
//             >
//               <div style={{ position: "relative", flexShrink: 0 }}>
//                 <div
//                   style={{
//                     width: 52,
//                     height: 52,
//                     borderRadius: 16,
//                     overflow: "hidden",
//                     background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {previewUrl ? (
//                     <img
//                       src={previewUrl}
//                       alt="Profile"
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   ) : (
//                     <UserCircle2Icon size={26} color="#fff" strokeWidth={1.5} />
//                   )}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handlePickImage}
//                   style={{
//                     position: "absolute",
//                     right: -6,
//                     bottom: -6,
//                     width: 22,
//                     height: 22,
//                     borderRadius: "50%",
//                     border: "none",
//                     background: "#fff",
//                     boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                     padding: 0,
//                   }}
//                 >
//                   <Camera size={11} color="#7c3aed" />
//                 </button>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   style={{ display: "none" }}
//                 />
//               </div>

//               <div>
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: 16,
//                     fontWeight: 600,
//                     color: "#1c1917",
//                   }}
//                 >
//                   {form.full_name || form.username}
//                 </p>
//                 <p
//                   style={{
//                     margin: "4px 0 0",
//                     fontSize: 13,
//                     color: "#a855f7",
//                     fontFamily: "sans-serif",
//                   }}
//                 >
//                   {form.email}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* info cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
//             gap: 14,
//             marginBottom: 36,
//           }}
//         >
//           {infoCards.map((card) => (
//             <InfoCard key={card.title} {...card} />
//           ))}
//         </div>

//         {/* edit form */}
//         <GradientBorder>
//           <div style={{ padding: "36px 36px 32px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
//               <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1c1917" }}>
//                 Edit Profile
//               </h2>
//               <div
//                 style={{
//                   flex: 1,
//                   height: 1,
//                   background: "linear-gradient(to right,#f9a8d4,#c084fc,transparent)",
//                 }}
//               />
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//                 {[
//                   { name: "username", label: "Username", type: "text" },
//                   { name: "email", label: "Email", type: "email" },
//                   { name: "full_name", label: "Full Name", type: "text" },
//                   { name: "contact_no", label: "Contact No", type: "text" },
//                 ].map(({ name, label, type }) => (
//                   <div key={name}>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: 11,
//                         fontFamily: "sans-serif",
//                         color: "#a855f7",
//                         letterSpacing: "0.1em",
//                         textTransform: "uppercase",
//                         marginBottom: 7,
//                       }}
//                     >
//                       {label}
//                     </label>
//                     <input
//                       type={type}
//                       name={name}
//                       value={form[name]}
//                       onChange={handleChange}
//                       style={inputStyle}
//                       onFocus={(e) => {
//                         e.target.style.borderColor = "#c084fc";
//                         e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = "#e9d5ff";
//                         e.target.style.boxShadow = "none";
//                       }}
//                     />
//                   </div>
//                 ))}

//                 <div style={{ gridColumn: "1 / -1" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: 11,
//                       fontFamily: "sans-serif",
//                       color: "#a855f7",
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                       marginBottom: 7,
//                     }}
//                   >
//                     Gender
//                   </label>
//                   <select
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#c084fc";
//                       e.target.style.boxShadow = "0 0 0 3px rgba(192,132,252,0.12)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e9d5ff";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 <div style={{ gridColumn: "1 / -1" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: 11,
//                       fontFamily: "sans-serif",
//                       color: "#a855f7",
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                       marginBottom: 7,
//                     }}
//                   >
//                     Profile Image
//                   </label>

//                   <div
//                     style={{
//                       border: "1.5px dashed #e9d5ff",
//                       borderRadius: 13,
//                       padding: "14px 16px",
//                       background: "#fffaf7",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 14,
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: 64,
//                         height: 64,
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                         background: "#f3e8ff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                       }}
//                     >
//                       {previewUrl ? (
//                         <img
//                           src={previewUrl}
//                           alt="Selected profile"
//                           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                         />
//                       ) : (
//                         <ImagePlus size={22} color="#7c3aed" />
//                       )}
//                     </div>

//                     <div style={{ flex: 1, minWidth: 220 }}>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#1c1917",
//                           fontFamily: "sans-serif",
//                         }}
//                       >
//                         Upload seller profile photo
//                       </p>
//                       <p
//                         style={{
//                           margin: "4px 0 0",
//                           fontSize: 12,
//                           color: "#78716c",
//                           fontFamily: "sans-serif",
//                           lineHeight: 1.6,
//                         }}
//                       >
//                         Choose an image to use as your seller profile picture.
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={handlePickImage}
//                       style={{
//                         border: "none",
//                         borderRadius: 11,
//                         padding: "10px 14px",
//                         background: "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//                         color: "#fff",
//                         fontSize: 13,
//                         fontWeight: 600,
//                         fontFamily: "sans-serif",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Choose Image
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   style={{
//                     padding: "13px 32px",
//                     background: saved
//                       ? "linear-gradient(135deg,#a855f7,#6d28d9)"
//                       : "linear-gradient(135deg,#ec4899,#a855f7,#f97316)",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 13,
//                     fontFamily: "sans-serif",
//                     fontSize: 14,
//                     fontWeight: 500,
//                     letterSpacing: "0.05em",
//                     cursor: saving ? "default" : "pointer",
//                     transition: "opacity 0.2s, background 0.4s",
//                     opacity: saving ? 0.75 : 1,
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!saving) e.currentTarget.style.opacity = "0.85";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.opacity = "1";
//                   }}
//                 >
//                   {saved ? "✦ Profile Updated" : saving ? "Saving…" : "Update Profile"}
//                 </button>

//                 {saved && (
//                   <span style={{ fontSize: 13, color: "#a855f7", fontFamily: "sans-serif" }}>
//                     Changes saved successfully
//                   </span>
//                 )}
//               </div>
//             </form>
//           </div>
//         </GradientBorder>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import {
  StoreIcon, UserCircle2Icon, MailIcon, PhoneIcon,
  BadgeCheckIcon, CalendarDaysIcon, StarIcon,
  ShieldCheckIcon, SparklesIcon, Camera, ImagePlus,
} from "lucide-react";

const API = "http://localhost:5000";

const resolveProfileImage = (img) => {
  if (!img || typeof img !== "string") return "";

  const clean = img.trim().replace(/^"+|"+$/g, "");
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  if (clean.startsWith("/uploads/")) {
    return `${API}${clean}`;
  }

  if (clean.startsWith("/")) {
    return `${API}${clean}`;
  }

  return `${API}/uploads/${clean}`;
};

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
  business_name: "",
  kyc_status: "",
  rating_avg: "",
  profile_img: "",
};

function GradientBorder({ children, style = {} }) {
  return (
    <div
      style={{
        padding: 1.5,
        background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
        borderRadius: 24,
        ...style,
      }}
    >
      <div style={{ background: "#FFFCF8", borderRadius: 23 }}>{children}</div>
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
        boxShadow: hovered ? "0 10px 30px rgba(217,194,240,0.16)" : "none",
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

export default function SellerProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [extra, setExtra] = useState({ approved_at: "", created_at: "", status: "" });
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
        const res = await axios.get("http://localhost:5000/api/seller/profile", {
          headers: { Authorization: `Bearer ${token}` },
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
          profile_img: user.profile_img || "",
        });

        setExtra({
          approved_at: user.approved_at || "",
          created_at: user.created_at || "",
          status: user.status || "",
        });

        setPreviewUrl(resolveProfileImage(user.profile_img || ""));
      } catch (err) {
        console.error("Seller profile fetch error:", err);
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

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

      const res = await axios.put("http://localhost:5000/api/seller/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const user = res.data.user || {};

      setForm((prev) => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        full_name: user.full_name || prev.full_name,
        contact_no: user.contact_no || prev.contact_no,
        gender: user.gender || prev.gender,
        business_name: user.business_name || prev.business_name,
        kyc_status: user.kyc_status || prev.kyc_status,
        rating_avg: user.rating_avg || prev.rating_avg,
        profile_img: user.profile_img || prev.profile_img,
      }));

      setExtra((prev) => ({
        ...prev,
        approved_at: user.approved_at || prev.approved_at,
        created_at: user.created_at || prev.created_at,
        status: user.status || prev.status,
      }));

      if (user.profile_img) {
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(resolveProfileImage(user.profile_img));
      }

      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  const infoCards = [
    {
      title: "Business Name",
      value: form.business_name || "N/A",
      icon: StoreIcon,
      gradFrom: "#FAEAD7",
      gradTo: "#F1E7FB",
      border: "#D9C2F0",
      iconColor: "#8D6DB3",
    },
    {
      title: "KYC Status",
      value: form.kyc_status || "N/A",
      icon: ShieldCheckIcon,
      gradFrom: "#F1E7FB",
      gradTo: "#EAF4FF",
      border: "#BFD7F6",
      iconColor: "#7E8FB8",
    },
    {
      title: "Rating",
      value: form.rating_avg || "0",
      icon: StarIcon,
      gradFrom: "#F8F2FE",
      gradTo: "#F1E7FB",
      border: "#D9C2F0",
      iconColor: "#8D6DB3",
    },
    {
      title: "Approved At",
      value: extra.approved_at
        ? new Date(extra.approved_at).toLocaleDateString()
        : "N/A",
      icon: CalendarDaysIcon,
      gradFrom: "#FAEAD7",
      gradTo: "#EAF4FF",
      border: "#E9C79D",
      iconColor: "#B08968",
    },
    {
      title: "Account Status",
      value: extra.status || "N/A",
      icon: BadgeCheckIcon,
      gradFrom: "#F8F2FE",
      gradTo: "#EAF4FF",
      border: "#D9C2F0",
      iconColor: "#8D6DB3",
    },
  ];

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1.5px solid #D9C2F0",
    borderRadius: 13,
    padding: "13px 16px",
    fontSize: 14,
    fontFamily: "sans-serif",
    color: "#1c1917",
    background: "#FFFCF8",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "44px 24px",
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
          background:
            "radial-gradient(circle,rgba(243,211,173,0.22),transparent 70%)",
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
          background:
            "radial-gradient(circle,rgba(217,194,240,0.22),transparent 70%)",
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
          background:
            "radial-gradient(circle,rgba(191,215,246,0.24),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            padding: 1.5,
            background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
            borderRadius: 28,
            marginBottom: 36,
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
                  background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                  borderRadius: 999,
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8D6DB3",
                }}
              >
                <StoreIcon size={11} strokeWidth={2} />
                Seller Account
              </div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: "#1c1917" }}>
                Seller Profile
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
                Manage your personal and business information.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 22px",
                background: "linear-gradient(135deg,#FAEAD7,#F1E7FB,#E7F1FD)",
                borderRadius: 20,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <UserCircle2Icon size={26} color="#fff" strokeWidth={1.5} />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePickImage}
                  style={{
                    position: "absolute",
                    right: -6,
                    bottom: -6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "none",
                    background: "#fff",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Camera size={11} color="#8D6DB3" />
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
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1c1917",
                  }}
                >
                  {form.full_name || form.username}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "#8D6DB3",
                    fontFamily: "sans-serif",
                  }}
                >
                  {form.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>

        <GradientBorder>
          <div style={{ padding: "36px 36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1c1917" }}>
                Edit Profile
              </h2>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "linear-gradient(to right,#F3D3AD,#D9C2F0,#BFD7F6,transparent)",
                }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { name: "username", label: "Username", type: "text" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "full_name", label: "Full Name", type: "text" },
                  { name: "contact_no", label: "Contact No", type: "text" },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontFamily: "sans-serif",
                        color: "#8D6DB3",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 7,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#BFD7F6";
                        e.target.style.boxShadow = "0 0 0 3px rgba(191,215,246,0.18)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#D9C2F0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: "#8D6DB3",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#BFD7F6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(191,215,246,0.18)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D9C2F0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: "#8D6DB3",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    Profile Image
                  </label>

                  <div
                    style={{
                      border: "1.5px dashed #D9C2F0",
                      borderRadius: 13,
                      padding: "14px 16px",
                      background: "#FFFCF8",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "#F1E7FB",
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
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <ImagePlus size={22} color="#8D6DB3" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 220 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1c1917",
                          fontFamily: "sans-serif",
                        }}
                      >
                        Upload seller profile photo
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: "#78716c",
                          fontFamily: "sans-serif",
                          lineHeight: 1.6,
                        }}
                      >
                        Choose an image to use as your seller profile picture.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePickImage}
                      style={{
                        border: "none",
                        borderRadius: 11,
                        padding: "10px 14px",
                        background: "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Choose Image
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "13px 32px",
                    background: saved
                      ? "linear-gradient(135deg,#D9C2F0,#BFD7F6)"
                      : "linear-gradient(135deg,#F3D3AD,#D9C2F0,#BFD7F6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 13,
                    fontFamily: "sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    cursor: saving ? "default" : "pointer",
                    transition: "opacity 0.2s, background 0.4s",
                    opacity: saving ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {saved ? "✦ Profile Updated" : saving ? "Saving…" : "Update Profile"}
                </button>

                {saved && (
                  <span style={{ fontSize: 13, color: "#8D6DB3", fontFamily: "sans-serif" }}>
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