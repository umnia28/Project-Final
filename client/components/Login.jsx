"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Login() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setMsg("Login successful ✅");

    const role = data.user.role;

    if (role === "admin") {
      router.push("/admin");
    } else if (role === "seller") {
      router.push("/seller");
    } else if (role === "delivery_man") {
      router.push("/deliveryman/dashboard");
    } else if (role === "customer") {
      router.push("/customer/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#fdf7ef] via-[#f5effc] to-[#eef4ff]" />

      {/* glow orbs */}
      <div className="absolute -top-20 left-10 -z-10 h-72 w-72 rounded-full bg-[#e6b57e]/30 blur-3xl" />
      <div className="absolute top-40 right-10 -z-10 h-80 w-80 rounded-full bg-[#d9b1fc]/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#a2c1fc]/30 blur-3xl" />

      {/* Login card */}
      <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-10 shadow-[0_20px_70px_rgba(217,177,252,0.15)] backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <p
            className={`${cormorant.className} text-sm uppercase tracking-[0.45em] text-slate-500`}
          >
            Welcome Back
          </p>

          <h1
            className={`${playfair.className} mt-2 bg-gradient-to-r from-[#a2c1fc] via-[#d9b1fc] to-[#e6b57e] bg-clip-text text-4xl font-semibold text-transparent`}
          >
            Sign In
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#a2c1fc]" />
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#a2c1fc] via-[#d9b1fc] to-[#e6b57e]" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6b57e]" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <input
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#a2c1fc]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#d9b1fc]"
          />

          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-[#e6b57e] via-[#d9b1fc] to-[#a2c1fc] py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
          >
            Login
          </button>

          {msg && (
            <p className="mt-2 text-center text-sm text-slate-600">
              {msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
// });

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function Login() {
//   const router = useRouter();

//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ emailOrUsername, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setMsg(data.message || "Login failed");
//       return;
//     }

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));

//     setMsg("Login successful ✅");

//     const role = data.user.role;

//     if (role === "admin") {
//       router.push("/admin");
//     } else if (role === "seller") {
//       router.push("/seller");
//     } else if (role === "delivery_man") {
//       router.push("/deliveryman/dashboard");
//     } else if (role === "customer") {
//       router.push("/customer/dashboard");
//     } else {
//       router.push("/");
//     }
//   };

//   return (
//     <section className="relative flex min-h-screen items-center justify-center px-6">
//       {/* Background gradient */}
//       <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#f7f1e8] via-[#f7f5fb] to-[#eef6ff]" />

//       {/* glow orbs */}
//       <div className="absolute -top-20 left-10 -z-10 h-72 w-72 rounded-full bg-[#e6d8c3]/30 blur-3xl" />
//       <div className="absolute top-40 right-10 -z-10 h-80 w-80 rounded-full bg-[#d7c4ef]/30 blur-3xl" />
//       <div className="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#bfdaf6]/30 blur-3xl" />

//       {/* Login card */}
//       <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-10 shadow-[0_20px_70px_rgba(167,139,219,0.08)] backdrop-blur-xl">
//         {/* Header */}
//         <div className="text-center">
//           <p
//             className={`${cormorant.className} text-sm uppercase tracking-[0.45em] text-slate-500`}
//           >
//             Welcome Back
//           </p>

//           <h1
//             className={`${playfair.className} mt-2 bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-4xl font-semibold text-transparent`}
//           >
//             Sign In
//           </h1>

//           <div className="mt-4 flex items-center justify-center gap-3">
//             <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#bfdaf6]" />
//             <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5]" />
//             <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6d8c3]" />
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
//           <input
//             placeholder="Email or Username"
//             value={emailOrUsername}
//             onChange={(e) => setEmailOrUsername(e.target.value)}
//             className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#7fb6ea]"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#a78bdb]"
//           />

//           <button
//             type="submit"
//             className="mt-2 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
//           >
//             Login
//           </button>

//           {msg && (
//             <p className="mt-2 text-center text-sm text-slate-600">
//               {msg}
//             </p>
//           )}
//         </form>
//       </div>
//     </section>
//   );
// }

//  "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
// });

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function Login() {
//   const router = useRouter();

//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ emailOrUsername, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setMsg(data.message || "Login failed");
//       return;
//     }

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));

//     setMsg("Login successful ✅");

//     const role = data.user.role;

//     if (role === "admin") {
//       router.push("/admin");
//     } else if (role === "seller") {
//       router.push("/seller");
//     } else if (role === "delivery_man") {
//       router.push("/deliveryman/dashboard");
//     } else if (role === "customer") {
//       router.push("/customer/dashboard");
//     } else {
//       router.push("/");
//     }
//   };

//   return (
//     <section className="relative min-h-screen flex items-center justify-center px-6">

//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 -z-20" />

//       {/* glow orbs */}
//       <div className="absolute -top-20 left-10 w-72 h-72 bg-pink-300/30 blur-3xl rounded-full -z-10" />
//       <div className="absolute top-40 right-10 w-80 h-80 bg-purple-300/30 blur-3xl rounded-full -z-10" />
//       <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-orange-300/30 blur-3xl rounded-full -z-10" />

//       {/* Login card */}
//       <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_70px_rgba(236,72,153,0.08)] p-10">

//         {/* Header */}
//         <div className="text-center">

//           <p className={`${cormorant.className} tracking-[0.45em] uppercase text-sm text-slate-500`}>
//             Welcome Back
//           </p>

//           <h1
//             className={`${playfair.className} mt-2 text-4xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent`}
//           >
//             Sign In
//           </h1>

//           <div className="mt-4 flex items-center justify-center gap-3">
//             <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />
//             <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400" />
//             <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-300" />
//           </div>

//         </div>

//         {/* Form */}
//         <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">

//           <input
//             placeholder="Email or Username"
//             value={emailOrUsername}
//             onChange={(e) => setEmailOrUsername(e.target.value)}
//             className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <button
//             type="submit"
//             className="mt-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white font-semibold py-3 shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
//           >
//             Login
//           </button>

//           {msg && (
//             <p className="text-center text-sm text-slate-600 mt-2">
//               {msg}
//             </p>
//           )}

//         </form>
//       </div>
//     </section>
//   );
// }
