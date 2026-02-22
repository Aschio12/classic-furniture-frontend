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
            {/* Email Field - Wet/Oily Effect */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
                    <input
                        id="email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        className="peer block w-full bg-transparent px-4 pt-5 pb-2 text-neutral-900 outline-none placeholder:text-transparent transition-all"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* Liquid Highlight Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 to-transparent opacity-50" />
                    
                    <label 
                        htmlFor="email" 
                        className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs font-bold text-neutral-400 transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-xs peer-focus:font-bold peer-focus:text-neutral-900"
                    >
                        Email Address
                    </label>

                    {/* Active Wet Line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Password Field - Wet/Oily Effect */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
                    <input
                        id="password"
                        type="password"
                        required
                        disabled={isSubmitting}
                        className="peer block w-full bg-transparent px-4 pt-5 pb-2 text-neutral-900 outline-none placeholder:text-transparent transition-all"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 to-transparent opacity-50" />
                    
                    <label 
                        htmlFor="password" 
                        className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs font-bold text-neutral-400 transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-xs peer-focus:font-bold peer-focus:text-neutral-900"
                    >
                        Password
                    </label>

                    <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:scale-x-100" />
                </div>
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
          className="group relative w-full overflow-hidden rounded-full bg-white py-4 text-sm font-bold text-neutral-900 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95 border border-neutral-100/50"
        >
          {/* Base - Liquid White */}
          <div className="absolute inset-0 bg-white" />
          
          {/* Inner Depth Shadow (Sharp, no blur) */}
          <div className="absolute inset-0 shadow-[inset_0_-4px_8px_rgba(0,0,0,0.05),inset_0_2px_6px_rgba(255,255,255,0.9)] rounded-full" />
            
          {/* Top Highlight - Sharp Glint */}
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white to-transparent opacity-90" />
          
          {/* Crisp Highlight Line */}
          <div className="absolute left-6 right-6 top-[2px] h-[1px] bg-white opacity-100" />

          {/* Hover: Oil Sheen Animation (Sharp Edges) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-20" />

          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.2em] transition-colors">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-neutral-400" /> : "Sign In"}
          </span>
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
