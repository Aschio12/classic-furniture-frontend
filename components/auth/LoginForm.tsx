"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setLocalError("");
      await login({ email, password });

      const currentUser = useAuthStore.getState().user;
      const role = currentUser?.role ?? "user";

      // Smart redirect similar to register flow
      if (role === "hub_manager") router.push("/dashboard/hub");
      else if (role === "admin") router.push("/admin");
      else router.push("/shop");
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
        <div className="absolute inset-x-0 top-0 z-50 h-1 overflow-hidden bg-transparent">
             <div className="h-full w-full animate-[shine_1.5s_infinite] bg-linear-to-r from-transparent via-[#D4AF37]/80 to-transparent" />
        </div>
      )}

      <div className="w-full max-w-md space-y-8 p-4">

      <div className="text-center relative">
        <h2 className="font-[Cormorant_Garamond] text-4xl font-semibold tracking-tight text-[#2C2C2C]">Welcome Back</h2>
        {/* Gold Shiny Underline */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
      </div>

      <form className="space-y-8 mt-8" onSubmit={handleSubmit}>
        <div className="space-y-5">
            {/* Email Field - Glass Effect with Gold Accent */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
                    <input
                        id="email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        className="peer block w-full bg-transparent px-4 pt-6 pb-2 text-[#2C2C2C] outline-none placeholder:text-transparent transition-all"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* Liquid Highlight Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/60 to-transparent opacity-50" />
                    
                    <label 
                        htmlFor="email" 
                        className="pointer-events-none absolute left-4 top-4 origin-left -translate-y-2.5 scale-75 transform text-[10px] font-medium tracking-wider text-[#D4AF37] transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#2C2C2C]/50 peer-placeholder-shown:tracking-normal
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-[10px] peer-focus:font-medium peer-focus:tracking-wider peer-focus:text-[#D4AF37]"
                    >
                        Email Address
                    </label>

                    {/* Gold Wet Line on Focus */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent transition-transform duration-500 ease-out peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Password Field - Glass Effect with Gold Accent */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
                    <input
                        id="password"
                        type="password"
                        required
                        disabled={isSubmitting}
                        className="peer block w-full bg-transparent px-4 pt-6 pb-2 text-[#2C2C2C] outline-none placeholder:text-transparent transition-all"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/60 to-transparent opacity-50" />
                    
                    <label 
                        htmlFor="password" 
                        className="pointer-events-none absolute left-4 top-4 origin-left -translate-y-2.5 scale-75 transform text-[10px] font-medium tracking-wider text-[#D4AF37] transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#2C2C2C]/50 peer-placeholder-shown:tracking-normal
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-[10px] peer-focus:font-medium peer-focus:tracking-wider peer-focus:text-[#D4AF37]"
                    >
                        Password
                    </label>

                    <div className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent transition-transform duration-500 ease-out peer-focus:scale-x-100" />
                </div>
            </div>
        </div>

        {localError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm font-medium text-red-600 bg-red-50/80 backdrop-blur-sm p-3 rounded-xl border border-red-100"
          >
            {localError}
          </motion.p>
        )}

        {/* Gold Gradient Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-full bg-linear-to-r from-[#D4AF37] via-[#C5A028] to-[#D4AF37] py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(212,175,55,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] active:scale-[0.98] disabled:opacity-70"
        >
          {/* Oil shimmer sweep */}
          <span className="absolute inset-y-0 -left-[150%] w-[80%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
          
          {/* Top wet highlight */}
          <span className="absolute inset-x-4 top-0.5 h-0.5 rounded-full bg-linear-to-r from-transparent via-white/50 to-transparent" />

          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </span>
        </button>
      </form>

      <div className="text-center text-xs tracking-wider text-[#2C2C2C]/50">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#D4AF37] hover:text-[#C5A028] transition-colors">
          Create Account
        </Link>
      </div>
    </div>
    </>
  );
}
