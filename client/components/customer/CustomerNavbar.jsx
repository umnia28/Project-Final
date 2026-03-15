/*'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="font-serif text-orange-600 text-5xl">Charis</span>
        <span className="font-serif text-pink-700 text-3xl">Atelier</span>

        <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-blue-800">
          Customer
        </p>
      </Link>

      <div className="flex items-center gap-3">
        <p>Hi, {name}</p>
      </div>
    </div>
  );
};

export default CustomerNavbar;
*/

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
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="font-serif text-orange-600 text-5xl">Charis</span>
        <span className="font-serif text-pink-700 text-3xl">Atelier</span>

        <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 py-0.5 rounded-full flex items-center gap-2 text-white bg-blue-800">
          <LayoutDashboard className="w-3.5 h-3.5" />
          Customer
        </p>
      </Link>

      <div className="flex items-center gap-3">
        <p>Hi, {name}</p>
      </div>
    </div>
  );
};

export default CustomerNavbar;
