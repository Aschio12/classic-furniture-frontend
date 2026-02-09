"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
    motion, 
    useScroll, 
    useTransform, 
    useSpring, 
    useMotionValue,
} from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useServerStore } from "@/store/useServerStore";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ServerStatus from "@/components/shared/ServerStatus";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PageTransition from "@/components/shared/PageTransition";

export default function Home() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuthStore();
    const { isServerWaking } = useServerStore();
    const [mounted, setMounted] = useState(false);
    // const [isRedirecting, setIsRedirecting] = useState(false); // No longer auto-redirecting
    
    // --- Scroll & Parallax ---
    const { scrollY } = useScroll();
    
    // Background Transforms (Desaturate & Blur on scroll)
    const bgFilter = useTransform(scrollY, [0, 800], ["saturate(1.4) blur(0px)", "saturate(0) blur(10px)"]);
    const bgScale = useTransform(scrollY, [0, 800], [1, 1.1]);
    const bgOpacity = useTransform(scrollY, [0, 800], [0.8, 0.4]);

    // Hero Text Transforms (Fade out)
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroY = useTransform(scrollY, [0, 400], [0, -100]);

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

    // Light Spot Gradient
    const spotGradient = useTransform(
        [spotX, spotY],
        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 40%)`
    );

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // Removed Auto-Redirect Effect to allow users to land on the home page first
    
    if (!mounted) return null;

    return (
        <main 
            className="relative w-full bg-neutral-950 text-white overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* PageTransition removed as we are not redirecting automatically */ }
            <ServerStatus />

            {/* --- Server Waking Overlay --- */}
            {isServerWaking && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
                >
                    {/* Background Texture */}
                    <div className="absolute inset-0 z-0 opacity-40">
                         <Image
                            src="https://images.unsplash.com/photo-1600607687652-9b927df4563e?q=80&w=2670&auto=format&fit=crop"
                            alt="Loading Details"
                            fill
                            className="object-cover blur-xl grayscale"
                        />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <Loader2 className="h-16 w-16 animate-spin text-[#d4af37]" />
                        <div className="text-center space-y-2">
                             <h2 className="text-2xl font-serif text-white tracking-widest">LUXECRAFT</h2>
                             <p className="text-[#d4af37] text-sm uppercase tracking-[0.2em] animate-pulse">
                                Preparing the Showroom... The server is waking up.
                             </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- Global Light Spot (Specular Highlight) --- */}
            <div className="fixed inset-0 z-60 pointer-events-none mix-blend-overlay">
                <motion.div 
                    className="absolute inset-0"
                    style={{ background: spotGradient }}
                />
            </div>

            {/* --- Fixed Cinematic Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden h-screen">
                <motion.div 
                    className="relative h-full w-full"
                    style={{ 
                        x: springX, 
                        y: springY, 
                        scale: bgScale,
                        opacity: bgOpacity,
                        filter: bgFilter
                    }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1600607687652-9b927df4563e?q=80&w=2670&auto=format&fit=crop"
                        alt="Classic Furniture Salon"
                        fill
                        className="object-cover"
                        priority
                    />
                    
                    {/* Cinematic overlays */}
                    <div className="absolute inset-0 z-1 bg-linear-to-b from-black/40 via-transparent to-black/90 mix-blend-multiply" />
                    <div className="absolute inset-0 z-2 bg-neutral-900/10 mix-blend-overlay" />
                </motion.div>
                
                {/* Oily Noise */}
                <div className="absolute inset-0 z-3 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* ================= SECTION 1: HERO ================= */}
            <section className="relative z-10 flex h-screen w-full flex-col items-center justify-center pt-20">
                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="flex flex-col items-center text-center space-y-8 px-4"
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-tight text-white drop-shadow-2xl">
                        LUXECRAFT
                    </h1>
                    <div className="space-y-4">
                        <p className="text-xl md:text-2xl font-light tracking-widest text-white/90 uppercase">
                            Where Luxury Furniture Meets 
                        </p>
                        <p className="text-xl md:text-2xl font-semibold tracking-widest text-[#d4af37] uppercase">
                            Institutional Security
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    style={{ opacity: heroOpacity }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Explore The Platform</span>
                    <ChevronDown className="h-6 w-6 text-white/50" />
                </motion.div>
            </section>

            {/* ================= SECTION 2: CURATED GALLERY ================= */}
            <section className="relative z-10 min-h-screen py-20 px-6 bg-transparent">
                <div className="mx-auto max-w-7xl">
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                     >
                        <h2 className="text-3xl md:text-5xl font-serif text-white">Curated Gallery</h2>
                        <p className="text-white/60 tracking-widest text-sm uppercase">A Glimpse of the Collection</p>
                     </motion.div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <GalleryItem 
                            img="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop"
                            title="The Royal Sofa"
                            category="Living Room"
                            delay={0.1}
                        />
                        <GalleryItem 
                            img="https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2000&auto=format&fit=crop"
                            title="Empire Dining"
                            category="Dining Hall"
                            delay={0.3}
                            className="md:translate-y-12" // Stagger layout
                        />
                        <GalleryItem 
                            img="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2000&auto=format&fit=crop"
                            title="Serenity Suite"
                            category="Bedroom"
                            delay={0.5}
                        />
                     </div>
                </div>
            </section>

            {/* ================= SECTION 3: AUTH (ACCESS PANEL) ================= */}
            <section className="relative z-10 py-32 flex flex-col items-center justify-end min-h-[50vh]">
                
                 {/* Glass Panel */}
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_-5px_rgba(255,255,255,0.1)] p-1"
                 >
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-between p-8 gap-8">
                        <div className="text-left space-y-2">
                             <h2 className="text-2xl font-serif text-white">The Collection Access</h2>
                             <p className="text-white/50 text-xs tracking-[0.2em] uppercase">Members Only • Secure Gateway</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <button 
                                    onClick={() => router.push('/shop')}
                                    className="px-6 py-3 text-sm font-bold tracking-widest text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors uppercase"
                                >
                                    Enter Showroom
                                </button>
                            ) : (
                                <>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="px-6 py-3 text-sm font-bold tracking-widest text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors uppercase">
                                                Log In
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="border-neutral-800 bg-white/10 backdrop-blur-3xl text-white sm:rounded-2xl">
                                            <VisuallyHidden>
                                                <DialogTitle>Log In</DialogTitle>
                                            </VisuallyHidden>
                                            <LoginForm />
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="px-6 py-3 text-sm font-medium tracking-widest text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors uppercase">
                                                Sign Up
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="border-neutral-800 bg-white/10 backdrop-blur-3xl text-white sm:rounded-2xl">
                                            <VisuallyHidden>
                                                <DialogTitle>Create Account</DialogTitle>
                                            </VisuallyHidden>
                                            <RegisterForm />
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </div>
                    </div>
                 </motion.div>
                 
                 <div className="mt-12 text-white/20 text-[10px] tracking-widest uppercase">
                    Classic Furniture © {new Date().getFullYear()} • Secure Escrow System
                 </div>
            </section>
        </main>
    );
}


// Sub-Component for Gallery
function GalleryItem({ img, title, category, delay, className = "" }: { img: string, title: string, category: string, delay: number, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={`group relative h-125 w-full overflow-hidden rounded-md border border-white/10 ${className}`}
        >
            {/* Image Layer */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Image 
                    src={img} 
                    alt={title} 
                    fill
                    className="object-cover"
                />
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />

            {/* Content Layer (Floats up on hover) */}
            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">{category}</p>
                <h3 className="text-2xl font-serif text-white">{title}</h3>
                <div className="mt-4 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
            </div>
        </motion.div>
    );
}
