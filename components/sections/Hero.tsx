"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

export default function Hero() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // --- Interactive 'Liquid Light' Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement for a 'viscous/oily' feel
  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 }; // Slightly heavy/smooth
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // We want coordinates relative to window or center, 
    // but straight clientX/Y works for fixed overlay tracking
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  // Handle mounting state to prevent hydration mismatches
  useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch for auth state
  if (!mounted) return null;

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
    >
      {/* 
        Background Image with 'Slow-Pan' effect.
      */}
      <motion.div
        initial={{ scale: 1.1, x: "0%" }}
        animate={{ scale: 1.15, x: "-5%" }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror"
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2670&auto=format&fit=crop"
          alt="Luxury Salon Furniture Morning"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* The 'Oily' Effect Overlay - Adjusted for Glossy/Wet Morning Vibe */}
      <div 
        className="absolute inset-0 z-10 bg-linear-to-r from-neutral-50/60 via-white/5 to-transparent"
        style={{
             backdropFilter: "saturate(1.4) contrast(1.1) brightness(1.05)"
        }}
      />
      
      {/* Subtle Golden Morning Shine Fixed Layer */}
      <div 
        className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,245,230,0.3)_0%,transparent_60%)] mix-blend-overlay"
      />

       {/* Interactive 'Liquid Light' Cursor Follower 
           Creates a localized spot of high saturation/brightness where the user looks
       */}
      <motion.div
        className="pointer-events-none absolute z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-overlay"
        style={{
            left: smoothX,
            top: smoothY,
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
            filter: "blur(40px)",
        }}
      />
      
      {/* Film Grain Texture -> Adds 'Cinematic/Analog' expensive feel */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
           style={{
               backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')",
           }}
      />

      {/* Floating Dust Particles - Subtle Morning Atmosphere */}
      {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute z-10 rounded-full bg-white/40 blur-[1px]"
            initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%", 
                scale: Math.random() * 0.5 + 0.5 
            }}
            animate={{ 
                y: [0, -100, 0], 
                x: [0, 50, 0],
                opacity: [0, 0.8, 0] 
            }}
            transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 4 + 2 + "px",
            }}
          />
      ))}

      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-start pb-10 md:pb-0 md:pl-20">
        {!user ? (
          // --- LUXURY INTRO SECTION (Non-Logged In) ---
          <div className="flex w-full max-w-4xl flex-col items-start justify-center px-4 text-left md:px-0">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="font-serif text-5xl font-thin tracking-widest text-neutral-900 md:text-7xl lg:text-8xl"
            >
              Elevate <br /> Your Space
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="mt-8 max-w-lg text-lg font-light tracking-wide text-neutral-800 md:text-xl"
            >
              Secure Furniture Trade with Escrow Protection. <br/>
              Experience the art of living with our curated salon collection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-10"
            >
               <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-neutral-900 bg-transparent px-10 py-4 text-sm font-medium uppercase tracking-widest text-neutral-900 transition-all duration-500 hover:bg-neutral-900 hover:text-white"
              >
                <span className="relative z-10">View Collection</span>
                 <div className="absolute inset-0 -translate-x-full animate-[shine_3s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </motion.div>
          </div>
        ) : (
          // --- EXISTING HERO CONTENT (Logged In) ---
          <div className="max-w-4xl px-4 text-left md:px-0">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="text-5xl font-thin tracking-[0.2em] text-neutral-900 md:text-7xl lg:text-8xl"
            >
                S A L O N
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-6 text-lg font-light tracking-wide text-neutral-800 md:text-xl"
            >
              Minimalist Luxury & Timeless Form.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-12"
            >
               <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-neutral-900 bg-transparent px-10 py-4 text-sm font-medium uppercase tracking-widest text-neutral-900 backdrop-blur-sm transition-all duration-500 hover:bg-neutral-900 hover:text-white"
              >
                <span className="relative z-10">Discover Collection</span>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}


