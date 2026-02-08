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
      }, 2500); 
    };

    checkServer();

    // If it takes longer than 3 seconds, show a reassuring message
    const timer = setTimeout(() => {
      setShowLongWaitMessage(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAwake && (
          <motion.div
            key="server-loader"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ 
                clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", // Wipes UP
                transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white"
          >
            {/* Minimalist Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px]" />
            
            <div className="relative z-10 flex flex-col items-center">
                
                {/* Elegant Line Drawing Animation */}
                <div className="relative h-32 w-32 mb-8">
                    <svg viewBox="0 0 100 100" className="h-full w-full stroke-neutral-900 fill-none stroke-[1.5] overflow-visible">
                        <motion.path
                            d="M25 75V40C25 25 35 20 50 20C65 20 75 25 75 40V75M25 55H75" // Abstract modernist chair
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ 
                                duration: 2, 
                                ease: "easeInOut", 
                                repeat: Infinity, 
                                repeatType: "reverse",
                                repeatDelay: 0.5 
                            }}
                        />
                         {/* Floor Reflection Line */}
                        <motion.path 
                             d="M20 85H80"
                             className="stroke-neutral-300"
                             initial={{ scaleX: 0 }}
                             animate={{ scaleX: 1 }}
                             transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </svg>
                </div>

                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-light tracking-[0.4em] text-neutral-900"
                >
                    ATELIER
                </motion.h1>

                <AnimatePresence>
                    {showLongWaitMessage && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-12 text-[10px] uppercase tracking-widest text-neutral-400"
                        >
                            Preparing the showroom...
                        </motion.p>
                    )}
                </AnimatePresence>
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
