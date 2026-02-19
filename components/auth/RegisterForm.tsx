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
  const { login } = useAuthStore();
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
      // 1. Register with backend (Role-Blind: backend assigns default role 'user')
      await api.post("/auth/register", formData);
      
      // 2. Auto Login
      await login({ email: formData.email, password: formData.password });
      
      // 3. Smart Redirect Logic
      const currentUser = useAuthStore.getState().user;
      const role = currentUser?.role || "user";
      
      setShowWelcome(true);
      
      setTimeout(() => {
        if (role === 'hub_manager') router.push('/dashboard/hub');
        else if (role === 'admin') router.push('/admin');
        else router.push('/shop');
      }, 1500);

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
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center text-neutral-900">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: "circOut" }}
           className="relative"
        >
           <h2 className="relative text-3xl font-black tracking-tighter text-neutral-900">
             Account Created
           </h2>
           <p className="mt-4 text-xs font-medium text-neutral-400 tracking-[0.1em] uppercase">
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
        <h2 className="text-4xl font-black tracking-tighter text-neutral-900 drop-shadow-sm">Create Account</h2>
        {/* Shiny Underline */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent rounded-full shadow-[0_0_10px_#d4af37] animate-pulse" />
      </div>

      <form className="space-y-8 mt-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
            <div className="group relative">
                {/* Wet Surface Container */}
                <div className="relative overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="peer block w-full bg-transparent px-4 pt-5 pb-2 text-neutral-900 outline-none placeholder:text-transparent transition-all"
                        placeholder="Full Name"
                        required
                        disabled={isLoading}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {/* Liquid Highlight Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 to-transparent opacity-50" />
                    
                    <label
                        htmlFor="name"
                        className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs font-bold text-neutral-400 transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-xs peer-focus:font-bold peer-focus:text-neutral-900"
                    >
                        Full Name
                    </label>

                    {/* Active Wet Line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Email Field */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="peer block w-full bg-transparent px-4 pt-5 pb-2 text-neutral-900 outline-none placeholder:text-transparent transition-all"
                        placeholder="Email Address"
                        required
                        disabled={isLoading}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 to-transparent opacity-50" />
                    
                    <label
                        htmlFor="email"
                        className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs font-bold text-neutral-400 transition-all duration-300 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500
                        peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-xs peer-focus:font-bold peer-focus:text-neutral-900"
                    >
                        Email Address
                    </label>

                    <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] peer-focus:scale-x-100" />
                </div>
            </div>

            {/* Password Field */}
            <div className="group relative">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="peer block w-full bg-transparent px-4 pt-5 pb-2 text-neutral-900 outline-none placeholder:text-transparent transition-all"
                        placeholder="Password"
                        required
                        disabled={isLoading}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border-l-2 border-red-500 text-xs text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Oily/Juicy Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full overflow-hidden rounded-full bg-neutral-900 py-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95"
        >
          {/* Liquid Gold Fill Animation */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 opacity-100" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-linear-to-r from-transparent via-white/50 to-transparent z-10" />

          <span className="relative z-20 flex items-center justify-center gap-2 uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
          </span>
        </button>
      </form>

      <div className="text-center text-xs uppercase tracking-widest text-neutral-400 font-medium">
        Already have an account?{" "}
        <Link 
            href="/login" 
            className="text-neutral-900 hover:text-[#d4af37] transition-colors underline decoration-1 underline-offset-4"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
