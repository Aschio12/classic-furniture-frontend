"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      
      // Get the latest user role from store (or we can assume logic here if login returns role, but store updates async)
      // Since login is async and updates store, we can access useAuthStore.getState().user immediately after
      const currentUser = useAuthStore.getState().user;
      const role = currentUser?.role || "user";
      
      setIsExiting(true); // Trigger fade out animation

      // Wait for animation before pushing route (e.g. 1s)
      setTimeout(() => {
        if (role === 'hub_manager') {
            router.push('/dashboard/hub-manager');
        } else if (role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/shop');
        }
      }, 1000);

    } catch {
      // Error is handled by store
    }
  };

  return (
    <>
      {/* Oily Transition Overlay */}
      <AnimatePresence>
        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Soft liquid ease
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            style={{ pointerEvents: 'none' }} // Ensure clicks go through if stuck but visible
          >
             {/* Optional: Add a subtle ripple or just pure clean fade to white/target bg */}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md space-y-8 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-light tracking-tight text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-white/60">Sign in to your account</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-300"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black py-4 text-sm font-medium text-white shadow-lg transition-all hover:shadow-white/10 disabled:opacity-70"
        >
          <span className="relative z-10 uppercase tracking-widest">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ENTER"}</span>
          {/* Constant Light Sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shine_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </button>
      </form>

      <div className="text-center text-sm text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-white hover:underline">
          Sign up
        </Link>
      </div>
    </div>
    </>
  );
}
