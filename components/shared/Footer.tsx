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
    <footer className="relative overflow-hidden glass-oily oil-slick juicy-glow wet-shine text-[#1A1A1A]">
      {/* Top gold wet line */}
      <div className="wet-line-gold" />

      {/* Dramatic background orbs and prismatic overlays */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-[120px] animate-liquid-float" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#E9F0FF]/60 blur-[100px] animate-liquid-float-delayed" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-[#D4AF37]/30 via-[#fff7e1]/20 to-[#E9F0FF]/30 blur-[120px] animate-prismatic" />
      </div>

      <div className="relative mx-auto w-[94%] max-w-7xl z-10">
        {/* ── Upper section: Brand + Newsletter ── */}
        <div className="flex flex-col items-start justify-between gap-8 border-b-2 border-[#D4AF37]/10 py-12 sm:gap-10 md:flex-row md:items-end md:py-16">
          {/* Brand block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-md space-y-5"
          >
            <Link href="/" className="group inline-flex items-center gap-2 sm:gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-[#D4AF37] via-[#fff7e1] to-[#E9F0FF] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <span className="font-[Cormorant_Garamond] text-xl font-bold text-[#2C2C2C] drop-shadow-[0_1px_2px_rgba(212,175,55,0.25)]">CF</span>
              </div>
              <span className="font-[Cormorant_Garamond] text-3xl leading-none tracking-[0.04em] bg-linear-to-r from-[#D4AF37] via-[#fff7e1] to-[#E9F0FF] bg-clip-text text-transparent animate-hero-glow">
                Classic Furniture
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#2C2C2C]/70">
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
            <p className="text-[11px] tracking-[0.2em] text-[#D4AF37]/80">STAY INSPIRED</p>
            <div className="group flex overflow-hidden rounded-xl border-2 border-[#D4AF37]/20 bg-white/70 glass-oily backdrop-blur-lg transition-all duration-300 focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_4px_32px_rgba(212,175,55,0.13)]">
              <div className="flex items-center pl-4 text-[#2C2C2C]/30">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#2C2C2C]/30"
              />
              <button className="m-1 flex items-center gap-1.5 rounded-lg bg-linear-to-tr from-[#D4AF37] via-[#fff7e1] to-[#E9F0FF] px-4 py-2 text-[10px] tracking-[0.15em] text-[#2C2C2C] font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                JOIN
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-6 border-b border-[#2C2C2C]/8 py-10 sm:gap-8 sm:grid-cols-3 md:py-14 lg:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: colIndex * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h4 className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#D4AF37] sm:mb-5 sm:text-[11px] sm:tracking-[0.22em]">
                {category.toUpperCase()}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-[#2C2C2C]/60 transition-colors duration-300 hover:text-[#D4AF37]"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-80 group-hover:text-[#D4AF37]" />
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
            <h4 className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#D4AF37] sm:mb-5 sm:text-[11px] sm:tracking-[0.22em]">
              CONNECT
            </h4>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#D4AF37]/20 bg-white/70 glass-oily backdrop-blur-lg transition-all duration-300 hover:border-[#D4AF37]/60 hover:scale-105 hover:shadow-lg"
                >
                  <Icon className="h-4 w-4 text-[#2C2C2C]/50 transition-colors duration-300 group-hover:text-[#D4AF37]" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-xs text-[#2C2C2C]/45">
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
          className="flex flex-col items-center justify-between gap-3 py-6 sm:gap-4 md:flex-row md:py-8"
        >
          <p className="text-[11px] tracking-wider text-[#2C2C2C]/45">
            &copy; {new Date().getFullYear()} Classic Furniture. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] text-[#2C2C2C]/45">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="transition-colors duration-300 hover:text-[#D4AF37]"
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
