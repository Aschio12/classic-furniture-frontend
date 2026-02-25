"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Sparkles, TreePine, Gem, Truck, Quote, Star } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useAuthStore } from "@/store/useAuthStore";
import { useServerStore } from "@/store/useServerStore";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/shared/MainLayout";
import Footer from "@/components/shared/Footer";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FEATURED_ITEMS = [
  {
    id: 1,
    title: "Aurora Cloud Sofa",
    category: "Living Room",
    description: "Curved silhouette, buttery upholstery, and cloud-like comfort for modern gatherings.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: 2,
    title: "Ivory Crest Bed",
    category: "Bedroom",
    description: "Soft panel detailing and premium wood framing designed for serene, elegant nights.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: 3,
    title: "Monarch Dining Set",
    category: "Dining",
    description: "Hand-finished surfaces and sculpted lines that elevate every meal into an experience.",
    image:
      "https://images.unsplash.com/photo-1616594039964-3d6d1efb3f8f?auto=format&fit=crop&q=80&w=1400",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Marta A.",
    role: "Interior Architect",
    quote:
      "Classic Furniture brings boutique-level finish quality with a warm, livable style. My clients love it.",
  },
  {
    id: 2,
    name: "Daniel K.",
    role: "Homeowner",
    quote:
      "From ordering to delivery, the process felt premium. The sofa became the centerpiece of our living room.",
  },
  {
    id: 3,
    name: "Leila T.",
    role: "Design Enthusiast",
    quote:
      "The textures, the tone, the details—everything feels curated. It instantly elevated my apartment.",
  },
];

export default function Home() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { isServerWaking } = useServerStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.25]);
  const orbOneY = useTransform(scrollY, [0, 900], [0, 130]);
  const orbTwoY = useTransform(scrollY, [0, 900], [0, -100]);

  if (!mounted || !_hasHydrated) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#2C2C2C] selection:bg-[#D4AF37]/30">
      <AnimatePresence>
        {isServerWaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <div className="glass-strong relative flex w-[92%] max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
              <Loader2 className="h-11 w-11 animate-spin text-[#D4AF37]" />
              <h3 className="font-[Cormorant_Garamond] text-3xl">Preparing Your Experience</h3>
              <p className="text-sm text-[#2C2C2C]/65">
                Waking backend services securely. This can take a few moments on first load.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <MainLayout>
            <motion.section
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-[#F9F9FB] px-6 pb-16 pt-24 md:px-10"
            >
              <div className="mx-auto max-w-7xl space-y-10">
                <header className="space-y-3 border-b border-black/10 pb-8">
                  <p className="text-xs tracking-[0.24em] text-[#2C2C2C]/55">WELCOME BACK</p>
                  <h1 className="font-[Cormorant_Garamond] text-4xl leading-none md:text-6xl">
                    Your Curated Collection
                  </h1>
                  <p className="max-w-2xl text-[#2C2C2C]/65">
                    Browse current inventory, track your orders, and continue building your dream interior.
                  </p>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((card, index) => (
                    <motion.article
                      key={card}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.12 }}
                      className="glass group relative aspect-4/5 overflow-hidden rounded-3xl border border-white/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                    >
                      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4AF37]/20 blur-3xl" />
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="animate-shimmer-sweep absolute inset-y-0 -left-[160%] w-[70%] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                      </div>
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <p className="text-xs tracking-[0.2em] text-[#2C2C2C]/50">FEATURED DROP</p>
                        <h3 className="font-[Cormorant_Garamond] text-3xl">Premium Piece #{card}</h3>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>
          </MainLayout>
        ) : (
          <motion.section
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <motion.div
                style={{ y: orbOneY }}
                className="animate-breathe absolute -left-20 top-24 h-80 w-80 rounded-full bg-[#D4AF37]/18 blur-3xl"
              />
              <motion.div
                style={{ y: orbTwoY }}
                className="animate-breathe absolute -right-24 top-72 h-96 w-96 rounded-full bg-[#E9F0FF]/70 blur-3xl"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),rgba(250,249,246,0.75),rgba(245,245,245,0.9))]" />
            </div>

            <motion.nav
              className="fixed inset-x-0 top-0 z-50"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`mx-auto mt-4 flex w-[94%] max-w-7xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-700 ease-out md:px-8 ${
                  scrolled
                    ? "border-white/70 bg-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(212,175,55,0.1)] backdrop-blur-2xl"
                    : "border-white/30 bg-white/20 backdrop-blur-sm"
                }`}
              >
                {/* Brand */}
                <Link href="/" className="group flex items-center gap-2.5">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C2C2C] transition-all duration-300 group-hover:bg-[#D4AF37]">
                    <span className="font-[Cormorant_Garamond] text-lg font-bold text-white">CF</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-[Cormorant_Garamond] text-xl leading-none tracking-[0.04em] md:text-2xl">
                      Classic Furniture
                    </span>
                    <span
                      className={`text-[9px] tracking-[0.3em] text-[#D4AF37] transition-opacity duration-500 ${
                        scrolled ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      SINCE 2024
                    </span>
                  </div>
                </Link>

                {/* Center nav links — desktop only */}
                <div className="hidden items-center gap-8 lg:flex">
                  {["Collections", "Craftsmanship", "Stories"].map((item) => (
                    <button
                      key={item}
                      className="group relative text-[11px] tracking-[0.18em] text-[#2C2C2C]/65 transition-colors duration-300 hover:text-[#2C2C2C]"
                      onClick={() => {
                        const sectionMap: Record<string, string> = {
                          Collections: "featured",
                          Craftsmanship: "why-us",
                          Stories: "testimonials",
                        };
                        document
                          .getElementById(sectionMap[item])
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {item.toUpperCase()}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                    </button>
                  ))}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative overflow-hidden rounded-full border border-[#2C2C2C]/15 px-4 py-2 text-[11px] tracking-[0.18em] text-[#2C2C2C]/80 transition-all duration-300 hover:border-[#D4AF37]/40 hover:text-[#2C2C2C] md:px-6">
                        LOGIN
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-full border-0 bg-transparent p-0 shadow-none sm:max-w-md">
                      <VisuallyHidden>
                        <DialogTitle>Login</DialogTitle>
                      </VisuallyHidden>
                      <div className="glass-strong overflow-hidden rounded-2xl p-8">
                        <LoginForm />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="group relative overflow-hidden rounded-full bg-linear-to-r from-[#D4AF37] to-[#C5A028] px-4 py-2 text-[11px] tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:shadow-[0_6px_30px_rgba(212,175,55,0.45)] md:px-6">
                        <span className="relative z-10">SIGN UP</span>
                        <span className="animate-shimmer-sweep absolute inset-y-0 -left-[150%] w-[70%] bg-linear-to-r from-transparent via-white/40 to-transparent" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-full border-0 bg-transparent p-0 shadow-none sm:max-w-md">
                      <VisuallyHidden>
                        <DialogTitle>Register</DialogTitle>
                      </VisuallyHidden>
                      <div className="glass-strong overflow-hidden rounded-2xl p-8">
                        <RegisterForm />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Gold accent line on scroll */}
              <motion.div
                className="mx-auto mt-1 h-px w-[90%] max-w-6xl bg-linear-to-r from-transparent via-[#D4AF37]/40 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: scrolled ? 1 : 0,
                  opacity: scrolled ? 1 : 0,
                }}
                transition={{ duration: 0.6 }}
              />
            </motion.nav>

            {/* ═══════════════ HERO — FULL-WIDTH IMMERSIVE ═══════════════ */}
            <section className="relative min-h-screen w-full overflow-hidden">
              {/* Background image with parallax */}
              <motion.div
                style={{ y: heroY }}
                className="absolute inset-0 -top-20 bottom-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=90&w=2400"
                  alt="Luxury living room with classic furniture"
                  fill
                  priority
                  quality={90}
                  className="object-cover object-center saturate-[1.05]"
                  sizes="100vw"
                />
              </motion.div>

              {/* Soft white / sage overlay (15-20% opacity) */}
              <div className="absolute inset-0 bg-[#FAF9F6]/18" />

              {/* Vignette — subtle darkening at edges */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.25)_100%)]" />

              {/* Glossy light-catch overlay — moves with oil-sheen animation */}
              <div className="animate-oil-sheen absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.22)_40%,rgba(212,175,55,0.08)_50%,transparent_70%)] pointer-events-none" />

              {/* Subtle noise grain for texture */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[#D4AF37] pointer-events-none" />

              {/* Bottom fade into page background */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#FAF9F6] to-transparent" />

              {/* Hero content — centered */}
              <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
              >
                {/* Badge */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-5 py-1.5 text-[10px] tracking-[0.28em] text-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  PREMIUM HANDCRAFTED FURNITURE
                </motion.p>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="max-w-4xl font-[Cormorant_Garamond] text-[2.6rem] leading-[0.92] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] md:text-[5.8rem]"
                >
                  Timeless Elegance
                  <span className="block italic text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]">
                    Meets Modern Luxury
                  </span>
                </motion.h1>

                {/* Sub-copy */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.2)] md:text-lg"
                >
                  Discover exquisite collections where classic craftsmanship, glossy finishes, and
                  artisan detailing transform every room into a work of art.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                  {/* Primary CTA — glossy pill */}
                  <Link
                    href="/shop"
                    className="group relative overflow-hidden rounded-full border border-[#D4AF37]/60 bg-[#D4AF37] px-8 py-3.5 text-xs font-semibold tracking-[0.24em] text-white shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)]"
                  >
                    <span className="relative z-10">EXPLORE COLLECTION</span>
                    {/* Shimmer sweep on hover */}
                    <span className="absolute inset-y-0 -left-[150%] w-[70%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                    {/* Wet top highlight */}
                    <span className="absolute inset-x-2 top-0.5 h-0.5 rounded-full bg-white/50" />
                  </Link>

                  {/* Secondary CTA — glass pill */}
                  <a
                    href="#featured"
                    className="rounded-full border border-white/40 bg-white/15 px-8 py-3.5 text-xs tracking-[0.22em] text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
                  >
                    VIEW HIGHLIGHTS
                  </a>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] tracking-[0.3em] text-white/50">SCROLL</span>
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="h-8 w-px bg-linear-to-b from-white/60 to-transparent"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* ═══════════════ FEATURED PRODUCTS SHOWCASE ═══════════════ */}
            <section id="featured" className="relative mx-auto w-[94%] max-w-7xl py-20 md:py-32">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mb-14 flex flex-col items-center text-center md:mb-16"
              >
                <p className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">EDITOR&apos;S PICKS</p>
                <h2 className="font-[Cormorant_Garamond] text-4xl leading-[1.05] md:text-7xl">
                  Featured Masterpieces
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base">
                  A curated selection of our most sought-after designs — where form, finish, and function converge.
                </p>
                {/* Gold accent line */}
                <div className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
              </motion.div>

              {/* Cards grid */}
              <div className="grid gap-7 md:grid-cols-3">
                {FEATURED_ITEMS.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.65, delay: index * 0.15, type: "spring", stiffness: 80 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -10 }}
                    className="glass group relative overflow-hidden rounded-[1.6rem] border border-white/50 shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-shadow duration-500 hover:shadow-[0_25px_65px_rgba(0,0,0,0.13)]"
                  >
                    {/* Image area */}
                    <div className="relative aspect-4/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-800 ease-out group-hover:scale-[1.07]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      {/* Image bottom fade */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

                      {/* Glossy shine sweep on hover */}
                      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="absolute inset-y-0 -left-[160%] w-[75%] bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-1200 ease-out group-hover:translate-x-[450%]" />
                      </div>

                      {/* Category tag floating on image */}
                      <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[9px] tracking-[0.22em] text-white backdrop-blur-md">
                        {item.category.toUpperCase()}
                      </span>

                      {/* Bottom overlay text on image */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <h3 className="font-[Cormorant_Garamond] text-3xl leading-none text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] md:text-[2rem]">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="relative space-y-3 p-5">
                      {/* Wet line separator */}
                      <div className="wet-line w-full" />

                      <p className="pt-2 text-sm leading-relaxed text-[#2C2C2C]/70">
                        {item.description}
                      </p>

                      {/* View details CTA */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-medium tracking-[0.18em] text-[#D4AF37] transition-colors group-hover:text-[#C9A961]">
                          VIEW DETAILS
                        </span>
                        <span className="inline-block text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* See all link */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 flex justify-center"
              >
                <Link
                  href="/shop"
                  className="group relative overflow-hidden rounded-full border border-[#2C2C2C]/15 bg-white/70 px-8 py-3 text-xs tracking-[0.22em] text-[#2C2C2C] backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]"
                >
                  <span className="relative z-10">BROWSE ALL COLLECTIONS</span>
                  <span className="absolute inset-y-0 -left-[150%] w-[65%] bg-linear-to-r from-transparent via-[#D4AF37]/15 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                </Link>
              </motion.div>
            </section>

            {/* ═══════════════ WHY CHOOSE US / VALUE PROPS ═══════════════ */}
            <section id="why-us" className="relative mx-auto w-[94%] max-w-7xl py-20 md:py-28">
              {/* Decorative background orb */}
              <div className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[100px]" />

              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mb-14 flex flex-col items-center text-center md:mb-16"
              >
                <p className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">WHY CLASSIC FURNITURE</p>
                <h2 className="font-[Cormorant_Garamond] text-4xl leading-[1.05] md:text-7xl">
                  Built Different. <span className="italic text-[#D4AF37]">Felt Instantly.</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base">
                  Three pillars that define every piece we create and every experience we deliver.
                </p>
                <div className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
              </motion.div>

              {/* Cards */}
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: TreePine,
                    title: "Material Excellence",
                    text: "Premium hardwoods, hand-selected fabrics, and enduring finishes chosen for beauty that lasts decades — not seasons.",
                    accent: "from-[#A8B5A0]/20 to-transparent",
                  },
                  {
                    icon: Gem,
                    title: "Artisan Craftsmanship",
                    text: "Every joint, curve, and upholstered edge is refined by experienced makers who treat each piece like a signature work.",
                    accent: "from-[#D4AF37]/15 to-transparent",
                  },
                  {
                    icon: Truck,
                    title: "White-Glove Delivery",
                    text: "Personalized guidance from selection through doorstep delivery — your space comes together without a single worry.",
                    accent: "from-[#E9F0FF]/40 to-transparent",
                  },
                ].map((point, index) => (
                  <motion.article
                    key={point.title}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.14 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -6 }}
                    className="glass group relative overflow-hidden rounded-[1.6rem] border border-white/50 p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_20px_55px_rgba(0,0,0,0.1)] md:p-8"
                  >
                    {/* Colored radial wash behind icon */}
                    <div className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-linear-to-br ${point.accent} blur-2xl`} />

                    {/* Shimmer on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-y-0 -left-[160%] w-[70%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-[450%]" />
                    </div>

                    {/* Icon */}
                    <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-white/70 shadow-[0_4px_16px_rgba(212,175,55,0.08)]">
                      <point.icon className="h-5 w-5 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="relative mb-3 font-[Cormorant_Garamond] text-[1.7rem] leading-tight">
                      {point.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-[#2C2C2C]/65">
                      {point.text}
                    </p>

                    {/* Wet line at bottom */}
                    <div className="wet-line mt-6 w-full opacity-60" />
                  </motion.article>
                ))}
              </div>
            </section>

            {/* ═══════════════ TESTIMONIALS ═══════════════ */}
            <section id="testimonials" className="relative mx-auto w-[94%] max-w-7xl py-20 md:py-28">
              {/* Background image strip */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2.5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
                  alt=""
                  fill
                  className="object-cover opacity-[0.04] saturate-0"
                  sizes="100vw"
                />
              </div>

              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mb-14 flex flex-col items-center text-center md:mb-16"
              >
                <p className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">TRUSTED BY CLIENTS</p>
                <h2 className="font-[Cormorant_Garamond] text-4xl leading-[1.05] md:text-7xl">
                  What People Are Saying
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base">
                  Real stories from clients who chose quality, craftsmanship, and an elevated living experience.
                </p>
                <div className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
              </motion.div>

              {/* Testimonial cards */}
              <div className="grid gap-6 md:grid-cols-3">
                {TESTIMONIALS.map((item, index) => (
                  <motion.blockquote
                    key={item.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.14 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -6 }}
                    className="glass group relative overflow-hidden rounded-[1.6rem] border border-white/50 p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_20px_55px_rgba(0,0,0,0.1)] md:p-8"
                  >
                    {/* Shimmer on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-y-0 -left-[160%] w-[70%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-[450%]" />
                    </div>

                    {/* Quote icon */}
                    <div className="relative mb-5">
                      <Quote className="h-8 w-8 text-[#D4AF37]/30" strokeWidth={1.5} />
                    </div>

                    {/* Stars */}
                    <div className="relative mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p className="relative mb-6 text-sm leading-relaxed text-[#2C2C2C]/80 md:text-[0.935rem]">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    {/* Wet line separator */}
                    <div className="wet-line mb-5 w-full opacity-50" />

                    {/* Author */}
                    <footer className="relative flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-sm font-medium text-[#D4AF37]">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2C2C2C]">{item.name}</p>
                        <p className="text-xs tracking-widest text-[#2C2C2C]/50">{item.role}</p>
                      </div>
                    </footer>
                  </motion.blockquote>
                ))}
              </div>
            </section>

            {/* ═══════════════ ABOUT / CTA BANNER ═══════════════ */}
            <section className="relative mx-auto w-[94%] max-w-7xl pb-24 pt-8 md:pb-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.2 }}
                className="glass-strong relative overflow-hidden rounded-[2.2rem] border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.09)]"
              >
                {/* Oil-sheen sweep overlay */}
                <div className="animate-oil-sheen pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.25)_38%,rgba(212,175,55,0.1)_48%,transparent_65%)]" />

                <div className="relative z-20 grid md:grid-cols-[1fr_1fr]">
                  {/* Left — Image */}
                  <div className="relative min-h-80 overflow-hidden md:min-h-120">
                    <Image
                      src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=85&w=1200"
                      alt="Beautifully styled furniture showroom"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Subtle overlay for blend */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/30 md:to-white/50" />
                    <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent md:from-transparent" />

                    {/* Floating stat badges */}
                    <div className="absolute bottom-5 left-5 z-10 flex gap-3">
                      <div className="glass rounded-xl px-4 py-2.5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                        <p className="font-[Cormorant_Garamond] text-2xl font-semibold text-[#2C2C2C]">500+</p>
                        <p className="text-[9px] tracking-[0.2em] text-[#2C2C2C]/55">PIECES SOLD</p>
                      </div>
                      <div className="glass rounded-xl px-4 py-2.5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                        <p className="font-[Cormorant_Garamond] text-2xl font-semibold text-[#D4AF37]">4.9</p>
                        <p className="text-[9px] tracking-[0.2em] text-[#2C2C2C]/55">AVG RATING</p>
                      </div>
                    </div>
                  </div>

                  {/* Right — Content */}
                  <div className="flex flex-col justify-center space-y-6 p-8 md:p-12 lg:p-16">
                    <p className="text-[10px] tracking-[0.32em] text-[#D4AF37]">ABOUT CLASSIC FURNITURE</p>

                    <h2 className="font-[Cormorant_Garamond] text-4xl leading-[0.95] md:text-[3.4rem]">
                      Designed to Shine.
                      <span className="block italic text-[#D4AF37]">Built to Endure.</span>
                    </h2>

                    <p className="max-w-lg text-sm leading-relaxed text-[#2C2C2C]/68 md:text-base">
                      We blend contemporary sensibility with timeless craftsmanship. Every collection is curated to
                      create beautiful spaces that feel elevated, warm, and unmistakably yours.
                    </p>

                    <p className="max-w-lg text-sm leading-relaxed text-[#2C2C2C]/55">
                      From ethically sourced hardwoods to hand-finished surfaces, our process honors
                      tradition while embracing modern design. This is furniture made to be lived in — and loved.
                    </p>

                    {/* Wet line */}
                    <div className="wet-line w-full opacity-50" />

                    {/* CTA row */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href="/shop"
                        className="group relative overflow-hidden rounded-full border border-[#D4AF37]/50 bg-[#D4AF37] px-8 py-3.5 text-xs font-semibold tracking-[0.22em] text-white shadow-[0_8px_28px_rgba(212,175,55,0.3)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_12px_36px_rgba(212,175,55,0.4)]"
                      >
                        <span className="relative z-10">START SHOPPING</span>
                        <span className="absolute inset-y-0 -left-[150%] w-[70%] bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                        <span className="absolute inset-x-2 top-0.5 h-0.5 rounded-full bg-white/40" />
                      </Link>

                      <Link
                        href="/shop"
                        className="text-xs tracking-[0.18em] text-[#2C2C2C]/65 transition-colors hover:text-[#2C2C2C]"
                      >
                        BROWSE CATALOG →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <Footer />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
