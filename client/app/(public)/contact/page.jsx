"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-6 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#f7f1e8] via-white to-[#eef6ff]" />
      <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[#e6d8c3]/30 blur-3xl" />
      <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-[#d7c4ef]/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#bfdaf6]/25 blur-3xl" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9cde7]/70 bg-gradient-to-r from-[#f2e8d8]/80 via-[#efe7fb]/80 to-[#e6f2ff]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#8b7bd6]" />
            Get In Touch
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-transparent">
            Contact Charis Atelier
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            Have a question, suggestion, or partnership idea? We'd love to hear
            from you.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_70px_rgba(167,139,219,0.08)] backdrop-blur-xl">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-500">
                Your Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8c3a5] transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a78bdb] transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">
                Message
              </label>
              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7fb6ea] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full sm:w-auto
                bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea]
                text-white
                px-8 py-3
                rounded-full
                font-semibold
                shadow-[0_12px_30px_rgba(167,139,219,0.20)]
                hover:scale-105
                active:scale-95
                transition-all
                disabled:opacity-60
              "
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-10 grid gap-6 border-t border-slate-200 pt-8 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border border-white/60 bg-gradient-to-br from-[#f7f1e8] to-white p-4 shadow-sm">
              <Mail className="text-[#d8c3a5]" size={20} />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-700">
                  support@charisatelier.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/60 bg-gradient-to-br from-[#efe7fb] to-white p-4 shadow-sm">
              <Phone className="text-[#a78bdb]" size={20} />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-700">
                  +880 1700 000000
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/60 bg-gradient-to-br from-[#eef6ff] to-white p-4 shadow-sm">
              <MapPin className="text-[#7fb6ea]" size={20} />
              <div>
                <p className="text-sm text-slate-500">Address</p>
                <p className="font-medium text-slate-700">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

// export default function ContactPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to send message");
//       }

//       alert("Message sent successfully!");

//       setForm({
//         name: "",
//         email: "",
//         message: "",
//       });
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative px-6 py-12 overflow-hidden">
//       {/* Background glow */}
//       <div className="absolute inset-0 -z-20 bg-gradient-to-br from-pink-50 via-white to-orange-50" />
//       <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
//       <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-purple-200/25 blur-3xl" />
//       <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-orange-200/25 blur-3xl" />

//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
//             <Sparkles className="h-3.5 w-3.5 text-pink-500" />
//             Get In Touch
//           </div>

//           <h1 className="mt-5 text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
//             Contact Charis Atelier
//           </h1>

//           <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
//             Have a question, suggestion, or partnership idea? We'd love to hear
//             from you.
//           </p>
//         </div>

//         {/* Main card */}
//         <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl">

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">

//             <div>
//               <label className="text-slate-500 text-sm font-medium">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//                 className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
//               />
//             </div>

//             <div>
//               <label className="text-slate-500 text-sm font-medium">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//                 className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
//               />
//             </div>

//             <div>
//               <label className="text-slate-500 text-sm font-medium">
//                 Message
//               </label>
//               <textarea
//                 required
//                 rows="5"
//                 value={form.message}
//                 onChange={(e) =>
//                   setForm({ ...form, message: e.target.value })
//                 }
//                 className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="
//                 w-full sm:w-auto
//                 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400
//                 text-white
//                 px-8 py-3
//                 rounded-full
//                 font-semibold
//                 shadow-[0_12px_30px_rgba(236,72,153,0.20)]
//                 hover:scale-105
//                 active:scale-95
//                 transition-all
//                 disabled:opacity-60
//               "
//             >
//               {loading ? "Sending..." : "Send Message"}
//             </button>
//           </form>

//           {/* Contact Info */}
//           <div className="mt-10 pt-8 border-t border-slate-200 grid md:grid-cols-3 gap-6">

//             <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-white/60 shadow-sm">
//               <Mail className="text-pink-500" size={20} />
//               <div>
//                 <p className="text-sm text-slate-500">Email</p>
//                 <p className="text-slate-700 font-medium">
//                   support@charisatelier.com
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-white/60 shadow-sm">
//               <Phone className="text-purple-500" size={20} />
//               <div>
//                 <p className="text-sm text-slate-500">Phone</p>
//                 <p className="text-slate-700 font-medium">
//                   +880 1700 000000
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-white/60 shadow-sm">
//               <MapPin className="text-orange-500" size={20} />
//               <div>
//                 <p className="text-sm text-slate-500">Address</p>
//                 <p className="text-slate-700 font-medium">
//                   Dhaka, Bangladesh
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }