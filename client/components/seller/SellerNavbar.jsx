'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";

const SellerNavbar = () => {
  const [name, setName] = useState("Seller");

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      setName(user?.username || user?.full_name || "Seller");
    } catch {
      setName("Seller");
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

        {/* Seller Badge */}
        <span className="absolute -top-2 -right-16 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-3 py-0.5 text-[10px] md:text-xs font-semibold text-white shadow-md">
          <Store className="w-3 h-3" />
          Seller
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

export default SellerNavbar;