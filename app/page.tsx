"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Loader2, TreePine, Gem, Truck, Quote, Star, ChevronDown } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useAuthStore } from "@/store/useAuthStore";
import { useServerStore } from "@/store/useServerStore";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/shared/Footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FEATURED_ITEMS = [
  {
    id: 1,
    title: "Aurora Cloud Sofa",
    category: "Living Room",
    description:
      "Curved silhouette, buttery upholstery, and cloud-like comfort for modern gatherings.",
    image:
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?q=75&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Ivory Crest Bed",
    category: "Bedroom",
    description:
      "Soft panel detailing and premium wood framing designed for serene, elegant nights.",
    image:
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=75&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Monarch Dining Set",
    category: "Dining",
    description:
      "Hand-finished surfaces and sculpted lines that elevate every meal into an experience.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=75&w=800&auto=format&fit=crop",
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

const STAGGER_CHILDREN = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function SectionDivider({ gold = false }: { gold?: boolean }) {
  return (
    <div className="flex items-center justify-center py-1">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px w-32 origin-center sm:w-48 ${
          gold
            ? "bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)]"
            : "bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)]"
        }`}
      />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { isServerWaking } = useServerStore();
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const navigateProtected = useCallback(
    (path: string) => {
      if (isAuthenticated) {
        router.push(path);
      } else {
        setAuthMode("login");
        setAuthModalOpen(true);
      }
    },
    [isAuthenticated, router]
  );

  // Scroll-direction navbar
  const [navVisible, setNavVisible] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Cursor spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { damping: 25, stiffness: 120, mass: 0.5 });
  const spotY = useSpring(mouseY, { damping: 25, stiffness: 120, mass: 0.5 });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setNavScrolled(currentY > 60);

    if (currentY < 100) {
      setNavVisible(true);
    } else if (currentY > lastScrollY.current + 5) {
      setNavVisible(false);
    } else if (currentY < lastScrollY.current - 5) {
      setNavVisible(true);
    }
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  if (!mounted || !_hasHydrated) return null;

  return (
    <main
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-[#FAFAF8] text-[#2C2C2C] selection:bg-[#D4AF37]/30"
    >
      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none fixed z-[60] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: spotX,
          top: spotY,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(255,255,255,0.03) 30%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Server waking overlay */}
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
              <h3 className="font-serif tracking-wide text-3xl">Preparing Your Experience</h3>
              <p className="text-sm text-[#2C2C2C]/65">
                Waking backend services securely. This can take a few moments on first load.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.section
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative"
        >
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0A0B0F]" />

          {/* ═══════════════ NAVBAR ═══════════════ */}
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: navVisible ? 0 : -100 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6"
          >
            <div
              className={`mx-auto mt-3 flex max-w-[96rem] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 md:px-7 ${
                navScrolled
                  ? "border border-white/[0.08] bg-[#0C0D11]/90 shadow-[0_4px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
                  : "border border-transparent bg-white/[0.03] backdrop-blur-[2px]"
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
                {["Collections", "Craftsmanship", "Stories"].map((item) => (
                  <button
                    key={item}
                    className="group relative py-1 text-[11px] tracking-[0.16em] text-white/50 transition-colors duration-300 hover:text-white/90"
                    onClick={() => {
                      const map: Record<string, string> = {
                        Collections: "featured",
                        Craftsmanship: "why-us",
                        Stories: "testimonials",
                      };
                      document.getElementById(map[item])?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {item.toUpperCase()}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
                  className="rounded-full px-4 py-1.5 text-[10px] tracking-[0.16em] text-white/60 transition-colors duration-300 hover:text-white md:px-5"
                >
                  LOGIN
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }}
                  className="group relative overflow-hidden rounded-full bg-[#D4AF37] px-4 py-1.5 text-[10px] tracking-[0.16em] text-white shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(212,175,55,0.5)] md:px-5"
                >
                  <span className="relative z-10">SIGN UP</span>
                  <span className="absolute inset-y-0 -left-full w-[60%] bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-600 group-hover:translate-x-[280%]" />
                </motion.button>

                <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                  <DialogContent className="w-full border-0 bg-transparent p-0 shadow-none sm:max-w-md">
                    <motion.div
                      initial={{ opacity: 0, y: 60, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 60, damping: 16 }}
                    >
                      <VisuallyHidden>
                        <DialogTitle>{authMode === "login" ? "Login" : "Register"}</DialogTitle>
                      </VisuallyHidden>
                      <div className="glass-oily oil-slick-animated relative overflow-hidden rounded-2xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.2)] min-h-[460px]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={authMode}
                            initial={{ opacity: 0, x: authMode === "login" ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: authMode === "login" ? 20 : -20 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {authMode === "login" ? (
                              <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
                            ) : (
                              <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.nav>

          {/* ═══════════════ HERO — ULTRA OILY / GLASSY / HIGH-END ═══════════════ */}
          <section className="group relative min-h-[100svh] w-full overflow-hidden cursor-default bg-[#0A0B0F]">
            {/* Background — crisp, no blur, Ken Burns via Framer Motion */}
            <motion.div
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 20, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1920&auto=format&fit=crop"
                alt="Dark luxury modern interior with premium furniture"
                fill
                priority
                quality={90}
                className="object-cover object-center"
                sizes="100vw"
              />
            </motion.div>

            {/* Depth gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,11,15,0.65)_0%,rgba(10,11,15,0.08)_30%,rgba(10,11,15,0.12)_55%,rgba(10,11,15,0.92)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_40%,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />

            {/* ── OILY PRISMATIC SWEEP — watery, always alive ── */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-[2]"
              animate={{
                background: [
                  "linear-gradient(130deg, transparent 0%, rgba(255,255,255,0.06) 15%, rgba(140,200,255,0.1) 28%, rgba(255,255,255,0.08) 42%, rgba(180,220,255,0.06) 58%, transparent 75%)",
                  "linear-gradient(130deg, transparent 20%, rgba(180,220,255,0.08) 35%, rgba(255,255,255,0.1) 48%, rgba(140,200,255,0.12) 62%, rgba(255,255,255,0.05) 78%, transparent 95%)",
                  "linear-gradient(130deg, transparent 0%, rgba(255,255,255,0.06) 15%, rgba(140,200,255,0.1) 28%, rgba(255,255,255,0.08) 42%, rgba(180,220,255,0.06) 58%, transparent 75%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ mixBlendMode: "screen" }}
            />

            {/* ── WET GLASS SHEEN — watery diagonal sweep ── */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-[3]"
              animate={{
                background: [
                  "linear-gradient(118deg, transparent 0%, rgba(255,255,255,0.2) 18%, rgba(160,210,255,0.18) 30%, rgba(255,255,255,0.16) 42%, transparent 62%)",
                  "linear-gradient(118deg, transparent 30%, rgba(255,255,255,0.22) 48%, rgba(160,210,255,0.2) 60%, rgba(255,255,255,0.18) 72%, transparent 92%)",
                  "linear-gradient(118deg, transparent 0%, rgba(255,255,255,0.2) 18%, rgba(160,210,255,0.18) 30%, rgba(255,255,255,0.16) 42%, transparent 62%)",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ mixBlendMode: "overlay", opacity: 0.8 }}
            />

            {/* ── LIQUID ORBS — watery, floating, breathing ── */}
            <div className="pointer-events-none absolute inset-0 z-[4]">
              <motion.div
                className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 40, 0],
                  y: [0, 25, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(120,190,255,0.35) 0%, rgba(180,220,255,0.15) 45%, transparent 70%)",
                  filter: "blur(18px)",
                  mixBlendMode: "screen",
                }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(140,200,255,0.16) 15%, rgba(255,255,255,0.14) 30%, transparent 45%, rgba(100,180,255,0.1) 60%, rgba(255,255,255,0.1) 75%, transparent 100%)",
                  filter: "blur(25px)",
                  opacity: 0.55,
                }}
              />
              <motion.div
                className="absolute -bottom-28 -right-28 h-[440px] w-[440px] rounded-full"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.25, 0.45, 0.25],
                  x: [0, -30, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(160,210,255,0.3) 0%, rgba(120,190,255,0.18) 40%, transparent 65%)",
                  filter: "blur(20px)",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* ── WET GLASS REFLECTION LINES — watery ── */}
            <div className="pointer-events-none absolute inset-0 z-[5]">
              <motion.div
                className="absolute left-0 right-0 top-[28%] h-[2px]"
                animate={{ opacity: [0.1, 0.45, 0.1], scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.6) 25%, rgba(180,220,255,0.4) 50%, rgba(255,255,255,0.6) 75%, transparent 98%)",
                  boxShadow:
                    "0 0 25px rgba(255,255,255,0.35), 0 0 50px rgba(140,200,255,0.15)",
                }}
              />
              <motion.div
                className="absolute left-0 right-0 top-[70%] h-[1px]"
                animate={{ opacity: [0.08, 0.35, 0.08], scaleX: [0.4, 0.85, 0.4] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.45) 30%, rgba(160,210,255,0.3) 50%, rgba(255,255,255,0.45) 70%, transparent 92%)",
                  boxShadow: "0 0 15px rgba(255,255,255,0.25)",
                }}
              />
              <motion.div
                className="absolute left-[10%] top-[45%] h-[1px] w-[35%] -rotate-[15deg]"
                animate={{ opacity: [0, 0.3, 0], x: ["-10%", "10%", "-10%"] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(140,200,255,0.3), rgba(255,255,255,0.3), transparent)",
                  boxShadow: "0 0 18px rgba(140,200,255,0.2)",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* ── HOVER INTENSIFIER — watery ── */}
            <div className="pointer-events-none absolute inset-0 z-[6] opacity-0 transition-opacity duration-[1800ms] ease-in-out group-hover:opacity-100">
              <div className="animate-hero-prismatic absolute inset-0 bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.14)_15%,rgba(140,200,255,0.2)_30%,rgba(255,255,255,0.14)_45%,rgba(160,210,255,0.15)_60%,transparent_100%)] mix-blend-color-dodge" />
              <div className="animate-oil-sheen absolute inset-0 bg-[linear-gradient(115deg,transparent_18%,rgba(255,255,255,0.45)_33%,rgba(140,200,255,0.25)_45%,rgba(255,255,255,0.35)_57%,transparent_75%)] mix-blend-overlay" />
              <div className="absolute -left-[6%] top-[20%] h-[1.5px] w-[38%] rotate-[38deg] bg-linear-to-r from-transparent via-white/50 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)] mix-blend-screen" />
              <div className="absolute left-[35%] top-[44%] h-[2px] w-[20%] -rotate-[8deg] bg-linear-to-r from-transparent via-[rgba(140,200,255,0.5)] to-transparent shadow-[0_0_25px_rgba(140,200,255,0.6)] mix-blend-color-dodge" />
              <div className="absolute -right-[3%] bottom-[28%] h-[1.5px] w-[30%] -rotate-[38deg] bg-linear-to-r from-transparent via-white/45 to-transparent shadow-[0_0_18px_rgba(255,255,255,0.7)] mix-blend-screen" />
            </div>

            {/* Film grain */}
            <div className="absolute inset-0 z-[7] opacity-[0.02] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] pointer-events-none" />

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 z-[8] h-60 bg-linear-to-t from-[#0A0B0F] via-[#0A0B0F]/75 to-transparent" />

            {/* Side accent lines */}
            <motion.div
              animate={{ opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute left-[6%] top-0 z-[8] hidden h-full w-px bg-linear-to-b from-transparent via-white/15 to-transparent lg:block"
            />
            <motion.div
              animate={{ opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="pointer-events-none absolute right-[6%] top-0 z-[8] hidden h-full w-px bg-linear-to-b from-transparent via-white/15 to-transparent lg:block"
            />

            {/* ── HERO CONTENT ── */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center sm:px-8 md:px-12"
            >
              <div className="h-20 shrink-0 sm:h-24" />

              <div className="flex flex-1 flex-col items-center justify-center">
                {/* Headline — sharp, no blur, cinematic entrance */}
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-5xl font-serif text-[2.25rem] leading-[1.05] tracking-wide text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-[3rem] md:text-[4rem] lg:text-[5.5rem] lg:leading-[0.95]"
                  >
                    Timeless Elegance
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="animate-hero-glow mt-1 block font-serif text-[2.25rem] italic leading-[1.05] tracking-wide text-[#D4AF37] drop-shadow-[0_4px_24px_rgba(212,175,55,0.5)] sm:mt-2 sm:text-[3rem] md:text-[4rem] lg:text-[5.5rem] lg:leading-[0.95]"
                  >
                    Meets Modern Luxury
                  </motion.span>
                </div>

                {/* Gold divider with pulsing glow */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative my-6 md:my-8"
                >
                  <div className="h-[2px] w-20 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent sm:w-24 md:w-32" />
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-2 -z-10 rounded-full bg-[#D4AF37]/15 blur-lg"
                  />
                </motion.div>

                {/* Sub-copy — slide up, sharp */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl text-[0.9rem] leading-[1.75] text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] sm:text-base sm:leading-relaxed md:max-w-2xl md:text-lg"
                >
                  Discover exquisite collections where classic craftsmanship, glossy finishes, and
                  artisan detailing transform every room into a work of art.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-9 flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:mt-11 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={() => navigateProtected("/shop")}
                      className="group relative block w-full overflow-hidden rounded-full border border-[#D4AF37]/50 bg-linear-to-br from-[#D4AF37] via-[#C5A028] to-[#D4AF37] px-7 py-3.5 text-center text-[11px] font-semibold tracking-[0.2em] text-white shadow-[0_8px_36px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_16px_56px_rgba(212,175,55,0.6),0_0_50px_rgba(212,175,55,0.2)] sm:w-auto sm:px-10 sm:py-4 sm:text-xs sm:tracking-[0.24em]"
                    >
                      <span className="relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                        EXPLORE COLLECTION
                      </span>
                      <span className="absolute inset-y-0 -left-[150%] w-[80%] bg-linear-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
                      <span className="absolute inset-x-2 top-[1px] h-[1px] rounded-full bg-linear-to-r from-transparent via-white/50 to-transparent" />
                      <span className="absolute inset-x-4 bottom-[2px] h-px rounded-full bg-linear-to-r from-transparent via-white/15 to-transparent" />
                    </button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <a
                      href="#featured"
                      className="group relative block w-full overflow-hidden rounded-full border border-white/15 bg-white/[0.08] px-7 py-3.5 text-center text-[11px] tracking-[0.18em] text-white/90 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 hover:border-white/30 hover:bg-white/[0.14] hover:shadow-[0_10px_40px_rgba(255,255,255,0.08)] sm:w-auto sm:px-10 sm:py-4 sm:text-xs sm:tracking-[0.22em]"
                    >
                      <span className="relative z-10">VIEW HIGHLIGHTS</span>
                      <span className="absolute inset-y-0 -left-[150%] w-[70%] bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-[450%]" />
                    </a>
                  </motion.div>
                </motion.div>

                {/* Trust indicators — glass capsules with stagger */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 1.15 } },
                  }}
                  className="mt-10 flex items-center gap-3 sm:mt-12 sm:gap-4"
                >
                  {[
                    { value: "500+", label: "Pieces Crafted" },
                    { value: "4.9", label: "Avg Rating" },
                    { value: "24/7", label: "Support" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      whileHover={{ y: -3, scale: 1.03 }}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/20 hover:bg-white/[0.1] sm:rounded-2xl sm:px-5 sm:py-3"
                    >
                      <div className="relative z-10 text-center">
                        <p className="font-serif text-base font-semibold tracking-wide text-[#D4AF37] sm:text-lg">
                          {stat.value}
                        </p>
                        <p className="text-[7px] tracking-[0.15em] text-white/45 sm:text-[8px] sm:tracking-[0.2em]">
                          {stat.label.toUpperCase()}
                        </p>
                      </div>
                      <div className="absolute inset-x-1 top-0 h-[1px] bg-linear-to-r from-transparent via-white/15 to-transparent" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="shrink-0 pb-8 pt-6 sm:pb-10"
              >
                <a
                  href="#featured"
                  className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <span className="text-[8px] tracking-[0.35em] text-white/35 transition-colors group-hover:text-white/60 sm:text-[9px]">
                    DISCOVER MORE
                  </span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-4 w-4 text-[#D4AF37]/60" strokeWidth={1.5} />
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </section>

          <SectionDivider gold />

          {/* ═══════════════ FEATURED PRODUCTS SHOWCASE ═══════════════ */}
          <section id="featured" className="relative bg-[#FAFAF8] mx-auto w-full">
          <div className="mx-auto w-full max-w-[96rem] px-5 py-20 sm:px-8 md:py-36 lg:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={STAGGER_CHILDREN}
              className="mb-12 flex flex-col items-center text-center md:mb-20"
            >
              <motion.p variants={FADE_UP} className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">
                EDITOR&apos;S PICKS
              </motion.p>
              <motion.h2
                variants={FADE_UP}
                className="font-serif tracking-wide text-3xl leading-[1.05] sm:text-4xl md:text-7xl"
              >
                Featured <span className="italic text-[#D4AF37]">Masterpieces</span>
              </motion.h2>
              <motion.p
                variants={FADE_UP}
                className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base"
              >
                A curated selection of our most sought-after designs — where form, finish, and
                function converge.
              </motion.p>
              <motion.div
                variants={FADE_UP}
                className="relative mt-6"
              >
                <div className="h-px w-20 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent sm:w-24" />
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-1 -z-10 rounded-full bg-[#D4AF37]/10 blur-md"
                />
              </motion.div>
            </motion.div>

            <div className="grid gap-5 sm:gap-7 md:grid-cols-3">
              {FEATURED_ITEMS.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 60, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -12, transition: { duration: 0.35, ease: "easeOut" } }}
                  className="glass oil-slick water-sheen group relative overflow-hidden rounded-2xl border border-white/50 shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.15)] sm:rounded-[1.6rem]"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-y-0 -left-[160%] w-[75%] bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-[450%]" />
                    </div>
                    <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[9px] tracking-[0.22em] text-white backdrop-blur-sm">
                      {item.category.toUpperCase()}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                      <h3 className="font-serif tracking-wide text-2xl leading-none text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] sm:text-3xl md:text-[2rem]">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="relative space-y-3 p-4 sm:p-5">
                    <div className="wet-line w-full" />
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="pt-2 text-sm leading-relaxed text-[#2C2C2C]/70"
                    >
                      {item.description}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-2 pt-1 cursor-pointer"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="text-xs font-medium tracking-[0.18em] text-[#D4AF37] transition-colors group-hover:text-[#C9A961]">
                        VIEW DETAILS
                      </span>
                      <span className="inline-block text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="mt-14 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <button
                  onClick={() => navigateProtected("/shop")}
                  className="group relative overflow-hidden rounded-full border border-[#2C2C2C]/15 bg-white/80 px-8 py-3.5 text-xs tracking-[0.22em] text-[#2C2C2C] transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)]"
                >
                  <span className="relative z-10">BROWSE ALL COLLECTIONS</span>
                  <span className="absolute inset-y-0 -left-[150%] w-[65%] bg-linear-to-r from-transparent via-[#D4AF37]/15 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                  <span className="absolute inset-x-2 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
                </button>
              </motion.div>
            </motion.div>
          </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
          <section id="why-us" className="relative w-full bg-[#F5F4F0]">
          <div className="relative mx-auto w-full max-w-[96rem] px-5 py-20 sm:px-8 md:py-32 lg:px-12">
            <div className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[60px]" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={STAGGER_CHILDREN}
              className="mb-12 flex flex-col items-center text-center md:mb-20"
            >
              <motion.p variants={FADE_UP} className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">
                WHY CLASSIC FURNITURE
              </motion.p>
              <motion.h2
                variants={FADE_UP}
                className="font-serif tracking-wide text-3xl leading-[1.05] sm:text-4xl md:text-7xl"
              >
                Built Different. <span className="italic text-[#D4AF37]">Felt Instantly.</span>
              </motion.h2>
              <motion.p
                variants={FADE_UP}
                className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base"
              >
                Three pillars that define every piece we create and every experience we deliver.
              </motion.p>
              <motion.div
                variants={FADE_UP}
                className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent"
              />
            </motion.div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
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
                  initial={{ opacity: 0, y: 50, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  style={{ perspective: 800 }}
                  className="glass-oily oil-slick water-sheen group relative overflow-hidden rounded-2xl border border-white/50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_24px_65px_rgba(0,0,0,0.12)] sm:rounded-[1.6rem] sm:p-7 md:p-8"
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-linear-to-br ${point.accent} blur-xl`}
                  />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-y-0 -left-[160%] w-[70%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-[1000ms] group-hover:translate-x-[450%]" />
                  </div>
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-white/70 shadow-[0_4px_16px_rgba(212,175,55,0.08)]"
                  >
                    <point.icon className="h-5 w-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="relative mb-3 font-serif tracking-wide text-[1.7rem] leading-tight transition-colors duration-300 group-hover:text-[#1A1A1A]">
                    {point.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-[#2C2C2C]/65 transition-colors duration-300 group-hover:text-[#2C2C2C]/80">
                    {point.text}
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="wet-line mt-6 w-full origin-left opacity-60"
                  />
                </motion.article>
              ))}
            </div>
          </div>
          </section>

          <SectionDivider gold />

          {/* ═══════════════ TESTIMONIALS ═══════════════ */}
          <section id="testimonials" className="relative w-full bg-[#FAFAF8]">
          <div className="relative mx-auto w-full max-w-[96rem] px-5 py-20 sm:px-8 md:py-32 lg:px-12">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={STAGGER_CHILDREN}
              className="mb-12 flex flex-col items-center text-center md:mb-20"
            >
              <motion.p variants={FADE_UP} className="mb-3 text-[10px] tracking-[0.32em] text-[#D4AF37]">
                TRUSTED BY CLIENTS
              </motion.p>
              <motion.h2
                variants={FADE_UP}
                className="font-serif tracking-wide text-3xl leading-[1.05] sm:text-4xl md:text-7xl"
              >
                What People Are Saying
              </motion.h2>
              <motion.p
                variants={FADE_UP}
                className="mt-4 max-w-lg text-sm leading-relaxed text-[#2C2C2C]/60 md:text-base"
              >
                Real stories from clients who chose quality, craftsmanship, and an elevated living
                experience.
              </motion.p>
              <motion.div
                variants={FADE_UP}
                className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent"
              />
            </motion.div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item, index) => (
                <motion.blockquote
                  key={item.id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="glass-oily oil-slick water-sheen group relative overflow-hidden rounded-2xl border border-white/50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_24px_65px_rgba(0,0,0,0.12)] sm:rounded-[1.6rem] sm:p-7 md:p-8"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-y-0 -left-[160%] w-[70%] bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-[1000ms] group-hover:translate-x-[450%]" />
                  </div>
                  <div className="relative mb-5">
                    <Quote className="h-8 w-8 text-[#D4AF37]/30" strokeWidth={1.5} />
                  </div>
                  <div className="relative mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.15 + i * 0.06, duration: 0.4, type: "spring", stiffness: 200 }}
                        viewport={{ once: true }}
                      >
                        <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="relative mb-6 text-sm leading-relaxed text-[#2C2C2C]/80 transition-colors duration-300 group-hover:text-[#2C2C2C] md:text-[0.935rem]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="wet-line mb-5 w-full origin-left opacity-50"
                  />
                  <motion.footer
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="relative flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-sm font-medium text-[#D4AF37]"
                    >
                      {item.name.charAt(0)}
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">{item.name}</p>
                      <p className="text-xs tracking-widest text-[#2C2C2C]/50">{item.role}</p>
                    </div>
                  </motion.footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ ABOUT / CTA BANNER ═══════════════ */}
          <section className="relative w-full bg-[#F3F1EC]">
          <div className="relative mx-auto w-full max-w-[96rem] px-5 pb-20 pt-12 sm:px-8 md:pb-36 md:pt-16 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.15 }}
              className="glass-strong oil-slick-animated juicy-glow relative overflow-hidden rounded-2xl border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.09)] sm:rounded-[2.2rem]"
            >
              <div className="animate-oil-sheen pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.25)_38%,rgba(140,200,255,0.08)_48%,transparent_65%)]" />

              <div className="relative z-20 grid md:grid-cols-[1fr_1fr]">
                {/* Left — Image */}
                <motion.div
                  className="group/img relative min-h-56 overflow-hidden sm:min-h-80 md:min-h-120 bg-gray-100"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=75&w=800"
                    alt="Beautifully styled furniture showroom"
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover/img:scale-[1.06]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/30 md:to-white/50" />
                  <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent md:from-transparent" />

                  <div className="absolute bottom-4 left-4 z-10 flex gap-2 sm:bottom-5 sm:left-5 sm:gap-3">
                    {[
                      { value: "500+", label: "PIECES SOLD", color: "text-[#2C2C2C]" },
                      { value: "4.9", label: "AVG RATING", color: "text-[#D4AF37]" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 25, scale: 0.85 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.5 + i * 0.15,
                          type: "spring",
                          stiffness: 100,
                        }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="glass-oily animate-liquid-pulse rounded-lg px-3 py-2 text-center sm:rounded-xl sm:px-4 sm:py-2.5"
                      >
                        <p
                          className={`font-serif tracking-wide text-xl font-semibold sm:text-2xl ${stat.color}`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-[8px] tracking-[0.18em] text-[#2C2C2C]/55 sm:text-[9px] sm:tracking-[0.2em]">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right — Content */}
                <div className="flex flex-col justify-center space-y-5 p-6 sm:space-y-6 sm:p-8 md:p-12 lg:p-16">
                  <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="text-[10px] tracking-[0.32em] text-[#D4AF37]"
                  >
                    ABOUT CLASSIC FURNITURE
                  </motion.p>

                  <motion.h2
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="font-serif tracking-wide text-3xl leading-[0.95] sm:text-4xl md:text-[3.4rem]"
                  >
                    Designed to Shine.
                    <span className="block italic text-[#D4AF37]">Built to Endure.</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="max-w-lg text-sm leading-relaxed text-[#2C2C2C]/68 md:text-base"
                  >
                    We blend contemporary sensibility with timeless craftsmanship. Every collection
                    is curated to create beautiful spaces that feel elevated, warm, and unmistakably
                    yours.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="max-w-lg text-sm leading-relaxed text-[#2C2C2C]/55"
                  >
                    From ethically sourced hardwoods to hand-finished surfaces, our process honors
                    tradition while embracing modern design. This is furniture made to be lived in —
                    and loved.
                  </motion.p>

                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="wet-line w-full origin-left"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center gap-4 pt-2"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                      <button
                        onClick={() => navigateProtected("/shop")}
                        className="group relative overflow-hidden rounded-full border border-[#D4AF37]/50 bg-[#D4AF37] px-8 py-3.5 text-xs font-semibold tracking-[0.22em] text-white shadow-[0_8px_28px_rgba(212,175,55,0.3)] transition-shadow duration-300 hover:shadow-[0_14px_44px_rgba(212,175,55,0.45)]"
                      >
                        <span className="relative z-10">START SHOPPING</span>
                        <span className="absolute inset-y-0 -left-[150%] w-[70%] bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                        <span className="absolute inset-x-2 top-0.5 h-0.5 rounded-full bg-white/40" />
                      </button>
                    </motion.div>

                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <button
                        onClick={() => navigateProtected("/shop")}
                        className="group text-xs tracking-[0.18em] text-[#2C2C2C]/65 transition-colors hover:text-[#2C2C2C]"
                      >
                        BROWSE CATALOG{" "}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          </section>

          <Footer />
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
