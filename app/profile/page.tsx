"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

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
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
