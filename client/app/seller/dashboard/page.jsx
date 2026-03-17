// 'use client';

// import SellerLayout from "@/components/seller/SellerLayout";

// export default function SellerDashboardPage() {
//   return (
//     <SellerLayout>
//       <div className="text-slate-500">
//         <h1 className="text-2xl">Seller <span className="text-slate-800 font-medium">Dashboard</span></h1>
//         <p className="mt-2">Welcome seller.</p>
//       </div>
//     </SellerLayout>
//   );
// }

"use client";

import SellerLayout from "@/components/seller/SellerLayout";

export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <div className="rounded-[24px] border border-[#E8E1F0] bg-gradient-to-br from-[#FFFCF8] via-[#F8F2FE] to-[#EAF4FF] p-8 shadow-[0_10px_30px_rgba(217,194,240,0.18)]">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FAEAD7] via-[#F1E7FB] to-[#E7F1FD] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8D6DB3]">
          Seller Space
        </div>

        <h1 className="mt-5 text-2xl text-stone-700">
          Seller <span className="font-semibold text-stone-900">Dashboard</span>
        </h1>

        <p className="mt-2 text-[15px] text-stone-500">
          Welcome seller.
        </p>
      </div>
    </SellerLayout>
  );
}