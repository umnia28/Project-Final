'use client';

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