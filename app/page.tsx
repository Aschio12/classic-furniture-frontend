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
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
        description: "A throne of woven comfort designed for the modern monarch, merging classical grandeur with the soft embrace of contemporary living."
    },
    {
        id: 2,
        title: "Azure Dreaming",
        subtitle: "Coastal Serenity",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2564&auto=format&fit=crop",
        description: "Where the sky meets the sea in a symphony of joinery, bringing the calm of the horizon into the heart of your sanctuary."
    },
    {
        id: 3,
        title: "Obsidian Echo",
        subtitle: "Midnight Minimalism",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2694&auto=format&fit=crop",
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
    
    // Background Transforms - More subtle movement for stability
    const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
    const bgOpacity = useTransform(scrollY, [0, 800], [0.8, 0.4]);
    
    // Hero Transforms
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroY = useTransform(scrollY, [0, 400], [0, -50]);
    const textY = useTransform(scrollY, [0, 300], [0, 100]); // Parallax for text
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Cards Section Transforms - Adjusted so they settle perfectly aligned
    // The previous values [100, 0], [150, 0], [200, 0] ensure they land at 0 relative.
    const cardsSectionY = useTransform(scrollY, [200, 1000], [50, 0]); 
    // Staggered entry, but synchronized landing
    const card1Y = useTransform(scrollY, [200, 1000], [100, 0]);
    const card2Y = useTransform(scrollY, [200, 1000], [200, 0]);
    const card3Y = useTransform(scrollY, [200, 1000], [300, 0]);

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

    // Light Spot Gradient (Adapted for Light Theme - subtle iridescence)
    const spotGradient = useTransform(
        [spotX, spotY],
        (values: number[]) => {
            const [x, y] = values;
            return `radial-gradient(800px circle at ${x}px ${y}px, rgba(255,215,0,0.15), transparent 50%)`;
        }
    );

    if (!mounted) {
        return null;
    }

    return (
        <main 
            className="relative w-full bg-[#FAFAFA] text-neutral-900 overflow-x-hidden"
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

            {/* --- Fixed Cinematic Background (Bright & Oily) --- */}
            <div className="fixed inset-0 z-0 overflow-hidden h-screen bg-[#F0F0F0]">
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
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop"
                        alt="Astonishing Luxury Salon"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center scale-105 saturate-[1.1] contrast-[1.1]"
                        quality={100}
                    />

                    {/* Gradient overlay for text readability - More subtle now to let image shine */}
                    <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/90" />
                    
                    {/* The "Oily" Shine Overlay - Enhanced specifically for the "Oily" vibe */}
                    <motion.div 
                        className="absolute inset-0 z-20 mix-blend-soft-light pointer-events-none opacity-40"
                        style={{ background: spotGradient }}
                    />
                </motion.div>
                
                {/* Oily Noise Texture - Golden Hue for warmth */}
                <div className="absolute inset-0 z-4 pointer-events-none opacity-[0.08] mix-blend-multiply bg-[#d4af37]" />
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
                                        <button className="text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#d4af37] transition-colors relative group">
                                            Login
                                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white/90 border-neutral-200 text-neutral-900 backdrop-blur-xl shadow-2xl">
                                        <VisuallyHidden>
                                            <DialogTitle>Login</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="p-6">
                                            <h2 className="text-2xl font-light mb-2 text-neutral-900">Welcome Back</h2>
                                            <p className="text-neutral-500 text-sm mb-6">Enter your credentials to access the collection.</p>
                                            <LoginForm />
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-xs md:text-sm font-medium tracking-widest uppercase border border-neutral-300 px-6 py-2 rounded-full hover:bg-neutral-900 hover:text-white hover:shadow-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group/signup">
                                            <span className="relative z-10">Sign Up</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/signup:animate-shine" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white/90 border-neutral-200 text-neutral-900 backdrop-blur-xl shadow-2xl">
                                        <VisuallyHidden>
                                            <DialogTitle>Register</DialogTitle>
                                        </VisuallyHidden>
                                        <div className="p-6">
                                            <h2 className="text-2xl font-light mb-2 text-neutral-900">Join the Registry</h2>
                                            <p className="text-neutral-500 text-sm mb-6">Create an account to view the full collection.</p>
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
                                className="flex flex-col items-center text-center space-y-8 z-20 max-w-5xl"
                            >
                                <h1 className="text-6xl md:text-9xl font-thin tracking-tighter text-neutral-900 drop-shadow-2xl opacity-90 leading-none">
                                    <span className="block font-serif italic bg-clip-text text-transparent bg-linear-to-b from-neutral-800 to-neutral-500 drop-shadow-sm">Impeccable</span>
                                    <span className="block font-light mt-[-0.1em] uppercase tracking-[0.15em] text-neutral-900 drop-shadow-md">Refinement</span>
                                </h1>
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="space-y-6 flex flex-col items-center"
                                >
                                    <p className="text-xl md:text-3xl font-light text-neutral-800 leading-relaxed font-serif italic drop-shadow-md max-w-3xl">
                                        "A sanctuary of glass, gold, and silence. Furniture that reflects the soul of the avant-garde."
                                    </p>
                                    
                                    <div className="h-px w-24 bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />
                                    
                                    <div className="grid grid-cols-3 gap-8 text-center pt-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Design</span>
                                            <span className="text-lg font-serif italic text-neutral-800">Italian</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Material</span>
                                            <span className="text-lg font-serif italic text-neutral-800">Bespoke</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Edition</span>
                                            <span className="text-lg font-serif italic text-neutral-800">Limited</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                    animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute bottom-12 z-20"
                            >
                                <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold mix-blend-multiply">Scroll to Reveal</p>
                            </motion.div>
                        </div>

                         {/* --- The Three Cards (Compact & Stylish - Light Mode) --- */}
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
                                            className="group relative h-100 w-full bg-white rounded-lg overflow-hidden transition-all duration-700 hover:z-30 hover:scale-105 shadow-xl hover:shadow-2xl border border-neutral-100"
                                        >
                                            {/* Oily Shine Effect on Hover */}
                                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.15),transparent_60%)] mix-blend-overlay" />
                                            
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700"
                                            />
                                            {/* White Gradient Overlay for Dark Text Readability */}
                                            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10 w-full">
                                                <h3 className="text-2xl font-serif italic text-neutral-900 mb-2 drop-shadow-sm">{item.title}</h3>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-4 font-bold">{item.subtitle}</p>
                                                <div className="h-px w-8 group-hover:w-full bg-neutral-300 transition-all duration-700 delay-100 mb-4" />
                                                <p className="text-neutral-600 font-light text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
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

