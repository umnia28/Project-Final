import CustomerLayout from "@/components/customer/CustomerLayout";

export const metadata = {
  title: "CharisAtelier - Customer",
  description: "Customer dashboard",
};

export default function RootCustomerLayout({ children }) {
  return <CustomerLayout>{children}</CustomerLayout>;
}
