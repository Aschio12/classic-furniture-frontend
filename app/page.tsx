"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import Hero from "@/components/sections/Hero";
import ProductGrid from "@/components/shared/ProductGrid";
import Footer from "@/components/shared/Footer";
import api from "@/lib/axios";
import { type Product } from "@/components/shared/ProductCard";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        // Fetch products and take the first 4 as new arrivals
        const { data } = await api.get("/products");
        setNewArrivals(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <Hero />

      {/* New Arrivals Section */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-16 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-thin tracking-widest text-primary md:text-4xl">
              New Arrivals
            </h2>
            <div className="mt-4 h-px w-24 bg-accent" />
          </motion.div>

          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-medium text-primary/60 transition-colors hover:text-primary"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
          </div>
        ) : (
          <ProductGrid products={newArrivals} />
        )}
      </section>

      {/* Featured Banner (Optional separation) */}
      <section className="bg-primary py-24 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center px-4">
          <h2 className="text-3xl font-light tracking-wide md:text-5xl">
            Experience True Comfort
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/60">
            Handcrafted pieces designed to elevate your living space. 
            Join our community of makers and design enthusiasts.
          </p>
          <Link
            href="/shop"
            className="mt-10 rounded-full border border-white/20 px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-primary"
          >
            Explore Now
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
