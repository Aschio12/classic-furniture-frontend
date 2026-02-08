"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { wakeUpServer } from "@/lib/axios";

export default function ServerStatus() {
  const [isAwake, setIsAwake] = useState(false);

  useEffect(() => {
    // Initial check
    const checkServer = async () => {
      const active = await wakeUpServer();
      if (active) setIsAwake(true);
    };
    checkServer();

    // Poll every 30s to keep "alive" status visual (optional, but requested "Green when connected")
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-white/5 bg-black/40 px-3 py-1.5 backdrop-blur-md">
      <div className="relative flex h-2 w-2">
        {isAwake && (
          <motion.span 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" 
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${isAwake ? 'bg-green-500' : 'bg-red-500/50'}`}></span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
        {isAwake ? "System Online" : "Connecting..."}
      </span>
    </div>
  );
}
