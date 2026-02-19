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
        title: "The Velvet Sovereign",
        subtitle: "Tactile Opulence",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80",
        description: "A throne of woven comfort designed for the modern monarch, merging classical grandeur with the soft embrace of contemporary living."
    },
    {
        id: 2,
        title: "Azure Dreaming",
        subtitle: "Coastal Serenity",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80",
        description: "Where the sky meets the sea in a symphony of joinery, bringing the calm of the horizon into the heart of your sanctuary."
    },
    {
        id: 3,
        title: "Obsidian Echo",
        subtitle: "Midnight Minimalism",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80",
        description: "The silence of the night captured in formidable stone and steel, standing as a testament to the enduring power of restraint."
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
    
    // Background Transforms
    const bgScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const bgOpacity = useTransform(scrollY, [0, 800], [0.8, 0.2]);
    
    // Hero Transforms
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroY = useTransform(scrollY, [0, 400], [0, -100]);

    // Cards Section Transforms
    const cardsSectionY = useTransform(scrollY, [200, 1200], [100, -50]);
    const card1Y = useTransform(scrollY, [200, 1000], [50, -20]);
    const card2Y = useTransform(scrollY, [200, 1000], [150, -50]);
    const card3Y = useTransform(scrollY, [200, 1000], [250, -80]);

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
        (values: number[]) => {
            const [x, y] = values;
            return `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 40%)`;
        }
    );

    if (!mounted) {
        return null;
    }

    return (
        <main 
            className="relative w-full bg-neutral-950 text-white overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* --- Server Waking Overlay --- */}
            <AnimatePresence>
                {isServerWaking && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                    >
                        {/* Background Texture */}
                        <div className="absolute inset-0 z-0 opacity-40">
                             <Image
                                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80"
                                alt="Loading Texture"
                                fill
                                className="object-cover blur-xl grayscale"
                            />
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
                             <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
                             <div className="text-center space-y-2">
                                <h3 className="text-xl font-light tracking-widest uppercase text-white">System Awakening</h3>
                                <p className="text-sm text-white/50 max-w-xs font-mono">
                                    Spinning up secure backend services...
                                    <br />
                                    This may take up to 30 seconds.
                                </p>
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Fixed Cinematic Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden h-screen bg-black">
                <motion.div 
                    className="relative h-full w-full"
                    style={{ 
                        x: springX, 
                        y: springY, 
                        scale: bgScale,
                        opacity: bgOpacity
                    }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2694&auto=format&fit=crop"
                        alt="Bright Luxury Furniture Salon"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center scale-105"
                        quality={90}
                    />

                    <div className="absolute inset-0 z-1 bg-black/20" /> 
                    <div className="absolute inset-0 z-2 bg-linear-to-b from-transparent via-transparent to-black/80" />
                    
                    {/* The "Oily" Shine Overlay - Ultra Enhanced for Brightness */}
                    <motion.div 
                        className="absolute inset-0 z-20 mix-blend-soft-light pointer-events-none opacity-80"
                        style={{ background: spotGradient }}
                    />
                </motion.div>
                
                {/* Oily Noise Texture - Golden Hue */}
                <div className="absolute inset-0 z-4 pointer-events-none opacity-[0.1] mix-blend-overlay bg-[#d4af37]" />
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
                        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="text-xl md:text-2xl font-bold tracking-[0.2em] font-serif italic uppercase">LuxeCraft</span>
                            </div>
                            
                            <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#d4af37] transition-colors relative group">
                                            Login
                                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-neutral-900/90 border-neutral-800 text-white backdrop-blur-xl">
                                        <VisuallyHidden>
                                            <DialogTitle>Login</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="p-6">
                                            <h2 className="text-2xl font-light mb-2 text-white">Welcome Back</h2>
                                            <p className="text-white/50 text-sm mb-6">Enter your credentials to access the collection.</p>
                                            <LoginForm />
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-xs md:text-sm font-medium tracking-widest uppercase border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 backdrop-blur-sm relative overflow-hidden group/signup">
                                            <span className="relative z-10">Sign Up</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/signup:animate-shine" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-neutral-900/90 border-neutral-800 text-white backdrop-blur-xl">
                                        <VisuallyHidden>
                                            <DialogTitle>Register</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="p-6">
                                            <h2 className="text-2xl font-light mb-2 text-white">Join the Registry</h2>
                                            <p className="text-white/50 text-sm mb-6">Create an account to view the full collection.</p>
                                            <RegisterForm />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </nav>

                        {/* --- Hero Section --- */}
                        <div className="relative h-screen flex flex-col items-center justify-center px-6">
                            <motion.div 
                                style={{ opacity: heroOpacity, y: heroY }}
                                className="flex flex-col items-center text-center space-y-6 z-20 mix-blend-overlay"
                            >
                                <h1 className="text-5xl md:text-8xl font-thin tracking-tighter text-white drop-shadow-2xl opacity-90">
                                    <span className="block font-serif italic bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">Luminous</span>
                                    <span className="block font-light mt-[-0.2em] uppercase tracking-[0.2em] text-white/80">Living</span>
                                </h1>
                                
                                <p className="text-sm md:text-lg font-light tracking-[0.3em] text-[#d4af37] uppercase opacity-80">
                                    Curated . Timeless . Radiant
                                </p>
                            </motion.div>

                            <motion.div
                                    animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute bottom-12 z-20"
                            >
                                <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Scroll to Explore</p>
                            </motion.div>
                        </div>

                         {/* --- The Three Cards (Compact & Stylish) --- */}
                         <div className="relative z-20 min-h-[40vh] flex flex-col items-center justify-center px-6 py-16 overflow-visible">
                            <motion.div 
                                style={{ y: cardsSectionY }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full"
                            >
                                {FEATURED_ITEMS.map((item, index) => {
                                    const yTransform = index === 0 ? card1Y : index === 1 ? card2Y : card3Y;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            style={{ y: yTransform }}
                                            className="group relative h-100 w-full bg-neutral-900 rounded-lg overflow-hidden transition-all duration-700 hover:z-30 hover:scale-105 shadow-2xl border border-white/10"
                                        >
                                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)] mix-blend-overlay" />
                                            
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                                            />
                                            {/* Stronger gradient overlay for text readability */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10 w-full">
                                                <h3 className="text-2xl font-serif italic text-white mb-2 drop-shadow-lg">{item.title}</h3>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-4 drop-shadow-md">{item.subtitle}</p>
                                                <div className="h-px w-8 group-hover:w-full bg-white/50 transition-all duration-700 delay-100 mb-4" />
                                                <p className="text-white/90 font-light text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 drop-shadow-md">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                         </div>

                        {/* --- Footer (Replaces Auth & Manifesto) --- */}
                        <div className="relative z-50">
                            <Footer />
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </main>
    );
}

