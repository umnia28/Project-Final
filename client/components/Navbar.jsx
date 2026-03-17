"use client";

import { Search, ShoppingCartIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const cartCount = useSelector((state) => state.cart.total);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      if (payload.exp < now) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        setUser(null);
        router.push("/auth");
        return;
      }

      setUser(JSON.parse(userStr));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      setUser(null);
    }
  }, [router]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${encodeURIComponent(search)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(244,114,182,0.12)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50" />
        <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute left-1/3 top-0 h-60 w-60 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-3xl font-semibold text-slate-700">
          <span className="font-serif text-4xl text-orange-600">Charis</span>
          <span className="font-serif text-2xl text-pink-700">Atelier</span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 shadow-sm backdrop-blur lg:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-rose-50"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-pink-50"
          >
            Shop
          </Link>

          <Link
            href="/about"
            className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-orange-50"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-rose-50"
          >
            Contact
          </Link>

          {user?.role === "customer" && (
            <Link
              href="/customer/myorders"
              className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-purple-50"
            >
              My <b>Orders</b>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm backdrop-blur md:flex"
          >
            <Search size={16} className="text-slate-500" />
            <input
              className="bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-[1px]"
          >
            <ShoppingCartIcon size={20} className="text-slate-700" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-[10px] font-semibold text-white shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm backdrop-blur sm:flex">
              <span className="text-sm text-slate-700">
                Welcome, <br />
                <b>{user.username}!</b>
              </span>

              <Link
                href={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "seller"
                    ? "/seller"
                    : user.role === "delivery_man"
                    ? "/deliveryman/dashboard"
                    : "/customer/dashboard"
                }
                className="flex items-center gap-1 rounded-full border border-white/60 bg-white/70 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text px-4 py-1.5 text-xs font-serif tracking-wider text-transparent backdrop-blur transition hover:-translate-y-[1px] hover:shadow-md"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 px-4 py-2 text-sm font-medium text-white shadow transition hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 px-6 py-2 text-sm font-medium text-white shadow transition hover:scale-105">
                <Sparkles size={16} />
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;