"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheckIcon,
  UserCircle2Icon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  ActivityIcon,
  SparklesIcon,
} from "lucide-react";

const emptyProfile = {
  username: "",
  email: "",
  full_name: "",
  contact_no: "",
  gender: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [extra, setExtra] = useState({
    clearance_level: "",
    is_employee: false,
    hire_date: "",
    status: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setForm({
          username: res.data.user?.username || "",
          email: res.data.user?.email || "",
          full_name: res.data.user?.full_name || "",
          contact_no: res.data.user?.contact_no || "",
          gender: res.data.user?.gender || "",
        });

        setExtra({
          clearance_level: res.data.user?.clearance_level || "",
          is_employee: res.data.user?.is_employee || false,
          hire_date: res.data.user?.hire_date || "",
          status: res.data.user?.status || "",
          created_at: res.data.user?.created_at || "",
        });
      } catch (err) {
        console.error("Admin profile fetch error:", err);
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

      await axios.put("http://localhost:5000/api/admin/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Admin profile update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  const infoCards = [
    {
      title: "Clearance Level",
      value: extra.clearance_level || "N/A",
      icon: ShieldCheckIcon,
      iconWrap: "bg-[#eff6ff]",
      iconColor: "text-sky-600",
    },
    {
      title: "Employee",
      value: extra.is_employee ? "Yes" : "No",
      icon: BadgeCheckIcon,
      iconWrap: "bg-[#f5f3ff]",
      iconColor: "text-violet-600",
    },
    {
      title: "Hire Date",
      value: extra.hire_date
        ? new Date(extra.hire_date).toLocaleDateString()
        : "N/A",
      icon: CalendarDaysIcon,
      iconWrap: "bg-[#faf8ef]",
      iconColor: "text-amber-700",
    },
    {
      title: "Status",
      value: extra.status || "N/A",
      icon: ActivityIcon,
      iconWrap: "bg-[#eff6ff]",
      iconColor: "text-sky-600",
    },
    {
      title: "Created At",
      value: extra.created_at
        ? new Date(extra.created_at).toLocaleDateString()
        : "N/A",
      icon: SparklesIcon,
      iconWrap: "bg-[#f5f3ff]",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.42),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(233,213,255,0.40),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(245,245,220,0.42),_transparent_24%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <ShieldCheckIcon size={16} />
                Admin Account
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mt-2">
                Admin{" "}
                <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                  Profile
                </span>
              </h1>

              <p className="text-slate-500 mt-1">
                Manage your account information and review administrative details.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4">
              <UserCircle2Icon size={36} className="text-violet-500" />
              <div>
                <p className="font-semibold text-slate-700">
                  {form.full_name || form.username}
                </p>
                <p className="text-sm text-slate-500">{form.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md p-5 shadow-[0_10px_35px_rgba(180,160,255,0.08)] hover:shadow-[0_16px_40px_rgba(180,160,255,0.14)] transition"
            >
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <p>{card.title}</p>
                <div className={`rounded-full p-2 ${card.iconWrap}`}>
                  <card.icon size={16} className={card.iconColor} />
                </div>
              </div>

              <p className="text-xl font-semibold text-slate-800 mt-3">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#ebe7f5] bg-white/85 backdrop-blur-md shadow-[0_14px_40px_rgba(180,160,255,0.10)] p-8 mt-8"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-slate-500">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#ece8d8] text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Contact No</label>
              <input
                type="text"
                name="contact_no"
                value={form.contact_no}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-500">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d8dbe7] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 px-6 py-3 rounded-xl font-semibold shadow-md transition bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] text-slate-700 hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ShieldCheckIcon,
//   UserCircle2Icon,
//   MailIcon,
//   PhoneIcon,
//   BadgeCheckIcon,
//   CalendarDaysIcon,
//   ActivityIcon,
//   SparklesIcon,
// } from "lucide-react";

// const emptyProfile = {
//   username: "",
//   email: "",
//   full_name: "",
//   contact_no: "",
//   gender: "",
// };

// export default function AdminProfilePage() {
//   const [form, setForm] = useState(emptyProfile);
//   const [extra, setExtra] = useState({
//     clearance_level: "",
//     is_employee: false,
//     hire_date: "",
//     status: "",
//     created_at: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get("http://localhost:5000/api/admin/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });

//         setForm({
//           username: res.data.user?.username || "",
//           email: res.data.user?.email || "",
//           full_name: res.data.user?.full_name || "",
//           contact_no: res.data.user?.contact_no || "",
//           gender: res.data.user?.gender || "",
//         });

//         setExtra({
//           clearance_level: res.data.user?.clearance_level || "",
//           is_employee: res.data.user?.is_employee || false,
//           hire_date: res.data.user?.hire_date || "",
//           status: res.data.user?.status || "",
//           created_at: res.data.user?.created_at || "",
//         });
//       } catch (err) {
//         console.error("Admin profile fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const token = localStorage.getItem("token");

//       await axios.put("http://localhost:5000/api/admin/profile", form, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       alert("Profile updated successfully");
//     } catch (err) {
//       console.error("Admin profile update error:", err);
//       alert(err.response?.data?.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-500">
//         Loading profile...
//       </div>
//     );
//   }

//   const infoCards = [
//     {
//       title: "Clearance Level",
//       value: extra.clearance_level || "N/A",
//       icon: ShieldCheckIcon,
//     },
//     {
//       title: "Employee",
//       value: extra.is_employee ? "Yes" : "No",
//       icon: BadgeCheckIcon,
//     },
//     {
//       title: "Hire Date",
//       value: extra.hire_date
//         ? new Date(extra.hire_date).toLocaleDateString()
//         : "N/A",
//       icon: CalendarDaysIcon,
//     },
//     {
//       title: "Status",
//       value: extra.status || "N/A",
//       icon: ActivityIcon,
//     },
//     {
//       title: "Created At",
//       value: extra.created_at
//         ? new Date(extra.created_at).toLocaleDateString()
//         : "N/A",
//       icon: SparklesIcon,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 p-6">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 p-[2px] shadow-xl">
//           <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <div className="flex items-center gap-2 text-slate-500 text-sm">
//                 <ShieldCheckIcon size={16} />
//                 Admin Account
//               </div>

//               <h1 className="text-3xl font-bold text-slate-800 mt-2">
//                 Admin Profile
//               </h1>

//               <p className="text-slate-500 mt-1">
                
//               </p>
//             </div>

//             <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 p-4 rounded-2xl">
//               <UserCircle2Icon size={36} className="text-purple-500" />
//               <div>
//                 <p className="font-semibold text-slate-700">
//                   {form.full_name || form.username}
//                 </p>
//                 <p className="text-sm text-slate-500">{form.email}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
//           {infoCards.map((card, index) => (
//             <div
//               key={index}
//               className="rounded-2xl bg-white shadow-md border border-slate-200 p-5 hover:shadow-lg transition"
//             >
//               <div className="flex items-center justify-between text-slate-500 text-sm">
//                 <p>{card.title}</p>
//                 <card.icon size={18} />
//               </div>

//               <p className="text-xl font-semibold text-slate-800 mt-3">
//                 {card.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 mt-8"
//         >
//           <h2 className="text-xl font-semibold text-slate-800 mb-6">
//             Edit Profile
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//             <div>
//               <label className="text-sm text-slate-500">Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-slate-500">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-300"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-slate-500">Full Name</label>
//               <input
//                 type="text"
//                 name="full_name"
//                 value={form.full_name}
//                 onChange={handleChange}
//                 className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-slate-500">Contact No</label>
//               <input
//                 type="text"
//                 name="contact_no"
//                 value={form.contact_no}
//                 onChange={handleChange}
//                 className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-300"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="text-sm text-slate-500">Gender</label>
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 className="mt-1 w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//           </div>

//           <button
//             type="submit"
//             disabled={saving}
//             className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition"
//           >
//             {saving ? "Saving..." : "Update Profile"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }