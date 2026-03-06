'use client';

import { useFurnitureProducts } from '@/hooks/useFurnitureProducts';
import { DashboardProductCard } from '@/components/dashboard/DashboardProductCard';
import { motion } from 'framer-motion';

export const MainDashboard = () => {
  const { data: products, isLoading, error } = useFurnitureProducts();

  return (
    <div className="min-h-screen bg-[#faf9f6]"> {/* Soft, high-end off-white background */}
      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-50 border-b border-[#ecebea]">
        <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Classic Furniture</h1>
        <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm border border-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-light text-gray-900"
          >
            Curated Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-2"
          >
            Explore our exclusive luxury pieces designed for modern living.
          </motion.p>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-20 bg-red-50/50 rounded-xl border border-red-100">
            <p>Failed to load collection: {error}</p>
          </div>
        )}

        {/* Responsive Grid Layout */}
        {!isLoading && !error && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <DashboardProductCard key={product._id} product={product} />
            ))}
            
            {/* Fallback for empty state */}
            {products.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">No products available at the moment.</p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};
