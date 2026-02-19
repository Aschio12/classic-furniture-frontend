"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginForm() {
  const { setUser, setToken } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setLocalError("");

      const response = await fetch("https://classic-furniture-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || "Login failed");
      }

      const data = await response.json();
      const token = data?.token ?? null;
      const incomingRole = data?.role ?? data?.user?.role;
      const role: "user" | "admin" | "seller" | "hub_manager" =
        incomingRole === "admin" || incomingRole === "seller" || incomingRole === "hub_manager"
          ? incomingRole
          : "user";
      const userId = data?.user?.id ?? data?.user?._id ?? "temp-id";
      const userName = data?.user?.name ?? "User";
      const userEmail = data?.user?.email ?? email;

      if (!token) {
        throw new Error("Login failed");
      }

      setToken(token);
      setUser({ id: userId, name: userName, email: userEmail, role });
      useAuthStore.setState({ isAuthenticated: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Login failed. Please try again.";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Shining Progress Bar (Authentication State) */}
      {isSubmitting && (
        <div className="fixed top-0 left-0 z-100 h-1 w-full overflow-hidden bg-transparent">
             <div className="h-full w-full animate-[shine_1.5s_infinite] bg-linear-to-r from-transparent via-white/80 to-transparent" />
        </div>
      )}

      <div className="w-full max-w-md space-y-8 p-4">
      <div className="text-center relative">
        <h2 className="text-4xl font-black tracking-tighter text-neutral-900 drop-shadow-sm">Welcome Back</h2>
        {/* Shiny Underline */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent rounded-full shadow-[0_0_10px_#d4af37] animate-pulse" />
      </div>

      <form className="space-y-8 mt-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
            <div className="group relative">
                <input
                    id="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    className="peer w-full bg-neutral-50 px-4 py-3 text-neutral-900 outline-hidden transition-all duration-300 placeholder:text-transparent border-b border-neutral-300 focus:border-neutral-900 focus:bg-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label 
                    htmlFor="email" 
                    className="absolute left-4 top-3 text-neutral-500 text-sm transition-all duration-300 pointer-events-none 
                    peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neutral-900 peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500"
                >
                    Email Address
                </label>
            </div>

            <div className="group relative">
                <input
                    id="password"
                    type="password"
                    required
                    disabled={isSubmitting}
                    className="peer w-full bg-neutral-50 px-4 py-3 text-neutral-900 outline-hidden transition-all duration-300 placeholder:text-transparent border-b border-neutral-300 focus:border-neutral-900 focus:bg-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label 
                    htmlFor="password" 
                    className="absolute left-4 top-3 text-neutral-500 text-sm transition-all duration-300 pointer-events-none 
                    peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neutral-900 peer-focus:font-bold
                    peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500"
                >
                    Password
                </label>
            </div>
        </div>

        {localError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm font-medium text-red-500 bg-red-50 p-2 rounded-lg"
          >
            {localError}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-full bg-neutral-900 py-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </span>
          
          {/* Liquid Gold Fill Animation */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 opacity-100" />
          
          {/* Shine Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-linear-to-r from-transparent via-white/50 to-transparent z-20" />
        </button>
      </form>

      <div className="text-center text-xs uppercase tracking-widest text-neutral-400 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-neutral-900 hover:text-[#d4af37] transition-colors underline decoration-1 underline-offset-4">
          Create Account
        </Link>
      </div>
    </div>
    </>
  );
}
