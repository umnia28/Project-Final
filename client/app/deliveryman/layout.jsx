import DeliverymanLayout from "@/components/deliveryman/DeliverymanLayout";

export const metadata = {
  title: "CharisAtelier - Deliveryman",
  description: "Deliveryman dashboard",
};

export default function RootDeliverymanLayout({ children }) {
  return <DeliverymanLayout>{children}</DeliverymanLayout>;
}