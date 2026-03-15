'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CatIcon,
  ShoppingBasketIcon,
  MapPin,
  NotebookPen,
  PercentSquare,

} from "lucide-react";

export default function CustomerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/customer/dashboard", icon: HomeIcon },
    { name: "Addresses", href: "/customer/addresses", icon: MapPin},
    { name: "Profile", href: "/customer/profile", icon: CatIcon },
    { name: "My Orders", href: "/customer/myorders", icon: ShoppingBasketIcon },
    { name: "Wishlist", href: "/customer/wishlist", icon:  NotebookPen },
    { name: "Notifications", href: "/customer/notifications", icon: PercentSquare },
  ];

  return (
    <div className="min-w-60 border-r border-slate-200">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 ${
            pathname === l.href ? "bg-slate-100 font-medium" : ""
          }`}
        >
          <l.icon size={18} />
          {l.name}
        </Link>
      ))}
    </div>
  );
}
