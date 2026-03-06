"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useFurnitureProducts } from "@/hooks/useFurnitureProducts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 60, damping: 15 } 
  },
};

export default function ShopPage() {
  const { data: products, isLoading, error } = useFurnitureProducts();

  return (
    <ProtectedRoute allowedRoles={['user', 'admin', 'hub_manager']}>
      <div className="mx-auto max-w-7xl">
        {/* Loading State */}
        {isLoading && (
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`relative break-inside-avoid overflow-hidden rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md ${
                  i % 2 === 0 ? "h-[22rem]" : "h-[28rem]"
                }`}
              >
                {/* Liquid Shimmer Skeleton Effect */}
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.8)_35%,rgba(212,175,55,0.15)_45%,rgba(255,255,255,0.8)_55%,transparent_75%)]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-sm font-light tracking-widest text-red-500/80 uppercase">
              Temporary Interruption
            </p>
            <p className="mt-3 text-xs font-light text-[#2C2C2C]/50">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C]">
                Our current collection is being prepared for you.
              </h2>
              <p className="mt-5 text-[10px] font-light uppercase tracking-[0.3em] text-[#2C2C2C]/50">
                Please check back shortly
              </p>
            </motion.div>
          </div>
        )}

        {/* Loaded State */}
        {!isLoading && !error && products && products.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3"
          >
            {products.map((product) => (
              <motion.article
                key={product._id}
                variants={itemVariants}
                className="group relative break-inside-avoid overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-[10px] saturate-[1.2] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
              >
                {/* Subtle 'Light Sweep' repeating every 5s */}
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3.5,
                  }}
                  className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.7)_45%,rgba(255,255,255,0.2)_55%,transparent_70%)]"
                />

                {/* Product Image Area */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2F2F2]">
                  <Image
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.3)_0%,transparent_40%)] transition-opacity duration-500 group-hover:opacity-20" />

                  {/* Quick View Button */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full border border-white/50 bg-white/30 px-6 py-2.5 text-[10px] tracking-[0.2em] text-[#2C2C2C] font-medium shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-white/50"
                    >
                      QUICK VIEW
                    </motion.button>
                  </div>

                  {/* Category Tag */}
                  {product.category && (
                    <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[8px] font-light uppercase tracking-[0.2em] text-[#2C2C2C] backdrop-blur-md">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="relative z-10 p-5">
                  <h3 className="font-serif text-lg tracking-wide text-[#2C2C2C]">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] font-light leading-relaxed text-[#2C2C2C]/60">
                    {product.description}
                  </p>
                  
                  {/* Price & Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="font-serif text-[15px] text-[#2C2C2C]">
                      ${product.price?.toLocaleString()}
                    </span>
                    <button className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:text-[#C5A028]">
                      Explore →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}
