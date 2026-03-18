'use client';

import { useState } from "react";
import { Crown, CheckCircle2, Sparkles, Zap, Shield, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000";

const benefits = [
  {
    icon: Sparkles,
    title: "Exclusive Member Deals",
    text: "Unlock premium discounts and member-only product offers across selected categories.",
  },
  {
    icon: Zap,
    title: "Priority Access",
    text: "Get early access to special collections, limited-stock launches, and featured promotions.",
  },
  {
    icon: Shield,
    title: "Premium Support",
    text: "Receive faster support response and improved assistance for orders and account issues.",
  },
  {
    icon: Star,
    title: "Enhanced Experience",
    text: "Enjoy a more premium shopping experience with curated recommendations and future member perks.",
  },
];

const comparison = [
  { feature: "Standard Shopping Access", free: true, plus: true },
  { feature: "Member-only Offers", free: false, plus: true },
  { feature: "Priority Support", free: false, plus: true },
  { feature: "Early Access to Collections", free: false, plus: true },
  { feature: "Premium Badge / Status", free: false, plus: true },
];

export default function PlusMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const handleBecomePlus = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        throw new Error("Please login first");
      }

      const res = await fetch(`${API}/api/plus-member/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      if (!res.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      toast.success("Welcome to Plus Membership ✨");
      router.push("/profile");
    } catch (err) {
      console.error("PLUS MEMBERSHIP ERROR:", err);
      toast.error(err.message || "Could not complete subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.22),_transparent_30%),linear-gradient(to_bottom,_#fcfcfa,_#f8fbff,_#faf7ff)] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <div className="bg-white/85 backdrop-blur-md border border-[#ebe7f5] rounded-3xl shadow-[0_16px_40px_rgba(180,160,255,0.10)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] px-6 md:px-10 py-10 text-slate-800">
              <div className="inline-flex items-center gap-2 bg-white/50 border border-white/60 rounded-full px-4 py-2 text-sm text-slate-600">
                <Crown size={16} />
                Premium Membership
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mt-5">
                Become a{" "}
                <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                  Plus Member
                </span>
              </h1>

              <p className="mt-4 text-slate-600 max-w-2xl leading-7">
                Upgrade your experience with exclusive perks, special offers,
                premium support, and early access benefits designed for our most
                active members.
              </p>
            </div>

            <div className="px-6 md:px-10 py-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-5">
                Why join Plus?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {benefits.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#ebe7f5] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] text-slate-700 p-3 rounded-2xl shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 mt-2 leading-7 text-sm">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Compare Plans
                </h3>

                <div className="overflow-x-auto border border-[#ebe7f5] rounded-2xl">
                  <table className="w-full text-sm">
                    <thead className="bg-[linear-gradient(90deg,#eff6ff,#f5f3ff,#faf8ef)]">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">
                          Feature
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-center">
                          Free
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-center">
                          Plus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, idx) => (
                        <tr key={idx} className="border-t border-[#ebe7f5]">
                          <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                          <td className="px-4 py-3 text-center">
                            {row.free ? (
                              <CheckCircle2 className="mx-auto text-sky-600" size={18} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {row.plus ? (
                              <CheckCircle2 className="mx-auto text-violet-600" size={18} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-[#ebe7f5] rounded-3xl shadow-[0_16px_40px_rgba(180,160,255,0.10)] p-6 md:p-7 sticky top-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] text-slate-700 p-3 rounded-2xl">
                <Crown size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Join Plus
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Choose a membership plan
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selectedPlan === "monthly"
                    ? "border-[#c4b5fd] bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] text-slate-800 shadow-[0_10px_22px_rgba(180,160,255,0.12)]"
                    : "border-[#ebe7f5] bg-[#f8fbff] text-slate-700 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Monthly Plan</span>
                  <span className="font-bold">৳199</span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    selectedPlan === "monthly" ? "text-slate-600" : "text-slate-500"
                  }`}
                >
                  Flexible monthly membership
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("yearly")}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selectedPlan === "yearly"
                    ? "border-[#c4b5fd] bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] text-slate-800 shadow-[0_10px_22px_rgba(180,160,255,0.12)]"
                    : "border-[#ebe7f5] bg-[#f8fbff] text-slate-700 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Yearly Plan</span>
                  <span className="font-bold">৳1999</span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    selectedPlan === "yearly" ? "text-slate-600" : "text-slate-500"
                  }`}
                >
                  Best value for long-term members
                </p>
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[linear-gradient(90deg,#eff6ff,#f5f3ff,#faf8ef)] border border-[#ebe7f5] p-4">
              <p className="text-sm text-slate-500">Selected Plan</p>
              <p className="text-lg font-semibold text-slate-900 mt-1 capitalize">
                {selectedPlan}
              </p>
            </div>

            <button
              onClick={handleBecomePlus}
              disabled={loading}
              className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#dbeafe] via-[#c4b5fd] to-[#f5f5dc] text-slate-700 py-3.5 font-semibold hover:opacity-90 transition disabled:opacity-60 shadow-[0_10px_22px_rgba(180,160,255,0.14)]"
            >
              {loading ? "Processing..." : "Become a Plus Member"}
            </button>

            <p className="text-xs text-slate-500 mt-4 leading-6">
              By continuing, you agree to the membership terms, renewal rules,
              and platform policies. Membership features may expand over time as
              new premium tools are introduced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import { useState } from "react";
// import { Crown, CheckCircle2, Sparkles, Zap, Shield, Star } from "lucide-react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// const API = "http://localhost:5000";

// const benefits = [
//   {
//     icon: Sparkles,
//     title: "Exclusive Member Deals",
//     text: "Unlock premium discounts and member-only product offers across selected categories.",
//   },
//   {
//     icon: Zap,
//     title: "Priority Access",
//     text: "Get early access to special collections, limited-stock launches, and featured promotions.",
//   },
//   {
//     icon: Shield,
//     title: "Premium Support",
//     text: "Receive faster support response and improved assistance for orders and account issues.",
//   },
//   {
//     icon: Star,
//     title: "Enhanced Experience",
//     text: "Enjoy a more premium shopping experience with curated recommendations and future member perks.",
//   },
// ];

// const comparison = [
//   { feature: "Standard Shopping Access", free: true, plus: true },
//   { feature: "Member-only Offers", free: false, plus: true },
//   { feature: "Priority Support", free: false, plus: true },
//   { feature: "Early Access to Collections", free: false, plus: true },
//   { feature: "Premium Badge / Status", free: false, plus: true },
// ];

// export default function PlusMemberPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState("monthly");

//   const handleBecomePlus = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/auth");
//         throw new Error("Please login first");
//       }

//       const res = await fetch(`${API}/api/plus-member/subscribe`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           plan: selectedPlan,
//         }),
//       });

//       const contentType = res.headers.get("content-type") || "";
//       const data = contentType.includes("application/json")
//         ? await res.json()
//         : { message: "Unexpected server response" };

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to subscribe");
//       }

//       toast.success("Welcome to Plus Membership ✨");
//       router.push("/profile");
//     } catch (err) {
//       console.error("PLUS MEMBERSHIP ERROR:", err);
//       toast.error(err.message || "Could not complete subscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">
//       <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
//         <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
//             <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-slate-900 px-6 md:px-10 py-10 text-white">
//               <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm">
//                 <Crown size={16} />
//                 Premium Membership
//               </div>

//               <h1 className="text-3xl md:text-5xl font-bold mt-5">
//                 Become a Plus Member
//               </h1>

//               <p className="mt-4 text-white/90 max-w-2xl leading-7">
//                 Upgrade your experience with exclusive perks, special offers,
//                 premium support, and early access benefits designed for our most
//                 active members.
//               </p>
//             </div>

//             <div className="px-6 md:px-10 py-8">
//               <h2 className="text-2xl font-semibold text-slate-900 mb-5">
//                 Why join Plus?
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {benefits.map((item, idx) => {
//                   const Icon = item.icon;
//                   return (
//                     <div
//                       key={idx}
//                       className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="bg-slate-900 text-white p-3 rounded-2xl shrink-0">
//                           <Icon size={20} />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-slate-900">
//                             {item.title}
//                           </h3>
//                           <p className="text-slate-600 mt-2 leading-7 text-sm">
//                             {item.text}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="mt-8">
//                 <h3 className="text-xl font-semibold text-slate-900 mb-4">
//                   Compare Plans
//                 </h3>

//                 <div className="overflow-x-auto border border-slate-200 rounded-2xl">
//                   <table className="w-full text-sm">
//                     <thead className="bg-slate-100">
//                       <tr>
//                         <th className="text-left px-4 py-3 font-semibold text-slate-700">
//                           Feature
//                         </th>
//                         <th className="px-4 py-3 font-semibold text-slate-700 text-center">
//                           Free
//                         </th>
//                         <th className="px-4 py-3 font-semibold text-slate-700 text-center">
//                           Plus
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comparison.map((row, idx) => (
//                         <tr key={idx} className="border-t border-slate-200">
//                           <td className="px-4 py-3 text-slate-700">{row.feature}</td>
//                           <td className="px-4 py-3 text-center">
//                             {row.free ? (
//                               <CheckCircle2 className="mx-auto text-green-600" size={18} />
//                             ) : (
//                               <span className="text-slate-400">—</span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-center">
//                             {row.plus ? (
//                               <CheckCircle2 className="mx-auto text-green-600" size={18} />
//                             ) : (
//                               <span className="text-slate-400">—</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-7 sticky top-6">
//             <div className="flex items-center gap-3">
//               <div className="bg-amber-500 text-white p-3 rounded-2xl">
//                 <Crown size={22} />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold text-slate-900">
//                   Join Plus
//                 </h2>
//                 <p className="text-slate-500 text-sm mt-1">
//                   Choose a membership plan
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 space-y-3">
//               <button
//                 type="button"
//                 onClick={() => setSelectedPlan("monthly")}
//                 className={`w-full text-left rounded-2xl border p-4 transition ${
//                   selectedPlan === "monthly"
//                     ? "border-slate-900 bg-slate-900 text-white"
//                     : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="font-semibold">Monthly Plan</span>
//                   <span className="font-bold">৳199</span>
//                 </div>
//                 <p className={`text-sm mt-1 ${selectedPlan === "monthly" ? "text-slate-300" : "text-slate-500"}`}>
//                   Flexible monthly membership
//                 </p>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setSelectedPlan("yearly")}
//                 className={`w-full text-left rounded-2xl border p-4 transition ${
//                   selectedPlan === "yearly"
//                     ? "border-slate-900 bg-slate-900 text-white"
//                     : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="font-semibold">Yearly Plan</span>
//                   <span className="font-bold">৳1999</span>
//                 </div>
//                 <p className={`text-sm mt-1 ${selectedPlan === "yearly" ? "text-slate-300" : "text-slate-500"}`}>
//                   Best value for long-term members
//                 </p>
//               </button>
//             </div>

//             <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
//               <p className="text-sm text-slate-500">Selected Plan</p>
//               <p className="text-lg font-semibold text-slate-900 mt-1 capitalize">
//                 {selectedPlan}
//               </p>
//             </div>

//             <button
//               onClick={handleBecomePlus}
//               disabled={loading}
//               className="w-full mt-6 rounded-2xl bg-slate-900 text-white py-3.5 font-medium hover:bg-slate-800 transition disabled:opacity-60"
//             >
//               {loading ? "Processing..." : "Become a Plus Member"}
//             </button>

//             <p className="text-xs text-slate-500 mt-4 leading-6">
//               By continuing, you agree to the membership terms, renewal rules,
//               and platform policies. Membership features may expand over time as
//               new premium tools are introduced.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }