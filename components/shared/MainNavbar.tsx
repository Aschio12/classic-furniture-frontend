"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainNavbar() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated) return null;

  return (
    <AnimatePresence>
      {isAuthenticated && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-x-0 top-6 z-50 flex justify-center px-4 md:px-8"
        >
          <div
            className="relative flex w-[94%] max-w-7xl items-center justify-between rounded-full px-6 py-3.5 sm:px-8 sm:py-4 transition-all duration-700 ease-out"
            style={{
              backgroundColor: "rgba(184, 134, 11, 0.15)", // Light brown / goldenrod tint
              backdropFilter: "blur(25px) saturate(2)",
              WebkitBackdropFilter: "blur(25px) saturate(2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(212, 175, 55, 0.3)" // Light brown / gold border
            }}
          >
            {/* Shine Sweep for the Oily/Glassy effect across the entire navbar */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
              <div 
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent skew-x-12" 
                style={{ animation: "navbar-shine 8s infinite ease-in-out" }}
              />
            </div>

            {/* Brand Logo - Light Brown/Gold Text */}
            <Link href="/" className="relative z-10 group flex items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0e0e0_0%,#ffffff_50%,#e0e0e0_100%)] shadow-[0_4px_14px_rgba(212,175,55,0.4)] transition-all duration-300 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.6)]">
                <span className="font-serif tracking-wide text-lg font-bold text-gray-900">CF</span>
              </div>
              <div className="hidden flex-col sm:flex">
                <span 
                  className="font-serif tracking-widest text-lg sm:text-xl font-bold bg-clip-text text-transparent drop-shadow-sm"
                  style={{
                    backgroundImage: "linear-gradient(to right, #B8860B, #D4AF37, #B8860B)",
                    backgroundSize: "200% auto",
                    animation: "shine 4s linear infinite"
                  }}
                >
                  CLASSIC FURNITURE
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden items-center gap-2 lg:flex relative z-10">
              {[
                { name: "Collections", path: "/shop" },
                { name: "My Orders", path: "/orders" },
                { name: "Profile", path: "/profile" },
              ].map((item) => {
                const isActive = pathname === item.path;
                return (
                  <motion.div key={item.name} whileHover="hover" initial="initial">
                    <Link
                      href={item.path}
                      className="relative px-4 py-2.5 flex items-center justify-center group/link"
                    >
                      {/* Soft Glow Liquid Blob Hover Effect via Framer Motion */}
                      <motion.div
                        variants={{
                          initial: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
                          hover: { opacity: 1, scale: 1.1, filter: "blur(12px)" }
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-[#D4AF37]/25 pointer-events-none"
                      />
                      
                      <span className={`relative z-10 text-[11px] tracking-[0.25em] font-medium transition-colors duration-300 ${
                        isActive ? "text-[#8B6508]" : "text-gray-700 group-hover/link:text-[#8B6508]"
                      }`}>
                        {item.name.toUpperCase()}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Nav Fallback Placeholder */}
            <div className="lg:hidden flex items-center relative z-10 text-gray-700 font-bold tracking-widest text-xs">
                 MENU
            </div>
            
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes navbar-shine {
              0%, 75% { transform: translateX(-250%) skewX(12deg); opacity: 0; }
              80% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateX(350%) skewX(12deg); opacity: 0; }
            }
            @keyframes shine {
              to {
                background-position: 200% center;
              }
            }
          `}} />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
