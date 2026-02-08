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
      // 1. Register
      await api.post("/auth/register", formData);
      
      // 2. Auto Login
      await login({ email: formData.email, password: formData.password });
      
      router.push("/");
    } catch (err: unknown) {
      const typedError = err as { response?: { data?: { message?: string } } };
      setError(
        typedError.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-4">
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
