"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Ensure Link is imported
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // --- Interaction Physics ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for 'viscous' liquid feel
  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // We strictly use clientX/Y for viewport-relative positioning of fixed overlay elements
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect logic in effect to avoid render looping
  useEffect(() => {
      if (user && !authLoading) {
         // Add small delay to allow animation to start if needed, 
         // but strictly we just want to push them away.
         const timer = setTimeout(() => {
            if (user.role === 'hub_manager') router.push('/dashboard/hub-manager');
            else if (user.role === 'admin') router.push('/admin');
            else router.push('/shop');
         }, 1500); // Wait for dissolve animation
         return () => clearTimeout(timer);
      }
  }, [user, authLoading, router]);

  if (!mounted) return null;

  const isAuthenticatedRedirect = !!user;

  return (
    <main 
      className="relative h-screen w-full overflow-hidden bg-neutral-100"
      onMouseMove={handleMouseMove}
    >
        {/* --- Background Image --- */}
        <motion.div
            initial={{ scale: 1.05 }}
            animate={{ 
                scale: 1.08,
                x: isAuthenticatedRedirect ? [0, 50] : 0, // Drift on exit
                filter: isAuthenticatedRedirect ? "blur(20px) brightness(1.5)" : "blur(0px) brightness(1)",
            }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 z-0"
        >
             {/* New High-End Sun Drenched Salon Image */}
             <Image
                src="https://images.unsplash.com/photo-1600607687652-9b927df4563e?q=80&w=2670&auto=format&fit=crop"
                alt="Sun Drenched Salon"
                fill
                className="object-cover"
                priority
             />
        </motion.div>

        {/* --- The 'Oily Shine' Overlay --- */}
        <div 
            className="absolute inset-0 z-10"
            style={{
                // Contrast/Saturate for deep oily colors, Brightness for sunny feel
                backdropFilter: "contrast(110%) brightness(110%) saturate(120%)",
                background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))"
            }}
        />

        {/* --- Specular Highlight (Mouse Tracking) --- */}
        <motion.div
            className="pointer-events-none absolute z-20 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 mix-blend-overlay"
            style={{
                left: smoothX,
                top: smoothY,
                background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 40%, transparent 60%)",
                filter: "blur(60px)",
            }}
        />

        {/* --- Content Interaction Layer --- */}
        <div className="relative z-30 flex h-full w-full items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {isAuthenticatedRedirect ? (
                    // --- Auhenticated: Smooth Dissolve ---
                    <motion.div
                        key="auth-dissolve"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <motion.h1 
                            className="text-6xl font-thin tracking-widest text-white mix-blend-difference md:text-8xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            WELCOME
                        </motion.h1>
                        <motion.p
                            className="mt-4 text-xl font-light tracking-[0.2em] text-white/80"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            Entering Sanctuary...
                        </motion.p>
                    </motion.div>
                ) : (
                   // --- Not Authenticated: Glassmorphism Pane ---
                   <motion.div
                        key="glass-pane"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 p-12 backdrop-blur-xl shadow-2xl"
                        style={{
                            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3)"
                        }}
                   >
                        {/* Internal Reflection Effect */}
                        <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent opacity-50 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
                            <div>
                                <h1 className="font-serif text-4xl text-neutral-900 tracking-wide">LUXECRAFT</h1>
                                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-neutral-800/70">
                                    The Art of Living
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-4 min-w-[300px]">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="group relative w-full overflow-hidden rounded-xl bg-neutral-900 px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                            <span className="relative z-10">Sign In</span>
                                            {/* Metallic Sheen on Hover */}
                                            <div className="absolute inset-0 -translate-x-full animate-[shine_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="border-0 bg-transparent p-0 shadow-none">
                                        <LoginForm />
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="group relative w-full overflow-hidden rounded-xl border border-neutral-800/20 bg-white/40 px-8 py-4 text-sm font-medium uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white">
                                            <span className="relative z-10">Register</span>
                                             {/* Metallic Sheen on Hover */}
                                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-out] bg-linear-to-r from-transparent via-white/40 to-transparent" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="border-0 bg-transparent p-0 shadow-none">
                                        <RegisterForm />
                                    </DialogContent>
                                </Dialog>

                                <div className="mt-4 h-px w-full bg-neutral-900/10" />
                                
                                <Link 
                                    href="/shop"
                                    className="text-xs font-semibold tracking-widest text-neutral-700 transition-colors hover:text-neutral-900"
                                >
                                    CONTINUE AS GUEST
                                </Link>
                            </div>
                        </div>
                   </motion.div>
                )}
            </AnimatePresence>
        </div>
    </main>
  );
}
