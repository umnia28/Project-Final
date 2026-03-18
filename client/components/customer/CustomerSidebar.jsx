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
    { name: "Addresses", href: "/customer/addresses", icon: MapPin },
    { name: "Profile", href: "/customer/profile", icon: CatIcon },
    { name: "My Orders", href: "/customer/myorders", icon: ShoppingBasketIcon },
    { name: "Wishlist", href: "/customer/wishlist", icon: NotebookPen },
    { name: "Notifications", href: "/customer/notifications", icon: PercentSquare },
  ];

  return (
    <div className="min-w-60 border-r border-[#e5dfec] bg-white/60 backdrop-blur-md">

      {links.map((l) => {
        const isActive = pathname === l.href;

        return (
          <Link
            key={l.href}
            href={l.href}
            className={`
              relative flex items-center gap-3 p-3 transition-all duration-300
              ${isActive
                ? "bg-gradient-to-r from-[#f2e8d8] via-[#efe7fb] to-[#e6f2ff] text-slate-700 font-medium shadow-sm"
                : "text-slate-600 hover:bg-[#f8f6fc]"
              }
            `}
          >
            <l.icon
              size={18}
              className={isActive ? "text-[#8b7bd6]" : "text-slate-500"}
            />

            {l.name}

            {/* Active indicator */}
            {isActive && (
              <span className="absolute right-0 top-1.5 bottom-1.5 w-1.5 rounded-l bg-gradient-to-b from-[#a78bdb] to-[#7fb6ea]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// 'use client';

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   HomeIcon,
//   CatIcon,
//   ShoppingBasketIcon,
//   MapPin,
//   NotebookPen,
//   PercentSquare,

// } from "lucide-react";

// export default function CustomerSidebar() {
//   const pathname = usePathname();

//   const links = [
//     { name: "Dashboard", href: "/customer/dashboard", icon: HomeIcon },
//     { name: "Addresses", href: "/customer/addresses", icon: MapPin},
//     { name: "Profile", href: "/customer/profile", icon: CatIcon },
//     { name: "My Orders", href: "/customer/myorders", icon: ShoppingBasketIcon },
//     { name: "Wishlist", href: "/customer/wishlist", icon:  NotebookPen },
//     { name: "Notifications", href: "/customer/notifications", icon: PercentSquare },
//   ];

//   return (
//     <div className="min-w-60 border-r border-slate-200">
//       {links.map((l) => (
//         <Link
//           key={l.href}
//           href={l.href}
//           className={`flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 ${
//             pathname === l.href ? "bg-slate-100 font-medium" : ""
//           }`}
//         >
//           <l.icon size={18} />
//           {l.name}
//         </Link>
//       ))}
//     </div>
//   );
// }
