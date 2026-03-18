"use client";

import { Mail, Phone, Store, Calendar, Hash } from "lucide-react";

const StoreInfo = ({ store }) => {
  const sellerImage =
    store.profile_img || "https://via.placeholder.com/100?text=Store";

  const isActive = store.store_status === "active";

  return (
    <div className="flex-1 space-y-4 text-sm">

      {/* Store Logo */}
      <img
        src={sellerImage}
        alt={store.store_name || "Store"}
        className="w-20 h-20 object-cover shadow rounded-full max-sm:mx-auto"
      />

      {/* Store Title */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <h3 className="text-xl font-semibold text-slate-800">
          {store.store_name}
        </h3>

        <span className="text-sm text-slate-500">@{store.username}</span>

        {/* Status Badge (THEMED) */}
        <span
          className={`text-xs font-semibold px-4 py-1 rounded-full ${
            isActive
              ? "bg-[#eff6ff] text-sky-700"
              : "bg-[#f5f3ff] text-violet-700"
          }`}
        >
          {store.store_status}
        </span>
      </div>

      {/* Store Details */}
      <div className="space-y-2 text-slate-600">

        <p className="flex items-center gap-2">
          <Store size={16} className="text-slate-400" />
          Store Name: {store.store_name}
        </p>

        <p className="flex items-center gap-2">
          <Hash size={16} className="text-slate-400" />
          Ref No: {store.ref_no || "N/A"}
        </p>

        <p className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          {store.contact_no || "No contact number"}
        </p>

        <p className="flex items-center gap-2">
          <Mail size={16} className="text-slate-400" />
          {store.email || "No email"}
        </p>

        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          Created on{" "}
          <span className="text-xs">
            {store.created_at
              ? new Date(store.created_at).toLocaleDateString()
              : "N/A"}
          </span>
        </p>

      </div>

      {/* Seller Info */}
      <div className="pt-4 border-t border-[#ebe7f5]">

        <p className="text-slate-700 mb-2 font-medium">Seller Info</p>

        <div className="flex items-center gap-3 text-sm">

          <img
            src={sellerImage}
            alt={store.full_name || store.username || "Seller"}
            className="w-10 h-10 rounded-full object-cover border border-[#ebe7f5]"
          />

          <div>
            <p className="text-slate-700 font-medium">
              {store.full_name || store.username || "N/A"}
            </p>

            <p className="text-slate-400 text-xs">
              {store.email || "No email"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StoreInfo;

// "use client";

// import { Mail, Phone, Store, Calendar, Hash } from "lucide-react";

// const StoreInfo = ({ store }) => {

//   const sellerImage =
//     store.profile_img || "https://via.placeholder.com/100?text=Store";

//   const statusColor =
//     store.store_status === "inactive"
//       ? "bg-red-100 text-red-800"
//       : "bg-green-100 text-green-800";

//   return (
//     <div className="flex-1 space-y-3 text-sm">

//       {/* Store Logo */}
//       <img
//         src={sellerImage}
//         alt={store.store_name || "Store"}
//         className="w-20 h-20 object-cover shadow rounded-full max-sm:mx-auto"
//       />

//       {/* Store Title */}
//       <div className="flex flex-col sm:flex-row gap-3 items-center">
//         <h3 className="text-xl font-semibold text-slate-800">
//           {store.store_name}
//         </h3>

//         <span className="text-sm text-slate-500">@{store.username}</span>

//         {/* Status Badge */}
//         <span
//           className={`text-xs font-semibold px-4 py-1 rounded-full ${statusColor}`}
//         >
//           {store.store_status}
//         </span>
//       </div>

//       {/* Store Details */}
//       <div className="space-y-2 text-slate-600">

//         <p className="flex items-center gap-2">
//           <Store size={16} />
//           Store Name: {store.store_name}
//         </p>

//         <p className="flex items-center gap-2">
//           <Hash size={16} />
//           Ref No: {store.ref_no || "N/A"}
//         </p>

//         <p className="flex items-center gap-2">
//           <Phone size={16} />
//           {store.contact_no || "No contact number"}
//         </p>

//         <p className="flex items-center gap-2">
//           <Mail size={16} />
//           {store.email || "No email"}
//         </p>

//         <p className="flex items-center gap-2">
//           <Calendar size={16} />
//           Created on{" "}
//           <span className="text-xs">
//             {store.created_at
//               ? new Date(store.created_at).toLocaleDateString()
//               : "N/A"}
//           </span>
//         </p>

//       </div>

//       {/* Seller Info */}
//       <div className="pt-3 border-t border-slate-200">

//         <p className="text-slate-700 mb-2">Seller Info</p>

//         <div className="flex items-center gap-2 text-sm">

//           <img
//             src={sellerImage}
//             alt={store.full_name || store.username || "Seller"}
//             className="w-9 h-9 rounded-full object-cover"
//           />

//           <div>
//             <p className="text-slate-600 font-medium">
//               {store.full_name || store.username || "N/A"}
//             </p>

//             <p className="text-slate-400">
//               {store.email || "No email"}
//             </p>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default StoreInfo;