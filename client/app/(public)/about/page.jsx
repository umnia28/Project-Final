"use client";

export default function AboutPage() {
  return (
    <div className="text-white max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About Charis Atelier</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <p className="text-zinc-300">
          Charis Atelier is a modern multi-vendor e-commerce platform where
          customers can explore and purchase products from multiple sellers in
          one place. Our goal is to make online shopping simple, secure, and
          enjoyable.
        </p>

        <p className="text-zinc-300">
          The platform connects customers, sellers, administrators, and
          delivery personnel in a unified ecosystem. Sellers can list their
          products, customers can shop easily, and delivery personnel ensure
          smooth and timely deliveries.
        </p>

        <p className="text-zinc-300">
          With secure payments, real-time order tracking, and efficient order
          management, Charis Atelier provides a seamless experience for both
          buyers and sellers.
        </p>

        <div className="pt-4 border-t border-zinc-800">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-zinc-400">
            To build a trusted online marketplace where businesses grow and
            customers enjoy a reliable shopping experience.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p className="text-zinc-400">
            To become a leading digital marketplace that empowers businesses
            and delivers exceptional value to customers worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}