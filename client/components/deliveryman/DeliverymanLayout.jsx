'use client';

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import DeliverymanNavbar from "./DeliverymanNavbar";
import DeliverymanSidebar from "./DeliverymanSidebar";
import RequireRole from "@/components/RequireRole";

export default function DeliverymanLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <RequireRole allowedRoles={["delivery_man"]}>
      <div className="flex h-screen flex-col bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f4fb_45%,#f1f8ff_100%)]">
        <DeliverymanNavbar />
        <div className="flex flex-1 overflow-hidden">
          <DeliverymanSidebar />
          <div className="flex-1 overflow-y-auto p-5 lg:pl-12 lg:pt-12">
            {children}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}


// 'use client';

// import { useEffect, useState } from "react";
// import Loading from "@/components/Loading";
// import DeliverymanNavbar from "./DeliverymanNavbar";
// import DeliverymanSidebar from "./DeliverymanSidebar";
// import RequireRole from "@/components/RequireRole";

// export default function DeliverymanLayout({ children }) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   if (loading) return <Loading />;

//   return (
//     <RequireRole allowedRoles={["delivery_man"]}>
//       <div className="flex flex-col h-screen">
//         <DeliverymanNavbar />
//         <div className="flex flex-1 overflow-hidden">
//           <DeliverymanSidebar />
//           <div className="flex-1 p-5 lg:pl-12 lg:pt-12 overflow-y-auto">
//             {children}
//           </div>
//         </div>
//       </div>
//     </RequireRole>
//   );
// }
