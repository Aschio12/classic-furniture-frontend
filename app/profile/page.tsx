"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    logout();
    // ensure client-side navigation after logout
    try {
      router.push("/");
    } catch (e) {
      // fallback: no-op
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9F9FB]">
        <div className="rounded-lg border border-primary/10 bg-white p-8 shadow">
          <p className="text-sm text-neutral-600">No profile found. Please sign in.</p>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#F9F9FB] py-12">
      <div className="mx-auto max-w-3xl rounded-lg border border-primary/10 bg-white p-8 shadow">
        <motion.h1 className="mb-4 text-2xl font-semibold text-neutral-900" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          Your Profile
        </motion.h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-medium text-neutral-500">Name</h2>
            <p className="text-lg font-semibold text-neutral-900">{user.name}</p>
          </div>

          <div>
            <h2 className="text-xs font-medium text-neutral-500">Email</h2>
            <p className="text-sm text-neutral-700">{user.email}</p>
          </div>

          <div>
            <h2 className="text-xs font-medium text-neutral-500">Role</h2>
            <p className="text-sm text-neutral-700">{user.role}</p>
          </div>

          <div className="pt-6">
            <button
              onClick={handleSignOut}
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full border border-red-200 bg-white px-8 py-3 text-[11px] font-semibold tracking-[0.2em] text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-md"
            >
              <span className="relative z-10 transition-transform group-hover:scale-105">SIGN OUT</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transition-all group-hover:h-full group-hover:opacity-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
