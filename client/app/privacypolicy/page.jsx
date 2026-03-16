'use client';

import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, Mail, RefreshCw } from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Information We Collect",
    content:
      "We may collect your name, email address, contact number, shipping address, account details, and order history when you use our platform. We also collect limited technical information such as browser type, device type, and usage activity to improve performance and security.",
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content:
      "Your information is used to create and manage your account, process orders, deliver products, provide customer support, improve platform features, and maintain platform safety. We may also use contact information to send important updates regarding orders, payments, and account activity.",
  },
  {
    icon: Eye,
    title: "Data Sharing",
    content:
      "We do not sell your personal information. Relevant information may be shared with sellers, delivery personnel, payment processors, or service providers only when necessary to complete transactions or operate the platform properly.",
  },
  {
    icon: FileText,
    title: "Cookies and Tracking",
    content:
      "We may use cookies and similar technologies to keep you logged in, remember your preferences, analyze platform usage, and enhance overall experience. You can manage cookie preferences through your browser settings.",
  },
  {
    icon: RefreshCw,
    title: "Policy Updates",
    content:
      "This Privacy Policy may be updated from time to time to reflect platform changes, legal requirements, or improvements in service. Updated versions will be posted on this page with a revised effective date.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions or concerns regarding this Privacy Policy, please contact our support team through the platform’s contact page or official support email.",
  },
];

export default function PrivacyPolicyPage() {
  const effectiveDate = "March 16, 2026";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 md:px-10 py-10">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Legal & Safety
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mt-3">
              Privacy Policy
            </h1>
            <p className="text-slate-300 mt-4 max-w-3xl leading-7">
              Your privacy matters to us. This page explains what information we
              collect, how we use it, and how we protect it when you use our platform.
            </p>
            <p className="text-sm text-slate-300 mt-4">
              Effective date: {effectiveDate}
            </p>
          </div>

          <div className="px-6 md:px-10 py-8 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-5 bg-slate-50 hover:bg-white transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {section.title}
                        </h2>
                        <p className="text-slate-600 mt-2 leading-7 text-sm md:text-base">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50">
              <h3 className="text-xl font-semibold text-slate-900">
                Your Rights
              </h3>
              <p className="text-slate-600 mt-3 leading-7">
                You may request updates to your personal information, manage your
                account details, and contact support regarding privacy-related concerns.
                We encourage users to keep their account information accurate and secure.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-5 py-3 hover:bg-slate-800 transition"
              >
                Back to Home
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700 hover:bg-slate-100 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
