"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainNavbar() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by returning null until mounted and Zustand is hydrated
  if (!mounted || !_hasHydrated) return null;

  return (
    <AnimatePresence>
      {isAuthenticated && (
        <motion.nav
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            type: "tween",
            ease: [0.16, 1, 0.3, 1], // Liquid, smooth ease out
            duration: 0.8,
          }}
          className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 border-b border-black/5 shadow-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif tracking-wide text-xl text-gray-900 transition-colors group-hover:text-[#D4AF37]">
              Classic Furniture
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/shop" 
              className="relative text-xs tracking-[0.18em] uppercase font-medium text-gray-700 transition-colors hover:text-[#D4AF37] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              Collections
            </Link>
            <Link 
              href="/orders" 
              className="relative text-xs tracking-[0.18em] uppercase font-medium text-gray-700 transition-colors hover:text-[#D4AF37] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              My Orders
            </Link>
            <Link 
              href="/profile" 
              className="relative text-xs tracking-[0.18em] uppercase font-medium text-gray-700 transition-colors hover:text-[#D4AF37] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              Profile
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
