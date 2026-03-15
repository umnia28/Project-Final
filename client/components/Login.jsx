/*import { useState } from "react";

export default function Login() {
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
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="email or username"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
  */
 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={onSubmit}>
      <input
        placeholder="email or username"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      {msg && <p>{msg}</p>}
    </form>
  );
}
