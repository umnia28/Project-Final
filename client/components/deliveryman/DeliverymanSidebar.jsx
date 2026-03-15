'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CatIcon,
  ShoppingBasketIcon,
  DollarSign,
  PercentSquare,
  NotebookIcon,

} from "lucide-react";

export default function DeliverymanSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/deliveryman/dashboard", icon: HomeIcon },
    { name: "Profile", href: "/deliveryman/profile", icon: CatIcon },
    { name: "Assigned Orders", href: "/deliveryman/assignedorders", icon: NotebookIcon},
    { name: "Delivered Orders", href: "/deliveryman/deliveredorders", icon: ShoppingBasketIcon },
    { name: "Salary", href: "/deliveryman/salary", icon:  DollarSign },
    { name: "Notifications", href: "/deliveryman/notifications", icon: PercentSquare },
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
