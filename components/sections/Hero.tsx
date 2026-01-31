"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary/60">
            Luxury Furniture Marketplace
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            Exquisite Craftsmanship, Securely Delivered.
          </h1>
          <p className="max-w-xl text-base leading-7 text-primary/70">
            Curated collections, verified sellers, and escrow-backed deliveries—crafted for those who value
            timeless design.
          </p>
          <div>
            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-primary/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-background">
                Shop the Collection
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="/images/hero-furniture.jpg"
            alt="Luxury furniture showcase"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
