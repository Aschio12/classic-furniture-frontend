"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "@/components/shared/MainNavbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] selection:bg-[#D4AF37]/30">
      {/* Minimalist Glassmorphism Header */}
      <MainNavbar />

      {/* Main Content with Fade-in Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
