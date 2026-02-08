"use client";

import { motion } from "framer-motion";

interface PageTransitionProps {
  isActive: boolean;
}

export default function PageTransition({ isActive }: PageTransitionProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* The Wave */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: ["100%", "0%", "-100%"] }}
        transition={{ duration: 1.5, times: [0, 0.4, 1], ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-50 bg-black"
      >
        {/* Detail text that appears briefly in the middle */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
        >
             <h2 className="text-4xl font-thin tracking-[0.5em] text-white/50">ENTERING</h2>
        </motion.div>
        
        {/* Oily Topper */}
        <div className="absolute top-0 h-32 w-full -translate-y-full bg-gradient-to-t from-black to-transparent opacity-50" />
      </motion.div>
    </div>
  );
}
