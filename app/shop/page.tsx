"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Loader2 } from "lucide-react";

import api from "@/lib/axios";
import MainLayout from "@/components/shared/MainLayout";
import ProductGrid from "@/components/shared/ProductGrid";
import { type Product } from "@/components/shared/ProductCard";

const categories = ["All", "Living Room", "Bedroom", "Dining", "Office"];

type ProductWithCategory = Product & {
  category?: string;
};

function ShopContent() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.category?.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    }
  }, [activeCategory, products]);

  return (
    <main className="min-h-screen bg-[#F9F9FB] pb-24 pt-24">
      {/* Header Section */}
      <section className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-thin tracking-widest text-primary md:text-5xl"
        >
          Curated Collections
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 font-light text-primary/60"
        >
          Timeless pieces for the modern connoisseur
        </motion.p>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 mt-12 border-b border-primary/5 bg-[#F9F9FB]/95 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative whitespace-nowrap rounded-full px-5 py-2 text-sm transition-all ${
                  activeCategory === category
                    ? "font-medium text-white"
                    : "text-primary/60 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>

          <button className="hidden items-center gap-2 text-sm text-primary/60 hover:text-primary sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <ProductGrid key={activeCategory} products={filteredProducts} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[30vh] flex-col items-center justify-center text-center"
              >
                <p className="text-lg font-light text-primary/60">
                  No items found in this collection.
                </p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 text-sm font-medium text-accent hover:underline"
                >
                  View all collections
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <MainLayout>
      <ShopContent />
    </MainLayout>
  );
}
