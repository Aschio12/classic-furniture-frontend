"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    motion, 
    useScroll, 
    useTransform, 
    AnimatePresence,
    useSpring, 
    useMotionValue 
} from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function Home() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // Scroll Parallax Hooks
    // Using window scroll (pixels) for more robust initial load state
    const { scrollY } = useScroll();

    // Header Animations (Moves UP and Fades OUT)
    // 0px to 300px scroll range
    const headerY = useTransform(scrollY, [0, 300], [0, -100]);
    const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const headerBlur = useTransform(scrollY, [0, 300], ["blur(0px)", "blur(10px)"]);

    // Auth Card Animations (Moves UP from bottom and Fades IN)
    // 200px to 500px scroll range
    const authY = useTransform(scrollY, [200, 500], [100, 0]);
    const authOpacity = useTransform(scrollY, [200, 500], [0, 1]);
    const authScale = useTransform(scrollY, [200, 500], [0.9, 1]);

    // Background Animations
    const bgScale = useTransform(scrollY, [0, 800], [1, 1.05]);

    // Mouse Physics & Light Flare
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Light Flare Gradient center point (percent 0-100)
    const flareX = useMotionValue(50);
    const flareY = useMotionValue(50);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Parallax values
        mouseX.set((clientX - innerWidth / 2) / 50); 
        mouseY.set((clientY - innerHeight / 2) / 50);

        // Flare values (percentage)
        flareX.set((clientX / innerWidth) * 100);
        flareY.set((clientY / innerHeight) * 100);
    };

    // Transform motion values to CSS string for gradient
    const flareGradient = useTransform(
        [flareX, flareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
    );

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user && !authLoading) {
            const animTimer = setTimeout(() => setIsRedirecting(true), 0);

            // Wait for the "Wave" to cover the screen (approx 600ms) before pushing route
            const redirectTimer = setTimeout(() => {
                if (user.role === 'hub_manager') router.push('/dashboard/hub-manager');
                else if (user.role === 'admin') router.push('/admin');
                else router.push('/shop');
            }, 800); 
            
            return () => {
                clearTimeout(animTimer);
                clearTimeout(redirectTimer);
            };
        }
    }, [user, authLoading, router]);

    if (!mounted) return null;

    return (
        <main 
            className="relative h-[200vh] w-full bg-neutral-950 text-white overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >
            <PageTransition isActive={isRedirecting} />

            {/* --- Fixed Cinematic Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <motion.div 
                    className="relative h-full w-full"
                    style={{ 
                        x: springX, 
                        y: springY, 
                        scale: bgScale
                    }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1600607687652-9b927df4563e?q=80&w=2670&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    
                    {/* Morning Glow Overlay */}
                    <div 
                        className="absolute inset-0 z-[1]"
                        style={{ backdropFilter: "saturate(1.4) brightness(1.1)" }}
                    />
                    
                    {/* Interactive Light Flare */}
                    <motion.div 
                        className="absolute inset-0 z-[2] mix-blend-overlay"
                        style={{ background: flareGradient }}
                    />

                    {/* Cinematic Gradient Overlays */}
                    <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/30 via-transparent to-black/80 mix-blend-multiply" />
                    <div className="absolute inset-0 z-[4] bg-neutral-900/20 mix-blend-overlay" />
                </motion.div>
                
                {/* Oily Atmosphere Overlay */}
                <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* --- Screen 1: The Hook (Header) --- */}
            <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center pt-20">
                <motion.div 
                    style={{ y: headerY, opacity: headerOpacity, filter: headerBlur }}
                    className="flex flex-col items-center text-center space-y-6"
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-widest text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                        Elegance Defined.
                        <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl text-white/90">
                            Security Guaranteed.
                        </span>
                    </h1>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                    style={{ opacity: headerOpacity }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Details Below</span>
                    <ChevronDown className="h-6 w-6 text-white/50" />
                </motion.div>
            </div>

            {/* --- Screen 2: The Action (Auth Card) --- */}
            <div className="relative z-10 flex h-screen w-full items-center justify-center pointer-events-none"> 
                {/* pointer-events-none on wrapper so clicks pass through if empty, but child enables them */}
                <motion.div 
                    style={{ y: authY, opacity: authOpacity, scale: authScale }}
                    className="pointer-events-auto relative w-full max-w-md p-8"
                >
                    {/* Glassmorphism Auth Container - Shining Glass */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl p-10">
                        {/* Obsidian Button Style */}
                        <div className="flex flex-col gap-5">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="group relative w-full overflow-hidden rounded-xl bg-black px-8 py-5 text-sm font-medium uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:shadow-white/10 hover:scale-[1.01]">
                                        <span className="relative z-10">Enter Showroom</span>
                                        {/* Glossy Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        {/* Light Sweep */}
                                        <div className="absolute inset-0 -translate-x-full animate-[shine_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="border-neutral-800 bg-white/10 backdrop-blur-3xl text-white sm:rounded-2xl">
                                    <LoginForm />
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="group relative w-full overflow-hidden rounded-xl border border-white/30 bg-white/10 px-8 py-5 text-sm font-medium uppercase tracking-[0.2em] text-white/90 shadow-lg transition-all hover:bg-white/20 hover:scale-[1.01]">
                                        <span className="relative z-10">Request Access</span>
                                         {/* Light Sweep */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-out] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="border-neutral-800 bg-white/10 backdrop-blur-3xl text-white sm:rounded-2xl">
                                    <RegisterForm />
                                </DialogContent>
                            </Dialog>

                            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            
                            <Link 
                                href="/shop"
                                className="text-center text-xs font-semibold tracking-widest text-white/70 transition-colors hover:text-white"
                            >
                                CONTINUE AS GUEST
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
