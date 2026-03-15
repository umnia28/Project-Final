'use client';

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";
import RequireRole from "@/components/RequireRole";

export default function CustomerLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <RequireRole allowedRoles={["customer"]}>
      <div className="flex flex-col h-screen">
        <CustomerNavbar />
        <div className="flex flex-1 overflow-hidden">
          <CustomerSidebar />
          <div className="flex-1 p-5 lg:pl-12 lg:pt-12 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
