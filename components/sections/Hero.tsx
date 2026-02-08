"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

export default function Hero() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to prevent hydration mismatches
  useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch for auth state
  if (!mounted) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
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
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2670&auto=format&fit=crop"
          alt="Bright Morning Salon"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* The 'Oily' Effect Overlay - Adjusted for Morning Vibe */}
      <div 
        className="absolute inset-0 z-10 bg-linear-to-br from-white/60 via-white/20 to-transparent" 
        style={{
             backdropFilter: "brightness(1.1) saturate(1.2)"
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-center">
        {!user ? (
          // --- LUXURY INTRO SECTION (Non-Logged In) ---
          <div className="flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center md:px-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="font-serif text-6xl font-thin tracking-widest text-neutral-900 md:text-8xl lg:text-9xl"
            >
              Elevate Your Space
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="mt-8 text-xl font-light tracking-wide text-neutral-800 md:text-2xl"
            >
              Secure Furniture Trade with Escrow Protection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-12"
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
          <div className="max-w-4xl px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="text-5xl font-thin tracking-[0.2em] text-neutral-900 md:text-7xl lg:text-8xl"
            >
                S A L O N
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-6 text-lg font-light tracking-wide text-neutral-600 md:text-xl"
            >
              Minimalist Luxury & Timeless Form
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-12"
            >
               <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden border border-neutral-900 bg-transparent px-10 py-4 text-sm font-medium uppercase tracking-widest text-neutral-900 backdrop-blur-sm transition-all duration-500 hover:bg-neutral-900 hover:text-white"
                // Add shine here too for consistency? Or keep it simple
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


