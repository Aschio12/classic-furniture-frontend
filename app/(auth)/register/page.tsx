"use client";

import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F9F9FB] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <RegisterForm />
      </motion.div>
    </main>
  );
}
