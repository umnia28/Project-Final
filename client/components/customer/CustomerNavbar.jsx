'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

const CustomerNavbar = () => {
  const [name, setName] = useState("Customer");

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      setName(user?.username || user?.full_name || "Customer");
    } catch {
      setName("Customer");
    }
  }, []);

  return (
    <div className="relative flex items-center justify-between px-8 md:px-12 py-4 border-b border-[#ebe7f5] bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_rgba(180,160,255,0.08)]">

      {/* background glow */}
      <div className="pointer-events-none absolute -top-10 left-0 h-40 w-40 rounded-full bg-[#dbeafe]/30 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-[#e9d5ff]/25 blur-3xl" />

      {/* Logo */}
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        
        <span className="font-serif text-4xl md:text-5xl bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-transparent">
          Charis
        </span>

        <span className="font-serif text-2xl md:text-3xl ml-1 text-slate-700">
          Atelier
        </span>

        {/* Customer Badge */}
        <span className="absolute -top-2 -right-16 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-3 py-0.5 text-[10px] md:text-xs font-semibold text-white shadow-md">
          <LayoutDashboard className="w-3 h-3" />
          Customer
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3 text-slate-600">
        <div className="rounded-full border border-[#ebe7f5] bg-white/80 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-md">
          Hi, {name}
        </div>
      </div>
    </div>
  );
};

export default CustomerNavbar;

// 'use client';

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { LayoutDashboard } from "lucide-react";

// const CustomerNavbar = () => {
//   const [name, setName] = useState("Customer");

//   useEffect(() => {
//     try {
//       const userStr = localStorage.getItem("user");
//       const user = userStr ? JSON.parse(userStr) : null;
//       setName(user?.username || user?.full_name || "Customer");
//     } catch {
//       setName("Customer");
//     }
//   }, []);

//   return (
//     <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
//       <Link href="/" className="relative text-4xl font-semibold text-slate-700">
//         <span className="font-serif text-orange-600 text-5xl">Charis</span>
//         <span className="font-serif text-pink-700 text-3xl">Atelier</span>

//         <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 py-0.5 rounded-full flex items-center gap-2 text-white bg-blue-800">
//           <LayoutDashboard className="w-3.5 h-3.5" />
//           Customer
//         </p>
//       </Link>

//       <div className="flex items-center gap-3">
//         <p>Hi, {name}</p>
//       </div>
//     </div>
//   );
// };

// export default CustomerNavbar;
