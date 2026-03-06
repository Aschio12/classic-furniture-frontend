"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] selection:bg-[#D4AF37]/30">
      {/* Minimalist Glassmorphism Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/50 backdrop-blur-[10px] saturate-150 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif text-[10px] tracking-widest text-[#D4AF37]">CF</span>
            </div>
            <span className="hidden font-serif text-[13px] tracking-[0.2em] text-[#2C2C2C] sm:block">
              CLASSIC
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-10">
            {[
              { name: "Collections", path: "/shop" },
              { name: "My Orders", path: "/orders" },
              { name: "Profile", path: "/profile" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`relative text-[10px] font-light tracking-[0.25em] transition-colors duration-300 hover:text-[#2C2C2C] ${
                  pathname === link.path ? "text-[#2C2C2C]" : "text-[#2C2C2C]/50"
                }`}
              >
                {link.name.toUpperCase()}
                {pathname === link.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-[#D4AF37]"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>

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
