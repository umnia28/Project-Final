"use client";

import { Sparkles, HeartHandshake, Eye, Gem } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden px-6 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-pink-50 via-white to-orange-50" />
      <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-purple-200/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Our Story
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            About Charis Atelier
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-7 text-sm sm:text-base">
            A thoughtfully crafted marketplace where creativity, commerce, and
            trust come together in one seamless experience.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 sm:p-8 md:p-10 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Left content */}
            <div className="space-y-5">
              <p className="text-slate-700 leading-8">
                Charis Atelier is a modern multi-vendor e-commerce platform where
                customers can explore and purchase products from multiple sellers in
                one place. Our goal is to make online shopping simple, secure, and
                enjoyable.
              </p>

              <p className="text-slate-700 leading-8">
                The platform connects customers, sellers, administrators, and
                delivery personnel in a unified ecosystem. Sellers can list their
                products, customers can shop easily, and delivery personnel ensure
                smooth and timely deliveries.
              </p>

              <p className="text-slate-700 leading-8">
                With secure payments, real-time order tracking, and efficient order
                management, Charis Atelier provides a seamless experience for both
                buyers and sellers.
              </p>
            </div>

            {/* Right highlights */}
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/70 bg-gradient-to-br from-pink-50 via-white to-orange-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow">
                    <Gem size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Platform Focus</p>
                    <p className="font-semibold text-slate-800">Elegant Multi-Vendor Shopping</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow">
                    <HeartHandshake size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="font-semibold text-slate-800">Simple, Secure, Enjoyable</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-gradient-to-br from-orange-50 via-white to-pink-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white shadow">
                    <Eye size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Core Promise</p>
                    <p className="font-semibold text-slate-800">Reliable End-to-End Marketplace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission + Vision */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white/90 via-pink-50/70 to-purple-50/60 p-6 shadow-[0_15px_40px_rgba(244,114,182,0.08)]">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="mt-4 text-slate-600 leading-8">
                To build a trusted online marketplace where businesses grow and
                customers enjoy a reliable shopping experience.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-white/90 via-orange-50/70 to-pink-50/60 p-6 shadow-[0_15px_40px_rgba(251,146,60,0.08)]">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Our Vision
              </h2>
              <p className="mt-4 text-slate-600 leading-8">
                To become a leading digital marketplace that empowers businesses
                and delivers exceptional value to customers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}