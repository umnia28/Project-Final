/*'use client';

import { Search, ShoppingCartIcon } from "lucide-react";
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
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-semibold text-slate-700">
          <span className="font-serif text-orange-600 text-4xl">Charis</span>
          <span className="font-serif text-pink-700 text-2xl">Atelier</span>
        </Link>

        <div className="hidden md:flex gap-6 text-slate-700 items-center">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {user?.role === "customer" && (
            <Link href="/orders">My Orders</Link>
          )}
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={18} className="text-slate-500" />
          <input
            className="bg-transparent outline-none text-sm"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-slate-700">
            <ShoppingCartIcon size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-slate-700 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-700">
                Hi, <b>{user.username}</b>
              </span>

              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="text-xs text-blue-600">
                  Admin
                </Link>
              )}

              {user.role === "seller" && (
                <Link href="/seller" className="text-xs text-green-600">
                  Seller
                </Link>
              )}

              {user.role === "delivery_man" && (
                <Link
                  href="/deliveryman/dashboard"
                  className="text-xs text-pink-600"
                >
                  Delivery Man
                </Link>
              )}

              {user.role === "customer" && (
                <Link
                  href="/customer/dashboard"
                  className="text-xs text-purple-600"
                >
                  Customer
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-300 rounded text-sm">
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
*/
'use client';

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

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50" />
        <div className="absolute -left-20 top-0 w-60 h-60 bg-rose-200/30 blur-3xl rounded-full" />
        <div className="absolute left-1/3 top-0 w-60 h-60 bg-pink-200/30 blur-3xl rounded-full" />
        <div className="absolute right-0 top-0 w-60 h-60 bg-orange-200/30 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ORIGINAL LOGO (RESTORED) */}
        <Link href="/" className="text-3xl font-semibold text-slate-700">
          <span className="font-serif text-orange-600 text-4xl">Charis</span>
          <span className="font-serif text-pink-700 text-2xl">Atelier</span>
        </Link>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-2 bg-white/70 border border-white/70 backdrop-blur rounded-full px-3 py-2 shadow-sm">

          <Link href="/" className="px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-rose-50 transition">
            Home
          </Link>

          <Link href="/shop" className="px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-pink-50 transition">
            Shop
          </Link>

          <Link href="/about" className="px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-orange-50 transition">
            About
          </Link>

          <Link href="/contact" className="px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-rose-50 transition">
            Contact
          </Link>

          {user?.role === "customer" && (
            <Link href="/customer/myorders" className="px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-purple-50 transition">
               My<b>Orders</b>
            </Link>
          )}

        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white/80 border border-white/70 px-4 py-2 rounded-full shadow-sm backdrop-blur"
          >
            <Search size={16} className="text-slate-500" />
            <input
              className="bg-transparent outline-none text-sm placeholder:text-slate-400"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/80 border border-white/70 backdrop-blur shadow-sm hover:-translate-y-[1px] transition"
          >
            <ShoppingCartIcon size={20} className="text-slate-700"/>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3 bg-white/80 border border-white/70 backdrop-blur rounded-full px-4 py-2 shadow-sm">

              <span className="text-sm text-slate-700">
                Welcome, <br></br><b>{user.username}!</b>
              </span>

              {/* Dashboard button */}
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
                className="
                  flex items-center gap-1
                  px-4 py-1.5
                  rounded-full
                  text-xs font-serif tracking-wider
                  bg-white/70
                  border border-white/60
                  backdrop-blur
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400
                  hover:shadow-md hover:-translate-y-[1px]
                  transition
                "
              >
                
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 text-white text-sm font-medium shadow hover:scale-105 transition"
              >
                Logout
              </button>

            </div>
          ) : (
            <Link href="/auth">
              <button className="flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 shadow hover:scale-105 transition">
                <Sparkles size={16}/>
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