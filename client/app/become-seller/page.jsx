'use client';
import { useState } from "react";
import toast from "react-hot-toast";
import { Palette, Store, Sparkles, Brush, ArrowRight } from "lucide-react";

const API = "http://localhost:5000";

export default function BecomeSellerPage() {
  const [businessName, setBusinessName] = useState("");

  const apply = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please login first");

    const res = await fetch(`${API}/api/seller/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ business_name: businessName }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Apply failed");
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await toast.promise(apply(), {
      loading: "Submitting...",
      success: "Application submitted ✅",
      error: (err) => err.message || "Apply failed",
    });

    setBusinessName("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.18),_transparent_30%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="relative overflow-hidden rounded-[28px] border border-[#dbeafe]/40 bg-gradient-to-br from-[#eaf4ff] via-[#f5f3ff] to-[#f5f5dc] text-slate-800 shadow-[0_20px_60px_rgba(180,160,255,0.12)]">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#dbeafe]/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#c4b5fd]/25 blur-3xl" />

          <div className="relative h-full p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm">
                <Palette size={16} />
                Join the creative marketplace
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight text-slate-800">
                Turn your
                <span className="block bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                  art into a store
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-slate-600 leading-7">
                Share handcrafted pieces, decor, paintings, pottery, and creative
                products with customers who value artistic work. Apply as a seller
                and start building your unique storefront.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-sm">
                <Brush className="mb-3 text-sky-500" size={22} />
                <h3 className="font-semibold text-slate-800">Show Your Style</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Present your creations in a space made for artistic brands.
                </p>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-sm">
                <Store className="mb-3 text-violet-500" size={22} />
                <h3 className="font-semibold text-slate-800">Open Your Store</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Build your own seller identity and reach more buyers.
                </p>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/45 p-4 backdrop-blur-sm">
                <Sparkles className="mb-3 text-indigo-400" size={22} />
                <h3 className="font-semibold text-slate-800">Grow Creatively</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Expand your audience through a curated creative marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ebe7f5] bg-white/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(180,160,255,0.10)]">
          <div className="p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] text-slate-700 px-4 py-2 text-sm font-medium">
              <Palette size={16} />
              Seller Application
            </div>

            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              Become a Seller
            </h2>

            <p className="mt-3 text-slate-600 leading-7">
              Tell us your business name and submit your application. Once approved,
              you’ll be able to start selling your artistic products on the platform.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name
                </label>
                <input
                  className="w-full rounded-2xl border border-[#d8dbe7] bg-[#f8fbff] px-4 py-3 text-slate-800 outline-none transition focus:border-[#c4b5fd] focus:bg-white focus:ring-4 focus:ring-[#e9d5ff]/40"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="rounded-2xl border border-[#ebe7f5] bg-gradient-to-r from-[#eff6ff] via-[#f5f3ff] to-[#faf8ef] p-4 text-sm text-slate-600">
                Your application will be reviewed before seller access is granted.
                Make sure your business name is accurate and professional.
              </div>

              <button
                type="submit"
                className="group w-full rounded-2xl bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] px-5 py-3.5 text-slate-700 font-semibold transition hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_10px_22px_rgba(180,160,255,0.14)]"
              >
                Apply Now
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Palette, Store, Sparkles, Brush, ArrowRight } from "lucide-react";

// const API = "http://localhost:5000";

// export default function BecomeSellerPage() {
//   const [businessName, setBusinessName] = useState("");

//   const apply = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Please login first");

//     const res = await fetch(`${API}/api/seller/apply`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ business_name: businessName }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Apply failed");
//     }

//     return data;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await toast.promise(apply(), {
//       loading: "Submitting...",
//       success: "Application submitted ✅",
//       error: (err) => err.message || "Apply failed",
//     });

//     setBusinessName("");
//   };

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_30%),linear-gradient(to_bottom,_#faf7f2,_#f8fafc)] px-4 py-10">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
//         <div className="relative overflow-hidden rounded-[28px] border border-orange-200/60 bg-gradient-to-br from-[#2b1d16] via-[#4b2e24] to-[#7c4a2d] text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
//           <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />
//           <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-pink-400/15 blur-3xl" />

//           <div className="relative h-full p-8 md:p-10 flex flex-col justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
//                 <Palette size={16} />
//                 Join the creative marketplace
//               </div>

//               <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
//                 Turn your
//                 <span className="block bg-gradient-to-r from-orange-300 via-amber-200 to-pink-300 bg-clip-text text-transparent">
//                   art into a store
//                 </span>
//               </h1>

//               <p className="mt-5 max-w-xl text-white/80 leading-7">
//                 Share handcrafted pieces, decor, paintings, pottery, and creative
//                 products with customers who value artistic work. Apply as a seller
//                 and start building your unique storefront.
//               </p>
//             </div>

//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
//                 <Brush className="mb-3 text-orange-200" size={22} />
//                 <h3 className="font-semibold">Show Your Style</h3>
//                 <p className="mt-1 text-sm text-white/75">
//                   Present your creations in a space made for artistic brands.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
//                 <Store className="mb-3 text-amber-200" size={22} />
//                 <h3 className="font-semibold">Open Your Store</h3>
//                 <p className="mt-1 text-sm text-white/75">
//                   Build your own seller identity and reach more buyers.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
//                 <Sparkles className="mb-3 text-pink-200" size={22} />
//                 <h3 className="font-semibold">Grow Creatively</h3>
//                 <p className="mt-1 text-sm text-white/75">
//                   Expand your audience through a curated creative marketplace.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-[28px] border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
//           <div className="p-8 md:p-10">
//             <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-2 text-sm font-medium">
//               <Palette size={16} />
//               Seller Application
//             </div>

//             <h2 className="mt-5 text-3xl font-bold text-slate-900">
//               Become a Seller
//             </h2>

//             <p className="mt-3 text-slate-600 leading-7">
//               Tell us your business name and submit your application. Once approved,
//               you’ll be able to start selling your artistic products on the platform.
//             </p>

//             <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Business Name
//                 </label>
//                 <input
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
//                   placeholder="Enter your business name"
//                   value={businessName}
//                   onChange={(e) => setBusinessName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-sm text-slate-600">
//                 Your application will be reviewed before seller access is granted.
//                 Make sure your business name is accurate and professional.
//               </div>

//               <button
//                 type="submit"
//                 className="group w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-white font-medium transition hover:bg-slate-800 active:scale-[0.99] flex items-center justify-center gap-2"
//               >
//                 Apply Now
//                 <ArrowRight
//                   size={18}
//                   className="transition group-hover:translate-x-1"
//                 />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }