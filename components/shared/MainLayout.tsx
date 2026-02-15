"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <main className="min-h-screen bg-neutral-950" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/shop" className="text-sm font-semibold tracking-[0.3em] text-primary">
            LUXECRAFT
          </Link>

          <nav className="flex items-center gap-6 text-sm text-primary/70">
            <Link href="/shop" className="transition-colors hover:text-primary">
              Collections
            </Link>
            <Link href="/orders" className="transition-colors hover:text-primary">
              My Orders
            </Link>
          </nav>

          <button
            type="button"
            className="flex items-center justify-center rounded-full border border-primary/10 bg-white/60 p-2 text-primary/70 transition hover:text-primary"
            aria-label="Profile"
          >
            <UserCircle className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        className="pt-20"
      >
        {children}
      </motion.main>
    </div>
  );
}
