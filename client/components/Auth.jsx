"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function Auth() {
  const router = useRouter();

  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    contact_no: "",
    full_name: "",
    gender: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const url =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

    const body =
      mode === "login"
        ? {
            emailOrUsername: form.email.trim(),
            password: form.password,
          }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
            contact_no: form.contact_no || null,
            full_name: form.full_name || null,
            gender: form.gender || null,
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Authentication failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg(`${mode === "login" ? "Login" : "Signup"} successful ✅`);

      router.push("/");
    } catch (err) {
      setMsg("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-14">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#eef6ff] via-[#f7f5fb] to-[#f7f1e8]" />
      <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[#e6d8c3]/30 blur-3xl" />
      <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-[#d7c4ef]/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#bfdaf6]/25 blur-3xl" />

      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 shadow-[0_20px_80px_rgba(167,139,219,0.10)] backdrop-blur-xl lg:grid-cols-[1fr_1.05fr]">
          {/* Left Artistic Panel */}
          <div className="relative hidden overflow-hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Charis Atelier
                </div>

                <h2 className="mt-8 text-4xl font-semibold leading-tight">
                  Enter a world of crafted elegance
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/90">
                  Sign in to continue your journey through timeless artistry,
                  handcrafted pieces, and curated collections made to inspire.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.22em] text-white/70">
                  Atelier Note
                </p>
                <p className="mt-3 text-sm leading-7 text-white/90">
                  Every account opens the door to a more personal Charis Atelier
                  experience — from shopping to collecting and revisiting your favorite pieces.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Toggle */}
            <div className="mx-auto mb-8 flex w-full max-w-md rounded-full border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] text-white shadow"
                    : "text-slate-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  mode === "register"
                    ? "bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] text-white shadow"
                    : "text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <div className="mx-auto max-w-md text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d9cde7]/70 bg-gradient-to-r from-[#e6f2ff]/80 via-[#efe7fb]/80 to-[#f2e8d8]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#8b7bd6]" />
                {mode === "login" ? "Welcome Back" : "Create Your Account"}
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-transparent">
                {mode === "login" ? "Login to Charis Atelier" : "Join Charis Atelier"}
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {mode === "login"
                  ? "Continue exploring handcrafted elegance and curated collections."
                  : "Create your account to begin your experience with Charis Atelier."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
              {mode === "register" && (
                <>
                  <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={onChange}
                    required
                    className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]"
                  />

                  <input
                    name="full_name"
                    placeholder="Full name (optional)"
                    value={form.full_name}
                    onChange={onChange}
                    className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]"
                  />

                  <input
                    name="contact_no"
                    placeholder="Contact number (optional)"
                    value={form.contact_no}
                    onChange={onChange}
                    className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#7fb6ea] focus:ring-2 focus:ring-[#dfeffc]"
                  />

                  <input
                    name="gender"
                    placeholder="Gender (optional)"
                    value={form.gender}
                    onChange={onChange}
                    className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#d8c3a5] focus:ring-2 focus:ring-[#f2e8d8]"
                  />
                </>
              )}

              <input
                name="email"
                placeholder={mode === "login" ? "Email or Username" : "Email"}
                value={form.email}
                onChange={onChange}
                required
                className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#7fb6ea] focus:ring-2 focus:ring-[#dfeffc]"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
                className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(167,139,219,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(127,182,234,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login"
                  : "Sign Up"}
              </button>
            </form>

            {/* Toggle text */}
            <div className="mx-auto mt-6 max-w-md text-center text-sm text-slate-600">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-[#8b7bd6] transition hover:text-[#6daee8]"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-[#8b7bd6] transition hover:text-[#6daee8]"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            {/* Message */}
            {msg && (
              <div
                className={`mx-auto mt-5 max-w-md rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                  msg.toLowerCase().includes("successful")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


//  "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Sparkles } from "lucide-react";

// export default function Auth() {
//   const router = useRouter();

//   const [mode, setMode] = useState("login"); // login | register
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     contact_no: "",
//     full_name: "",
//     gender: "",
//   });
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setLoading(true);

//     const url =
//       mode === "login"
//         ? "http://localhost:5000/api/auth/login"
//         : "http://localhost:5000/api/auth/register";

//     const body =
//       mode === "login"
//         ? {
//             emailOrUsername: form.email.trim(),
//             password: form.password,
//           }
//         : {
//             username: form.username,
//             email: form.email,
//             password: form.password,
//             contact_no: form.contact_no || null,
//             full_name: form.full_name || null,
//             gender: form.gender || null,
//           };

//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMsg(data.message || "Authentication failed");
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       setMsg(`${mode === "login" ? "Login" : "Signup"} successful ✅`);

//       router.push("/");
//     } catch (err) {
//       setMsg("Server not reachable");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="relative min-h-screen overflow-hidden px-6 py-14">
//       {/* Background */}
//       <div className="absolute inset-0 -z-20 bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100" />
//       <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl" />
//       <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-purple-300/25 blur-3xl" />
//       <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />

//       <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
//         <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 shadow-[0_20px_80px_rgba(236,72,153,0.10)] backdrop-blur-xl lg:grid-cols-[1fr_1.05fr]">
//           {/* Left Artistic Panel */}
//           <div className="relative hidden overflow-hidden lg:block">
//             <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400" />
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />
//             <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
//                   <Sparkles className="h-3.5 w-3.5" />
//                   Charis Atelier
//                 </div>

//                 <h2 className="mt-8 text-4xl font-semibold leading-tight">
//                   Enter a world of crafted elegance
//                 </h2>

//                 <p className="mt-5 max-w-md text-sm leading-7 text-white/90">
//                   Sign in to continue your journey through timeless artistry,
//                   handcrafted pieces, and curated collections made to inspire.
//                 </p>
//               </div>

//               <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-md">
//                 <p className="text-sm uppercase tracking-[0.22em] text-white/70">
//                   Atelier Note
//                 </p>
//                 <p className="mt-3 text-sm leading-7 text-white/90">
//                   Every account opens the door to a more personal Charis Atelier
//                   experience — from shopping to collecting and revisiting your favorite pieces.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Form Panel */}
//           <div className="p-6 sm:p-8 md:p-10">
//             {/* Toggle */}
//             <div className="mx-auto mb-8 flex w-full max-w-md rounded-full border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-md">
//               <button
//                 type="button"
//                 onClick={() => setMode("login")}
//                 className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
//                   mode === "login"
//                     ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow"
//                     : "text-slate-600"
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMode("register")}
//                 className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
//                   mode === "register"
//                     ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow"
//                     : "text-slate-600"
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>

//             {/* Heading */}
//             <div className="mx-auto max-w-md text-center">
//               <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-orange-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm">
//                 <Sparkles className="h-3.5 w-3.5 text-pink-500" />
//                 {mode === "login" ? "Welcome Back" : "Create Your Account"}
//               </div>

//               <h1 className="mt-5 text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
//                 {mode === "login" ? "Login to Charis Atelier" : "Join Charis Atelier"}
//               </h1>

//               <p className="mt-3 text-sm leading-7 text-slate-600">
//                 {mode === "login"
//                   ? "Continue exploring handcrafted elegance and curated collections."
//                   : "Create your account to begin your experience with Charis Atelier."}
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
//               {mode === "register" && (
//                 <>
//                   <input
//                     name="username"
//                     placeholder="Username"
//                     value={form.username}
//                     onChange={onChange}
//                     required
//                     className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
//                   />

//                   <input
//                     name="full_name"
//                     placeholder="Full name (optional)"
//                     value={form.full_name}
//                     onChange={onChange}
//                     className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
//                   />

//                   <input
//                     name="contact_no"
//                     placeholder="Contact number (optional)"
//                     value={form.contact_no}
//                     onChange={onChange}
//                     className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
//                   />

//                   <input
//                     name="gender"
//                     placeholder="Gender (optional)"
//                     value={form.gender}
//                     onChange={onChange}
//                     className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
//                   />
//                 </>
//               )}

//               <input
//                 name="email"
//                 placeholder={mode === "login" ? "Email or Username" : "Email"}
//                 value={form.email}
//                 onChange={onChange}
//                 required
//                 className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={onChange}
//                 required
//                 className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none shadow-sm backdrop-blur-md placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(236,72,153,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(168,85,247,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading
//                   ? "Please wait..."
//                   : mode === "login"
//                   ? "Login"
//                   : "Sign Up"}
//               </button>
//             </form>

//             {/* Toggle text */}
//             <div className="mx-auto mt-6 max-w-md text-center text-sm text-slate-600">
//               {mode === "login" ? (
//                 <>
//                   Don’t have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => setMode("register")}
//                     className="font-semibold text-pink-600 transition hover:text-purple-600"
//                   >
//                     Sign up
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   Already have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => setMode("login")}
//                     className="font-semibold text-pink-600 transition hover:text-purple-600"
//                   >
//                     Login
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Message */}
//             {msg && (
//               <div
//                 className={`mx-auto mt-5 max-w-md rounded-2xl border px-4 py-3 text-sm shadow-sm ${
//                   msg.toLowerCase().includes("successful")
//                     ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                     : "border-rose-200 bg-rose-50 text-rose-700"
//                 }`}
//               >
//                 {msg}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
