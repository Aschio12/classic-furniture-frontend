"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wakeUpServer } from "@/lib/axios";

export default function ServerAwakeLoader({ children }: { children: React.ReactNode }) {
  const [isAwake, setIsAwake] = useState(false);
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      // Start the ping
      await wakeUpServer();
      // Add a minimum delay for the animation to be seen/feel premium
      setTimeout(() => {
        setIsAwake(true);
      }, 1500); 
    };

    checkServer();

    // If it takes longer than 3 seconds, show a reassuring message
    const timer = setTimeout(() => {
      setShowLongWaitMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAwake && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-50"
          >
            {/* Oily Background Effects */}
            <div 
                className="absolute inset-0 z-0 bg-linear-to-br from-white via-neutral-100 to-neutral-50" 
            />
             <div 
                className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/40 to-transparent opacity-50"
                style={{ backdropFilter: "blur(40px)" }}
            />

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo or Brand Element */}
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold tracking-[0.3em] text-neutral-900"
                >
                    LUXECRAFT
                </motion.h1>

                {/* Luxury Spinner */}
                <div className="relative h-16 w-16">
                    <motion.span
                        className="absolute inset-0 rounded-full border border-neutral-200"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    />
                    <motion.span
                        className="absolute inset-0 rounded-full border-t-2 border-neutral-900"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.span
                        className="absolute inset-2 rounded-full border-b-2 border-neutral-400"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <motion.div 
                    className="flex flex-col items-center gap-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
                        Secure Connection...
                    </p>
                    {showLongWaitMessage && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-neutral-400"
                        >
                            Waking up secure server... this may take a moment.
                        </motion.p>
                    )}
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 
        We render children always but hidden behind the loader initially.
        Or we can conditionally render if we want to block interactions completely.
        For SEO/hydration, rendering is usually better, visual blocking is enough.
       */}
       <div className={!isAwake ? "fixed inset-0 overflow-hidden" : ""}>
            {children}
       </div>
    </>
  );
}
