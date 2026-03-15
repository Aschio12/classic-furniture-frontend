"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainNavbar() {
  const { isAuthenticated, _hasHydrated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [navVisible, setNavVisible] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setNavScrolled(y > 60);
    if (y < 100) setNavVisible(true);
    else if (y > lastScrollY.current + 5) setNavVisible(false);
    else if (y < lastScrollY.current - 5) setNavVisible(true);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!mounted || !_hasHydrated || !isAuthenticated) return null;

  const NAV_ITEMS = [
    { name: "Collections", path: "/shop" },
    { name: "My Orders", path: "/orders" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
      >
        <div
          className={`mx-auto mt-3 flex max-w-[96rem] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 md:px-7 ${
            navScrolled
              ? "border border-white/[0.08] bg-[#0C0D11]/90 shadow-[0_4px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
              : "border border-transparent bg-[#0C0D11]/60 backdrop-blur-[2px]"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="font-serif text-xl font-bold text-[#D4AF37] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
              CF
            </span>
            <span className="hidden font-serif text-lg tracking-[0.06em] text-white/90 sm:inline">
              Classic Furniture
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`group relative py-1 text-[11px] tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/90"
                  }`}
                >
                  {item.name.toUpperCase()}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#D4AF37] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => logout()}
              className="hidden rounded-full px-4 py-1.5 text-[10px] tracking-[0.16em] text-white/50 transition-colors duration-300 hover:text-white md:block md:px-5"
            >
              LOGOUT
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /></>
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-2 max-w-[96rem] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0D11]/95 p-2 backdrop-blur-sm lg:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-[11px] tracking-[0.16em] transition-colors duration-200 ${
                    pathname === item.path
                      ? "bg-white/[0.06] text-white"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="mt-1 block w-full rounded-xl px-4 py-3 text-left text-[11px] tracking-[0.16em] text-white/40 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white/60"
              >
                LOGOUT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
