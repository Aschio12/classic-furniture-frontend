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
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl shadow-primary/5">
      <div className="text-center">
        <h2 className="text-3xl font-light tracking-tight text-primary">Create Account</h2>
        <p className="mt-2 text-sm text-primary/60">Join our exclusive community</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-primary">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-primary/10 bg-[#F9F9FB] px-4 py-3 text-primary transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-primary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-primary/10 bg-[#F9F9FB] px-4 py-3 text-primary transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-primary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-primary/10 bg-[#F9F9FB] px-4 py-3 text-primary transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="relative flex w-full items-center justify-center overflow-hidden rounded-full bg-primary py-3 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-primary/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
