"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
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

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
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
                      className="glass group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                    >
                      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4AF37]/20 blur-3xl" />
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="animate-shimmer-sweep absolute inset-y-0 -left-[160%] w-[70%] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
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

            <nav className="fixed inset-x-0 top-0 z-50">
              <div className="mx-auto mt-4 flex w-[94%] max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/55 px-5 py-3 backdrop-blur-xl md:px-8">
                <Link href="/" className="font-[Cormorant_Garamond] text-3xl leading-none tracking-[0.06em]">
                  Classic Furniture
                </Link>

                <div className="flex items-center gap-2 md:gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="rounded-full border border-[#2C2C2C]/20 px-4 py-2 text-xs tracking-[0.18em] transition hover:bg-white md:px-6">
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
                      <button className="group relative overflow-hidden rounded-full bg-[#2C2C2C] px-4 py-2 text-xs tracking-[0.18em] text-white md:px-6">
                        <span className="relative z-10">SIGN UP</span>
                        <span className="animate-shimmer-sweep absolute inset-y-0 -left-[150%] w-[70%] bg-gradient-to-r from-transparent via-white/55 to-transparent" />
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
            </nav>

            <section className="relative mx-auto flex min-h-screen w-[94%] max-w-7xl items-center pt-28 md:pt-24">
              <div className="grid w-full gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white/60 px-4 py-1 text-xs tracking-[0.2em] text-[#2C2C2C]/75 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                    PREMIUM LIVING
                  </p>

                  <h1 className="font-[Cormorant_Garamond] text-[2.8rem] leading-[0.9] text-[#2C2C2C] md:text-[5.6rem]">
                    Sculpted Furniture
                    <span className="block italic text-[#D4AF37]">for Timeless Homes</span>
                  </h1>

                  <p className="max-w-xl text-base leading-relaxed text-[#2C2C2C]/70 md:text-lg">
                    Discover glossy finishes, artisan details, and statement pieces designed to make every corner
                    look cinematic and feel lived in.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/shop"
                      className="group relative overflow-hidden rounded-full bg-[#2C2C2C] px-7 py-3 text-xs tracking-[0.22em] text-white"
                    >
                      <span className="relative z-10">EXPLORE COLLECTION</span>
                      <span className="animate-shimmer-sweep absolute inset-y-0 -left-[140%] w-[55%] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </Link>

                    <a
                      href="#featured"
                      className="rounded-full border border-[#2C2C2C]/20 bg-white/70 px-7 py-3 text-xs tracking-[0.22em] text-[#2C2C2C] backdrop-blur-sm transition hover:bg-white"
                    >
                      VIEW HIGHLIGHTS
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glass-strong group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_35px_80px_rgba(0,0,0,0.12)]"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600"
                    alt="Premium living room interior"
                    fill
                    priority
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                  <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl p-4">
                    <p className="text-xs tracking-[0.18em] text-[#2C2C2C]/60">LATEST CURATION</p>
                    <p className="font-[Cormorant_Garamond] text-2xl">The Ivory Light Collection</p>
                  </div>
                </motion.div>
              </div>
            </section>

            <section id="featured" className="mx-auto w-[94%] max-w-7xl py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mb-10 flex items-end justify-between gap-4"
              >
                <div>
                  <p className="text-xs tracking-[0.22em] text-[#2C2C2C]/55">EDITOR PICKS</p>
                  <h2 className="font-[Cormorant_Garamond] text-4xl md:text-6xl">Featured Masterpieces</h2>
                </div>
                <Link href="/shop" className="text-sm tracking-[0.15em] text-[#2C2C2C]/70 hover:text-[#2C2C2C]">
                  SEE ALL →
                </Link>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-3">
                {FEATURED_ITEMS.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    viewport={{ once: true, amount: 0.25 }}
                    className="glass group relative overflow-hidden rounded-3xl border border-white/45"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="space-y-3 p-5">
                      <p className="text-xs tracking-[0.2em] text-[#2C2C2C]/55">{item.category}</p>
                      <h3 className="font-[Cormorant_Garamond] text-3xl leading-none">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-[#2C2C2C]/70">{item.description}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="mx-auto w-[94%] max-w-7xl py-12 md:py-20">
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Material Excellence",
                    text: "Premium woods, resilient fabrics, and long-lasting finishes selected for everyday luxury.",
                  },
                  {
                    title: "Crafted by Experts",
                    text: "Every silhouette is refined by experienced makers with precision in every join and seam.",
                  },
                  {
                    title: "White-Glove Support",
                    text: "Personalized help from selection to delivery so your space comes together effortlessly.",
                  },
                ].map((point, index) => (
                  <motion.article
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="glass rounded-3xl border border-white/40 p-6"
                  >
                    <h3 className="mb-3 font-[Cormorant_Garamond] text-3xl">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-[#2C2C2C]/70">{point.text}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="mx-auto w-[94%] max-w-7xl py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mb-8"
              >
                <p className="text-xs tracking-[0.22em] text-[#2C2C2C]/55">TRUSTED BY CLIENTS</p>
                <h2 className="font-[Cormorant_Garamond] text-4xl md:text-6xl">What People Are Saying</h2>
              </motion.div>

              <div className="grid gap-5 md:grid-cols-3">
                {TESTIMONIALS.map((item, index) => (
                  <motion.blockquote
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="glass rounded-3xl border border-white/45 p-6"
                  >
                    <p className="mb-5 text-sm leading-relaxed text-[#2C2C2C]/80">“{item.quote}”</p>
                    <footer>
                      <p className="font-medium text-[#2C2C2C]">{item.name}</p>
                      <p className="text-xs tracking-[0.12em] text-[#2C2C2C]/55">{item.role}</p>
                    </footer>
                  </motion.blockquote>
                ))}
              </div>
            </section>

            <section className="mx-auto w-[94%] max-w-7xl pb-20 pt-4 md:pb-28">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="glass-strong relative overflow-hidden rounded-[2rem] border border-white/65 p-8 md:p-12"
              >
                <div className="animate-oil-sheen absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(212,175,55,0.12),rgba(255,255,255,0))]" />
                <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="space-y-4">
                    <p className="text-xs tracking-[0.22em] text-[#2C2C2C]/55">ABOUT CLASSIC FURNITURE</p>
                    <h2 className="font-[Cormorant_Garamond] text-4xl leading-none md:text-6xl">
                      Designed to Shine.
                      <span className="block italic text-[#D4AF37]">Built to Endure.</span>
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#2C2C2C]/72 md:text-base">
                      We blend contemporary sensibility with timeless craftsmanship. Every collection is curated to
                      create beautiful spaces that feel elevated, warm, and unmistakably yours.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    className="rounded-full bg-[#2C2C2C] px-8 py-3 text-xs tracking-[0.22em] text-white transition hover:opacity-90"
                  >
                    START SHOPPING
                  </Link>
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
