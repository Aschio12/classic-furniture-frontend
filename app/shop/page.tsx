"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useFurnitureProducts, Product } from "@/hooks/useFurnitureProducts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function ProductCard({ product }: { product: Product }) {
  // Validate Image Source to prevent Next.js Image component crashing on invalid URLs
  let imageUrl = null;
  const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;
  
  if (typeof imgSrc === 'string' && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('/'))) {
    imageUrl = imgSrc;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden break-inside-avoid mb-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product Image"}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={80}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100/50">
            <span className="text-2xl mb-2">📸</span>
            <span className="text-xs tracking-widest">NO IMAGE</span>
          </div>
        )}

        {/* High-gloss sweep across the image every 5 seconds */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="animate-glossy-sweep absolute inset-y-0 w-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1)_15%,rgba(255,255,255,0.4)_30%,rgba(255,255,255,0.1)_45%,transparent)] blur-[2px]" />
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col gap-3 relative z-20">
        <div>
          <h3 className="font-serif text-xl text-gray-900 leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-medium text-[#D4AF37]">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : "0.00"}
          </p>
        </div>

        {/* Polished Obsidian Button */}
        <button className="relative overflow-hidden w-full mt-2 py-3 rounded-full bg-gradient-to-b from-[#2c2c2c] to-[#0a0a0a] border border-[#333] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.2)] text-[10px] tracking-[0.25em] uppercase font-bold text-white transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] group/btn">
          <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">View Details</span>
          {/* Subtle button reflection on hover */}
          <span className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-all duration-500 ease-out group-hover/btn:translate-x-[200%]" />
        </button>
      </div>
    </motion.article>
  );
}

export default function ShopPage() {
  const { data: products, isLoading, error } = useFurnitureProducts();

  return (
    <ProtectedRoute allowedRoles={['user', 'admin', 'hub_manager', 'seller']}>
      <div className="min-h-screen pt-32 pb-16 px-6 md:px-12 mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-gray-900 mb-3">The Collection</h1>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Discover our curated selection of timeless furniture, crafted for modern luxury and unparalleled comfort.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-8 border border-red-100">
            <p>Failed to load products: {error}</p>
          </div>
        )}

        {/* CSS for custom sweeps */}
        <style>{`
          @keyframes glossy-sweep {
            0% { transform: translateX(-100%) skewX(-25deg); opacity: 0; }
            5% { opacity: 1; }
            20% { transform: translateX(100%) skewX(-25deg); opacity: 0; }
            100% { transform: translateX(100%) skewX(-25deg); opacity: 0; }
          }
          .animate-glossy-sweep {
            animation: glossy-sweep 5s infinite cubic-bezier(0.25, 1, 0.5, 1);
            transform: translateX(-100%) skewX(-25deg);
          }
        `}</style>

        {isLoading ? (
          // Liquid Shimmer Skeleton matching Masonry grid
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden break-inside-avoid mb-6 rounded-2xl border border-gray-100 bg-white"
                style={{ height: i % 2 === 0 ? '420px' : '360px' }}
              >
                {/* Liquid Shimmer Effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                  className="absolute inset-0 z-10 bg-[linear-gradient(90deg,transparent,rgba(230,230,230,0.5),transparent)] skew-x-[-20deg]"
                />
                <div className="absolute inset-x-0 top-0 bottom-[120px] bg-gray-50"></div>
                <div className="absolute inset-x-5 bottom-8 h-6 w-2/3 bg-gray-100 rounded-md"></div>
                <div className="absolute inset-x-5 bottom-[88px] h-5 w-1/3 bg-gray-100 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          // Masonry Grid Display
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-7">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
            <h3 className="text-xl font-serif text-gray-800">No products found</h3>
            <p className="text-gray-500 mt-2">Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
