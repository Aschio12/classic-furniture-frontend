"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

// Pre-generated bubble configs (outside component for React 19 strict mode)
const BUBBLE_CONFIGS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${15 + i * 15}%`,
  initialScale: 0.5 + Math.random() * 0.5,
  scaleKeyframes: [0.5 + Math.random() * 0.5, 1 + Math.random() * 0.3, 0.7],
  duration: 15 + Math.random() * 10,
  width: 40 + Math.random() * 80,
  height: 40 + Math.random() * 80,
}));

export default function Hero() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // --- Interactive 'Liquid Spotlight' Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-smooth viscous movement
  const springConfig = { damping: 30, stiffness: 80, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 
        Ultra HQ Background - Stunning luxury furniture 
      */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.14 }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=100&w=3200&auto=format&fit=crop"
          alt="Luxury Modern Furniture Interior Design"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </motion.div>

      {/* Deep vignette for dramatic focus */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.28)_55%,rgba(0,0,0,0.62)_100%)]" />

      {/* Oily Glass Gradient Layer 1 - Warm Gold Sweep */}
      <motion.div 
        className="absolute inset-0 z-[2] opacity-70"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, transparent 38%, rgba(255,240,200,0.16) 70%, rgba(255,255,255,0.08) 100%)",
            "linear-gradient(145deg, rgba(255,240,200,0.12) 0%, transparent 30%, rgba(212,175,55,0.22) 65%, rgba(255,255,255,0.06) 100%)",
            "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, transparent 38%, rgba(255,240,200,0.16) 70%, rgba(255,255,255,0.08) 100%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glossy Wet Sheen Layer - Animated Prismatic Sweep */}
      <motion.div 
        className="absolute inset-0 z-[3]"
        animate={{
          background: [
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.48) 22%, rgba(212,175,55,0.35) 34%, rgba(255,255,255,0.42) 46%, transparent 67%)",
            "linear-gradient(120deg, transparent 33%, rgba(255,255,255,0.48) 53%, rgba(212,175,55,0.35) 65%, rgba(255,255,255,0.42) 77%, transparent 100%)",
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.48) 22%, rgba(212,175,55,0.35) 34%, rgba(255,255,255,0.42) 46%, transparent 67%)",
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ mixBlendMode: "screen" }}
      />

      {/* Metallic Glass Panels - Juicy Reflective Surfaces */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* Top left metallic panel */}
        <motion.div
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(255,255,255,0.15) 40%, transparent 70%)",
            filter: "blur(42px)",
            mixBlendMode: "screen"
          }}
        />

        {/* Center prismatic orb */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            background: "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.15), rgba(255,255,255,0.2), rgba(212,175,55,0.1), transparent)",
            filter: "blur(52px)",
            opacity: 0.62
          }}
        />

        {/* Bottom right warm glow */}
        <motion.div
          className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(255,230,180,0.3) 0%, rgba(212,175,55,0.2) 35%, transparent 65%)",
            filter: "blur(45px)",
            mixBlendMode: "screen"
          }}
        />
      </div>

      {/* Interactive Liquid Spotlight - Follows Cursor */}
      <motion.div
        className="pointer-events-none absolute z-[5] h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
            left: smoothX,
            top: smoothY,
            background: "radial-gradient(circle, rgba(255,255,255,0.62) 0%, rgba(212,175,55,0.36) 24%, rgba(255,255,255,0.18) 44%, transparent 68%)",
            filter: "blur(42px)",
            mixBlendMode: "screen",
            opacity: 0.72
        }}
      />

      {/* Wet Glass Reflections - Sharp Highlight Lines */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        <motion.div 
          className="absolute left-0 right-0 top-[35%] h-[2px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 30%, rgba(212,175,55,0.4) 50%, rgba(255,255,255,0.6) 70%, transparent 100%)",
            boxShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(212,175,55,0.3)"
          }}
        />
        
        <motion.div 
          className="absolute left-0 right-0 top-[65%] h-[1.5px]"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [0.7, 0.95, 0.7],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 35%, rgba(212,175,55,0.3) 50%, rgba(255,255,255,0.4) 65%, transparent 100%)",
            boxShadow: "0 0 15px rgba(255,255,255,0.3)"
          }}
        />
      </div>

      {/* Floating Liquid Bubbles */}
      {BUBBLE_CONFIGS.map((config) => (
        <motion.div
          key={config.id}
          className="absolute z-[4] rounded-full pointer-events-none"
          initial={{
            left: config.left,
            bottom: "-10%",
            scale: config.initialScale,
          }}
          animate={{
            bottom: "110%",
            opacity: [0, 0.6, 0.8, 0.4, 0],
            scale: config.scaleKeyframes,
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            delay: config.id * 2,
            ease: "easeInOut"
          }}
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(212,175,55,0.42), transparent)",
            filter: "blur(8px)",
            mixBlendMode: "screen"
          }}
        />
      ))}

      {/* Cinematic Film Grain */}
      <div 
        className="absolute inset-0 z-[7] opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          backgroundSize: "200px 200px"
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[8]"
        animate={{
          background: [
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.2) 18%, rgba(212,175,55,0.26) 32%, transparent 52%)",
            "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.22) 50%, rgba(212,175,55,0.28) 64%, transparent 84%)",
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.2) 18%, rgba(212,175,55,0.26) 32%, transparent 52%)",
          ]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ mixBlendMode: "screen", opacity: 0.52 }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex h-full items-center justify-start px-4 md:px-12 lg:px-20">
        {!user ? (
          // --- LUXURY INTRO (Non-Logged In) ---
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="flex w-full max-w-3xl flex-col items-start justify-center text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.3)]"
            >
              <Sparkles className="h-4 w-4 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              <span className="text-[10px] font-medium tracking-[0.3em] text-white/90">
                HANDCRAFTED EXCELLENCE
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -40 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="font-serif text-5xl font-light leading-[1.05] tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] md:text-7xl lg:text-8xl"
            >
              Elevate Every
              <br />
              <span className="italic text-[#D4AF37] drop-shadow-[0_4px_20px_rgba(212,175,55,0.6)]">
                Living Moment
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="mt-8 max-w-xl text-base font-light leading-relaxed tracking-wide text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-lg"
            >
              Experience furniture that transcends function — where artisan craftsmanship,
              premium materials, and timeless design create spaces worth living in.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.6 }}
              className="mt-12 flex flex-wrap gap-4"
            >
               <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_8px_32px_rgba(212,175,55,0.5),0_0_20px_rgba(212,175,55,0.3),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_48px_rgba(212,175,55,0.65),0_0_40px_rgba(212,175,55,0.4)]"
              >
                <span className="relative z-10">Explore Collection</span>
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                      "linear-gradient(120deg, transparent 100%, rgba(255,255,255,0.4) 150%, transparent 200%)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              </Link>

              <Link
                href="#featured"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-xl shadow-[0_4px_24px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-500 hover:bg-white/25 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10">View Highlights</span>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          // --- LOGGED IN HERO ---
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="max-w-3xl text-left"
          >
            <h1 className="font-serif text-6xl font-light tracking-[0.15em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] md:text-8xl lg:text-9xl">
              S A L O N
            </h1>
            
            <p className="mt-6 text-lg font-light tracking-wide text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-xl">
              Minimalist Luxury. Timeless Form.
            </p>
            
            <div className="mt-12 flex gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border-2 border-white bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-neutral-900 shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-500 hover:scale-105"
              >
                Browse Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}


