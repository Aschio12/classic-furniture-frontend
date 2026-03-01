"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterForm() {
  const router = useRouter();
  const { login, setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register with backend (backend may return token + user)
      const res = await api.post("/auth/register", formData);
      const data = res?.data ?? {};

      const token = data?.token ?? null;
      const userFromServer = data?.user ?? null;

      if (token && userFromServer) {
        // Persist directly from register response
        setToken(token);
        setUser({
          id: userFromServer.id ?? userFromServer._id ?? "temp-id",
          name: userFromServer.name ?? formData.name ?? "User",
          email: userFromServer.email ?? formData.email,
          role: userFromServer.role ?? "user",
        });

        setShowWelcome(true);
        const role = userFromServer.role ?? "user";
        setTimeout(() => {
          if (role === "hub_manager") router.push("/dashboard/hub");
          else if (role === "admin") router.push("/admin");
          else router.push("/shop");
        }, 1200);
        return;
      }

      // Fallback: if register didn't return token, auto-login
      await login({ email: formData.email, password: formData.password });
      const currentUser = useAuthStore.getState().user;
      const role = currentUser?.role || "user";
      setShowWelcome(true);
      setTimeout(() => {
        if (role === "hub_manager") router.push("/dashboard/hub");
        else if (role === "admin") router.push("/admin");
        else router.push("/shop");
      }, 1200);

    } catch (err: unknown) {
      const typedError = err as { response?: { data?: { message?: string } } };
      setError(
        typedError.response?.data?.message || "Registration failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: "circOut" }}
           className="relative"
        >
           <h2 className="relative font-[Cormorant_Garamond] text-3xl font-semibold text-[#2C2C2C]">
             Account Created
           </h2>
           <p className="mt-4 text-xs font-medium text-[#D4AF37] tracking-[0.15em] uppercase">
             Redirecting...
           </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 p-4">
      {/* Decorative Header */}
      <div className="text-center relative">
        <h2 className="font-[Cormorant_Garamond] text-4xl font-semibold tracking-tight text-[#2C2C2C]">Create Account</h2>
        {/* Gold Shiny Underline */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
      </div>

      <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
        <div className="space-y-5">
            {/* Name Field - Glass Effect with Gold Accent */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="peer block w-full bg-transparent px-4 pt-6 pb-2 text-[#2C2C2C] outline-none placeholder:text-transparent transition-all"
                        placeholder="Full Name"
                        required
                        disabled={isLoading}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {/* Liquid Highlight Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/60 to-transparent opacity-50" />
                    
                    <label
                        htmlFor="name"
                        className="pointer-events-none absolute left-4 top-4 origin-left -translate-y-2.5 scale-75 transform text-[10px] font-medium tracking-wider text-[#D4AF37] transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#2C2C2C]/50 peer-placeholder-shown:tracking-normal
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-[10px] peer-focus:font-medium peer-focus:tracking-wider peer-focus:text-[#D4AF37]"
                    >
                        Full Name
                    </label>

                    {/* Gold Wet Line on Focus */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent transition-transform duration-500 ease-out peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Email Field - Glass Effect with Gold Accent */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="peer block w-full bg-transparent px-4 pt-6 pb-2 text-[#2C2C2C] outline-none placeholder:text-transparent transition-all"
                        placeholder="Email Address"
                        required
                        disabled={isLoading}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/60 to-transparent opacity-50" />
                    
                    <label
                        htmlFor="email"
                        className="pointer-events-none absolute left-4 top-4 origin-left -translate-y-2.5 scale-75 transform text-[10px] font-medium tracking-wider text-[#D4AF37] transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#2C2C2C]/50 peer-placeholder-shown:tracking-normal
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-[10px] peer-focus:font-medium peer-focus:tracking-wider peer-focus:text-[#D4AF37]"
                    >
                        Email Address
                    </label>

                    <div className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent transition-transform duration-500 ease-out peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Password Field - Glass Effect with Gold Accent */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="peer block w-full bg-transparent px-4 pt-6 pb-2 text-[#2C2C2C] outline-none placeholder:text-transparent transition-all"
                        placeholder="Password"
                        required
                        disabled={isLoading}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl text-sm text-red-600 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Gold Gradient Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full overflow-hidden rounded-full bg-linear-to-r from-[#D4AF37] via-[#C5A028] to-[#D4AF37] py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(212,175,55,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] active:scale-[0.98] disabled:opacity-70"
        >
          {/* Oil shimmer sweep */}
          <span className="absolute inset-y-0 -left-[150%] w-[80%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
          
          {/* Top wet highlight */}
          <span className="absolute inset-x-4 top-0.5 h-0.5 rounded-full bg-linear-to-r from-transparent via-white/50 to-transparent" />

          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
          </span>
        </button>
      </form>

      <div className="text-center text-xs tracking-wider text-[#2C2C2C]/50">
        Already have an account?{" "}
        <button 
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/login";
            }}
            className="font-medium text-[#D4AF37] hover:text-[#C5A028] transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
