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
      <div className="text-center">
        {/* Title removed or styled neutrally as it is often provided by parent container/dialog */}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isSubmitting}
            className="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-neutral-900 transition-all focus:border-neutral-900 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isSubmitting}
            className="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-neutral-900 transition-all focus:border-neutral-900 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {localError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-500"
          >
            {localError}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full items-center justify-center overflow-visible rounded-xl bg-neutral-900 py-4 text-sm font-medium text-white shadow-2xl transition-all hover:scale-105 hover:bg-black disabled:opacity-70"
        >
          {/* External Glow for "Crazy" Vibe */}
          <div className="absolute inset-0 bg-neutral-900 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
          
          <span className="relative z-10 uppercase tracking-[0.2em]">{isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enter Sanctuary"}</span>
          
          {/* Intense Shine Animation */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
             <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </button>
      </form>

      <div className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-neutral-900 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
    </>
  );
}
