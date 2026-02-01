"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, UserCircle, X } from "lucide-react";

import { useCartStore } from "@/store/cartStore";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Hubs", href: "/hubs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCartStore();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-white/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.35em] text-primary"
        >
          LUXECRAFT
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-primary/80 md:flex">
          {links.map((link) => (
            <div key={link.href} className="relative">
              <Link href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
              <motion.span
                className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-accent"
                whileHover={{ width: "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              />
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden text-primary/80 transition hover:text-primary md:inline-flex">
            <Search className="h-5 w-5" />
          </button>

          <Link href="/cart" className="relative text-primary/80 transition hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-primary">
                {itemCount}
              </span>
            )}
          </Link>

          <button className="text-primary/80 transition hover:text-primary">
            <UserCircle className="h-5 w-5" />
          </button>

          <button
            className="inline-flex items-center text-primary/80 transition hover:text-primary md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className="ml-auto flex h-full w-72 flex-col gap-6 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  LUXECRAFT
                </span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5 text-primary/70" />
                </button>
              </div>

              <nav className="flex flex-col gap-4 text-sm font-medium text-primary/80">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-4 pt-4">
                <button className="text-primary/80 transition hover:text-primary">
                  <Search className="h-5 w-5" />
                </button>
                <Link href="/cart" className="text-primary/80 transition hover:text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </Link>
                <button className="text-primary/80 transition hover:text-primary">
                  <UserCircle className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
