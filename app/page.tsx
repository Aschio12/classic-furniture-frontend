"use client";

import { useEffect, useRef, useState } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Header Animations (Moves UP and Fades OUT)
    const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    // Auth Card Animations (Moves UP from bottom and Fades IN)
    const authY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
    const authOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
    const authScale = useTransform(scrollYProgress, [0.1, 0.4], [0.9, 1]);

    // Mouse Physics for Subtle Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX - innerWidth / 2) / 50); // Divide by 50 for subtle effect
        mouseY.set((clientY - innerHeight / 2) / 50);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user && !authLoading) {
            setIsRedirecting(true);
            // Wait for the "Wave" to cover the screen (approx 600ms) before pushing route
            const timer = setTimeout(() => {
                if (user.role === 'hub_manager') router.push('/dashboard/hub-manager');
                else if (user.role === 'admin') router.push('/admin');
                else router.push('/shop');
            }, 800); 
            return () => clearTimeout(timer);
        }
    }, [user, authLoading, router]);

    if (!mounted) return null;

    return (
        <main 
            ref={containerRef} 
            className="relative h-[200vh] w-full bg-neutral-950 text-white overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >
            <PageTransition isActive={isRedirecting} />

            {/* --- Fixed Cinematic Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <motion.div 
                    className="relative h-full w-full"
                    style={{ x: springX, y: springY, scale: 1.05 }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1600607687652-9b927df4563e?q=80&w=2670&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Cinematic Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-neutral-900/20 mix-blend-overlay" />
                </motion.div>
                
                {/* Oily Atmosphere Overlay */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* --- Screen 1: The Hook (Header) --- */}
            <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center pt-20">
                <motion.div 
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="flex flex-col items-center text-center space-y-6"
                >
                    <h1 className="font-serif text-6xl md:text-9xl tracking-tight text-white drop-shadow-2xl">
                        LUXECRAFT
                    </h1>
                    <p className="text-sm md:text-lg uppercase tracking-[0.5em] text-white/70 font-light">
                        The Art of Living
                    </p>
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
                    {/* Glassmorphism Auth Container */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 p-10">
                        {/* Obsidian Button Style */}
                        <div className="flex flex-col gap-5">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="group relative w-full overflow-hidden rounded-xl bg-black px-8 py-5 text-sm font-medium uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:shadow-white/10 hover:scale-[1.01]">
                                        <span className="relative z-10">Login</span>
                                        {/* Glossy Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        {/* Light Sweep */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-out] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="border-neutral-800 bg-neutral-950 text-white sm:rounded-2xl">
                                    <LoginForm />
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-5 text-sm font-medium uppercase tracking-[0.2em] text-white/90 shadow-lg transition-all hover:bg-white/10 hover:scale-[1.01]">
                                        <span className="relative z-10">Register</span>
                                         {/* Light Sweep */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-out] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="border-neutral-800 bg-neutral-950 text-white sm:rounded-2xl">
                                    <RegisterForm />
                                </DialogContent>
                            </Dialog>

                            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            
                            <Link 
                                href="/shop"
                                className="text-center text-xs font-semibold tracking-widest text-white/50 transition-colors hover:text-white"
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
