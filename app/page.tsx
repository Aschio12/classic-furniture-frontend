"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
    motion,
    AnimatePresence,
    useScroll, 
    useTransform, 
    useSpring, 
    useMotionValue,
} from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useServerStore } from "@/store/useServerStore";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import MainLayout from "@/components/shared/MainLayout";
import Footer from "@/components/shared/Footer";

const FEATURED_ITEMS = [
    {
        id: 1,
        title: "Velvet Sovereign",
        subtitle: "Tactile Opulence",
        image: "https://images.unsplash.com/photo-1567538096635-e94ca81a3cdb?auto=format&fit=crop&q=80&w=1000", 
        description: "Woven comfort."
    },
    {
        id: 2,
        title: "Azure Dreaming",
        subtitle: "Coastal Serenity",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000", 
        description: "Symphony of joinery."
    },
    {
        id: 3,
        title: "Obsidian Echo",
        subtitle: "Midnight Minimalism",
        image: "https://images.unsplash.com/photo-1505693314120-0d443867891e?auto=format&fit=crop&q=80&w=1000", 
        description: "Formidable stone."
    }
];

export default function Home() {
    const { isAuthenticated } = useAuthStore();
    const { isServerWaking } = useServerStore();
    const [mounted, setMounted] = useState(false);
    
    // Eliminate hydration mismatch flash
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // --- Scroll & Parallax ---
    const { scrollY } = useScroll();
    
    // Background Transforms - Remove opacity fade to keep it visible
    const bgScale = useTransform(scrollY, [0, 1000], [1, 1.05]); 
    // const bgOpacity = useTransform(scrollY, [0, 800], [0.8, 0.4]); // Removed fading
    
    // Hero Transforms
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroY = useTransform(scrollY, [0, 400], [0, -50]);

    // Cards Section - NO STAIRS. Subtle unified float.
    const cardsSectionY = useTransform(scrollY, [200, 1000], [50, 0]); 
    
    // --- Mouse Physics (The Shine) ---

    // --- Mouse Physics (The Shine) ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth mouse for background parallax
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Raw mouse for Light Spot (instant reaction)
    const spotX = useMotionValue(0);
    const spotY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Parallax (Centered 0)
        mouseX.set((clientX - innerWidth / 2) / 50); 
        mouseY.set((clientY - innerHeight / 2) / 50);

        // Light Spot (Absolute)
        spotX.set(clientX);
        spotY.set(clientY);
    };

    // Light Spot Gradient (Adapted for Light Theme - Oily Iridescence)
    const spotGradient = useTransform(
        [spotX, spotY],
        (values: number[]) => {
            const [x, y] = values;
            // A larger, multi-stop gradient to mimic oil slick dispersion
            return `radial-gradient(1000px circle at ${x}px ${y}px, 
                rgba(255, 255, 255, 0.8) 0%,
                rgba(240, 240, 255, 0.4) 20%,
                rgba(255, 215, 0, 0.1) 40%,
                transparent 70%)`;
        }
    );

    if (!mounted) {
        return null;
    }

    return (
        <main 
            className="relative w-full bg-[#FAFAFA] text-neutral-900 overflow-x-hidden selection:bg-[#d4af37] selection:text-white"
            onMouseMove={handleMouseMove}
        >
            {/* --- Global Fluid/Oily Overlay --- */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-soft-light opacity-60">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
            </div>

            {/* --- Server Waking Overlay --- */}
            <AnimatePresence>
                {isServerWaking && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
                    >
                        {/* Background Texture */}
                        <div className="absolute inset-0 z-0 opacity-40">
                             <Image
                                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80"
                                alt="Loading Texture"
                                fill
                                className="object-cover blur-xl grayscale opacity-20"
                            />
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-6 p-8 bg-white/40 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl">
                             <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
                             <div className="text-center space-y-2">
                                <h3 className="text-xl font-light tracking-widest uppercase text-neutral-900">System Awakening</h3>
                                <p className="text-sm text-neutral-500 max-w-xs font-mono">
                                    Spinning up secure backend services...
                                    <br />
                                    This may take up to 30 seconds.
                                </p>
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Fixed Cinematic Background (Ultra Sharp & Oily) --- */}
            <div className="fixed inset-0 z-0 overflow-hidden h-screen bg-[#Fdfdfd]">
                <motion.div 
                    className="relative h-full w-full"
                    style={{ 
                        x: springX, 
                        y: springY, 
                        scale: bgScale, 
                    }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop" 
                        alt="Astonishing Luxury Salon"
                        fill
                        priority
                        className="object-cover object-center brightness-105 saturate-[1.1]" 
                        quality={100}
                    />

                    {/* Gradient only at the very top/bottom edges, leaving the center CRYTSTAL CLEAR */}
                    <div className="absolute inset-0 z-1 bg-linear-to-b from-white/10 via-transparent to-white/10" />
                    
                    {/* The "Oily" Shine Overlay - Subtle liquid sheen across the whole surface */}
                    <motion.div 
                        className="absolute inset-0 z-20 mix-blend-soft-light pointer-events-none opacity-30"
                        style={{ background: spotGradient }}
                    />
                </motion.div>
                
                {/* Micro-noise for texture, very faint */}
                <div className="absolute inset-0 z-4 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[#d4af37]" />
            </div>

            <AnimatePresence mode="wait">
                {isAuthenticated ? (
                    <MainLayout>
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-screen bg-[#F9F9FB] p-8 md:p-12"
                        >
                            <div className="max-w-7xl mx-auto space-y-12">
                                <header className="space-y-4 border-b border-black/5 pb-8">
                                    <h1 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900">
                                        The <span className="font-serif italic text-neutral-500">Collection</span>
                                    </h1>
                                    <p className="text-neutral-400 max-w-xl text-lg font-light">
                                        Welcome back. Your curated selection of artisanal pieces awaits.
                                    </p>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Dashboard Placeholders */}
                                    {[1, 2, 3].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group aspect-4/5 bg-white rounded-xl shadow-xs border border-neutral-100 relative overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute inset-0 bg-neutral-100/50 group-hover:bg-neutral-100 transition-colors" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-neutral-400 font-serif italic text-xl">View Piece</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </MainLayout>
                ) : (
                    <motion.section
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full min-h-[200vh]"
                    >
                        {/* --- Floating Navbar --- */}
                        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center text-neutral-900 pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="text-xl md:text-2xl font-bold tracking-[0.2em] font-serif italic uppercase">LuxeCraft</span>
                            </div>
                            
                            <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="relative group overflow-hidden rounded-full px-8 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95">
                                            {/* Base - Clear with hint of oil */}
                                            <div className="absolute inset-0 bg-transparent group-hover:bg-white/50 transition-colors duration-500 rounded-full" />
                                            
                                            {/* Wet Surface Reflection - Top */}
                                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <span className="relative z-10 text-xs md:text-sm font-medium tracking-widest uppercase text-neutral-500 group-hover:text-black transition-colors duration-300">
                                                Login
                                            </span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md w-full border-0 bg-transparent p-0 shadow-none">
                                        <VisuallyHidden>
                                            <DialogTitle>Login</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                                            <div className="relative z-10">
                                                <LoginForm />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="relative group overflow-hidden rounded-full px-8 py-2.5 transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]">
                                            {/* Base - Liquid White */}
                                            <div className="absolute inset-0 bg-white" />
                                            
                                            {/* Oily Iridescence - Subtle */}
                                            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-neutral-100/50 to-transparent opacity-50" />
                                            
                                            {/* Wet Highlight - Top Edge */}
                                            <div className="absolute inset-x-0 top-0 h-[40%] bg-white/90 blur-sm" />
                                            <div className="absolute inset-x-2 top-0.5 h-[2px] bg-white rounded-full opacity-80" />

                                            {/* Bottom depth/shadow for volume */}
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent" />
                                            
                                            {/* Hover: Oil Sheen Animation */}
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-20" />

                                            <span className="relative z-10 text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 group-hover:text-black transition-colors">
                                                Sign Up
                                            </span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md w-full border-0 bg-transparent p-0 shadow-none">
                                        <VisuallyHidden>
                                            <DialogTitle>Register</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                                            <div className="relative z-10">
                                                <RegisterForm />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </nav>

                        {/* --- Hero Section (Minimalist & Oily) --- */}
                        <div className="relative h-screen w-full flex flex-col justify-start pt-32 px-12 md:px-24 pointer-events-none data-[cursor=text]:pointer-events-auto">
                            {/* 
                                STRATEGY: 
                                - Text moved to TOP-LEFT to reveal the center/bottom image.
                                - Realistic, Trustworthy Copy.
                            */}
                            
                            <motion.div 
                                style={{ opacity: heroOpacity, y: heroY }}
                                className="z-20 text-left max-w-4xl space-y-2 pointer-events-auto mix-blend-multiply"
                            >
                                <h1 className="text-[4rem] md:text-[6rem] font-medium leading-[0.9] tracking-tight text-neutral-900 drop-shadow-sm select-none">
                                    <span className="block text-[#1a1a1a]">Authentic</span>
                                    <span className="block text-neutral-600 font-light italic font-serif">Living</span>
                                </h1>
                                
                                <div className="h-1 w-16 bg-neutral-900 mt-6 mb-8" />
                                
                                <p className="text-xl md:text-2xl font-light text-neutral-800 max-w-lg tracking-wide leading-relaxed">
                                    Furniture grounded in heritage. <br/>
                                    <span className="text-neutral-500 text-lg">Designed for real life, built to last generations.</span>
                                </p>
                            </motion.div>

                            {/* NO BOTTOM TEXTS. PURE IMAGE VISIBILITY. */}
                        </div>

                         {/* --- The Three Cards (Unified Float - High Visibility - 3D Tilt) --- */}
                         <div className="relative z-20 min-h-[50vh] flex flex-col items-center justify-center px-6 md:px-12 py-24 overflow-visible bg-linear-to-b from-transparent to-white/90">
                            <motion.div 
                                style={{ y: cardsSectionY }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl w-full perspective-[1000px]"
                            >
                                {FEATURED_ITEMS.map((item, index) => {
                                    return (
                                        <motion.div
                                            key={item.id}
                                            // CREATIVE MOTION: Rotates slightly based on scroll entry + Staggered float
                                            initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
                                            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                                            transition={{ 
                                                duration: 1.2, 
                                                delay: index * 0.15, // Staggered entry
                                                type: "spring", 
                                                stiffness: 50 
                                            }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            
                                            // HOVER: Lifts up and shines
                                            whileHover={{ y: -20, rotateY: index === 0 ? 5 : index === 2 ? -5 : 0 }}
                                            
                                            className="group relative aspect-3/4 w-full bg-white rounded-none overflow-hidden hover:z-30 shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-shadow duration-500 ease-out border border-neutral-100"
                                        >
                                            {/* Oily Shine Effect on Hover - Subtle liquid sweep */}
                                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.6),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                // High saturation, NO BLUR. Clean and crisp.
                                                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 saturate-[1.1]"
                                            />
                                            
                                            {/* Trustworthy Text Overlay - Clean and functional */}
                                            <div className="absolute bottom-0 left-0 p-6 z-10 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent">
                                                <h3 className="text-2xl font-medium tracking-tight text-white drop-shadow-md">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/80 text-xs font-light mt-1 max-w-[90%] line-clamp-2">
                                                    Designed with integrity. {item.subtitle.toLowerCase()}.
                                                </p>
                                                
                                                {/* Hidden CTA that slides up */}
                                                <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 mt-2">
                                                    <span className="text-[10px] uppercase tracking-widest text-neutral-200 border-b border-neutral-400 pb-0.5">View Details</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                         </div>

                        {/* --- Footer (Replaces Auth & Manifesto) --- */}
                        <div className="relative z-50 mt-[-10vh]">
                            <Footer />
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </main>
    );
}

