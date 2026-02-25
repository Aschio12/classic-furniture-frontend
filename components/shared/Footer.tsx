"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, ArrowUpRight, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Collections: [
    { label: "Living Room", href: "/shop?category=Living Room" },
    { label: "Bedroom", href: "/shop?category=Bedroom" },
    { label: "Dining", href: "/shop?category=Dining" },
    { label: "All Products", href: "/shop" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Hub Locations", href: "/hubs" },
    { label: "Become a Seller", href: "/seller/join" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "Contact Us", href: "#" },
    { label: "Shipping & Returns", href: "#" },
    { label: "Care Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#FAF9F6] text-[#2C2C2C]">
      {/* Top gold accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/6 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#E9F0FF]/50 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-[94%] max-w-7xl">
        {/* ── Upper section: Brand + Newsletter ── */}
        <div className="flex flex-col items-start justify-between gap-10 border-b border-[#2C2C2C]/8 py-16 md:flex-row md:items-end">
          {/* Brand block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-md space-y-5"
          >
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2C2C2C] transition-colors duration-300 group-hover:bg-[#D4AF37]">
                <span className="font-[Cormorant_Garamond] text-xl font-bold text-white">CF</span>
              </div>
              <span className="font-[Cormorant_Garamond] text-3xl leading-none tracking-[0.04em]">
                Classic Furniture
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#2C2C2C]/55">
              Curating timeless furniture that transforms spaces into stories.
              Every piece is crafted with intention, built to last generations.
            </p>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-sm space-y-3"
          >
            <p className="text-[11px] tracking-[0.2em] text-[#2C2C2C]/50">STAY INSPIRED</p>
            <div className="group flex overflow-hidden rounded-xl border border-[#2C2C2C]/10 bg-white/60 backdrop-blur-sm transition-all duration-300 focus-within:border-[#D4AF37]/40 focus-within:shadow-[0_4px_24px_rgba(212,175,55,0.1)]">
              <div className="flex items-center pl-4 text-[#2C2C2C]/30">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#2C2C2C]/30"
              />
              <button className="m-1 flex items-center gap-1.5 rounded-lg bg-[#2C2C2C] px-4 py-2 text-[10px] tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#D4AF37]">
                JOIN
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-8 border-b border-[#2C2C2C]/8 py-14 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: colIndex * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h4 className="mb-5 text-[11px] font-medium tracking-[0.22em] text-[#D4AF37]">
                {category.toUpperCase()}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-[#2C2C2C]/55 transition-colors duration-300 hover:text-[#2C2C2C]"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="mb-5 text-[11px] font-medium tracking-[0.22em] text-[#D4AF37]">
              CONNECT
            </h4>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#2C2C2C]/8 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white hover:shadow-[0_4px_16px_rgba(212,175,55,0.12)]"
                >
                  <Icon className="h-4 w-4 text-[#2C2C2C]/50 transition-colors duration-300 group-hover:text-[#D4AF37]" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-xs text-[#2C2C2C]/35">
              Follow us for daily <br /> design inspiration.
            </p>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row"
        >
          <p className="text-[11px] tracking-wider text-[#2C2C2C]/35">
            &copy; {new Date().getFullYear()} Classic Furniture. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] text-[#2C2C2C]/35">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="transition-colors duration-300 hover:text-[#2C2C2C]/60"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
