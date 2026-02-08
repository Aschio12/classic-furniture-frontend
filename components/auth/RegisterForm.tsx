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
      <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center text-white">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
        >
           <h2 className="text-3xl font-serif tracking-widest text-[#d4af37]">Welcome</h2>
           <p className="mt-2 text-sm text-white/60 tracking-wider">ENTERING SHOWROOM</p>
        </motion.div>
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: "100px" }}
           className="h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 p-4">
      {/* Shining Progress Bar (Authentication State) */}
      {isLoading && (
        <div className="fixed top-0 left-0 z-100 h-1 w-full overflow-hidden bg-transparent">
             <div className="h-full w-full animate-[shine_1.5s_infinite] bg-linear-to-r from-transparent via-white/80 to-transparent" />
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-light tracking-tight text-white">Create Account</h2>
        <p className="mt-2 text-sm text-white/60">Join our exclusive community</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white/80">
                Full Name

            </label>
            <input
                id="name"
                type="text"
                required
                disabled={isLoading}
                className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white transition-all focus:border-white focus:outline-none focus:ring-0 placeholder:text-white/20"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isLoading}
            className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white transition-all focus:border-white focus:outline-none focus:ring-0 placeholder:text-white/20"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white/80">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isLoading}
            className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white transition-all focus:border-white focus:outline-none focus:ring-0 placeholder:text-white/20"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-white/10 disabled:opacity-70"
        >
          <span className="relative z-10 uppercase tracking-widest">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Access"}</span>
           <div className="absolute inset-0 -translate-x-full animate-[shine_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </button>
      </form>

      <div className="text-center text-sm text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-white hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
