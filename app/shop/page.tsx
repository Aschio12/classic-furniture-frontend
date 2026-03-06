'use client';

import { useFurnitureProducts } from '@/hooks/useFurnitureProducts';
import { ShopProductCard } from '@/components/shop/ShopProductCard';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
};

export default function ShopPage() {
  const { data: products, isLoading, error } = useFurnitureProducts();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-serif text-gray-900 tracking-tight">Connectivity Issue</h2>
          <div className="w-8 h-[1px] bg-red-200 mx-auto my-4"></div>
          <p className="text-gray-500 font-light leading-relaxed">
            We are unable to reach the gallery at this moment. Please try refreshing the page or come back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen bg-[#faf9f6] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <style jsx global>{`
        .oily-shine {
          background: radial-gradient(
            circle 400px at var(--x, 50%) var(--y, 50%), 
            rgba(255, 255, 255, 0.7), 
            transparent 50%
          );
          mix-blend-mode: soft-light;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight"
        >
          The Collection
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-12 h-[1px] bg-gray-300 mx-auto mt-8"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="break-inside-avoid bg-white border border-[#eaeaea] p-4 mb-6 shadow-sm">
                <div className="w-full bg-gray-100 mb-6 aspect-[3/4] animate-pulse rounded-sm"></div>
                <div className="flex flex-col gap-3 px-2 pb-2">
                  <div className="h-5 bg-gray-100 w-3/4 animate-pulse rounded-sm"></div>
                  <div className="h-4 bg-gray-50 w-full animate-pulse rounded-sm mt-2"></div>
                  <div className="h-4 bg-gray-50 w-2/3 animate-pulse rounded-sm"></div>
                  <div className="h-5 bg-gray-100 w-1/4 animate-pulse rounded-sm mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
          >
            {products.map((product) => (
              <ShopProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
  </ProtectedRoute>
  );
}