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
    <motion.div
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 flex flex-col justify-between"
      style={{ boxShadow: "none" }}
    >
      <div className="oily-shine absolute inset-0 z-10 pointer-events-none rounded-2xl"></div>
      
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product Image"}
            fill
            className="object-cover transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-xl mb-2">📸</span>
            <span className="text-xs tracking-wider">NO IMAGE</span>
          </div>
        )}
      </div>

      <div className="space-y-1 z-20 pb-1">
        <h3 className="font-serif text-lg text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="text-base font-medium text-[#D4AF37] mt-2">
          ${typeof product.price === 'number' ? product.price.toFixed(2) : "0.00"}
        </p>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const { data: products, isLoading, error } = useFurnitureProducts();

  return (
    <ProtectedRoute allowedRoles={['user', 'admin', 'hub_manager', 'seller']}>
      <div className="min-h-screen pt-32 pb-16 px-6 md:px-12 mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-gray-900 mb-2">Our Collection</h1>
          <p className="text-gray-500 text-sm max-w-xl">
            Explore our meticulously curated pieces, designed to bring timeless elegance and modern luxury to your space.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-8 border border-red-100">
            <p>Failed to load products: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white flex flex-col p-4 h-[24rem]"
                style={{ boxShadow: "none" }}
              >
                <div className="h-56 w-full rounded-xl bg-gray-100 mb-4"></div>
                <div className="space-y-3 mt-auto mb-2">
                  <div className="h-5 w-2/3 rounded-md bg-gray-100"></div>
                  <div className="h-4 w-full rounded-md bg-gray-100"></div>
                  <div className="h-4 w-5/6 rounded-md bg-gray-100"></div>
                  <div className="h-5 w-1/4 rounded-md bg-gray-200 mt-2"></div>
                </div>

                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 z-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] skew-x-[-20deg]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <style>{`
        .oily-shine {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .group:hover .oily-shine {
          opacity: 1;
        }
        .oily-shine::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-25deg);
          animation: sweep 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes sweep {
          0% { left: -150%; }
          40% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </ProtectedRoute>
  );
}
