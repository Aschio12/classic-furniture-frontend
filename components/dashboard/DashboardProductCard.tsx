'use client';

import { motion } from 'framer-motion';

// Use same standard export but unique component name to not conflict with shared ones
export const DashboardProductCard = ({ product }: { product: any }) => {
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `https://classic-furniture-backend.onrender.com${url}`;
    return `https://classic-furniture-backend.onrender.com/${url}`;
  };

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
        }}
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-[#ecebea] flex flex-col cursor-pointer"
      >
        {/* CSS Shine Effect Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-0 bottom-0 left-[-100%] w-1/2 z-20 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 animate-[shine-sweep_40s_infinite_ease-in-out]" />
        </div>

        {/* Product Image Wrapper */}
        <div className="relative w-full aspect-[4/3] bg-[#f9f9f9] overflow-hidden">
          {product.images && product.images[0] ? (
            <img 
              src={getImageUrl(product.images[0])} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : product.imageUrl ? (
            <img 
              src={getImageUrl(product.imageUrl)} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-300 font-light tracking-widest text-sm">
                NO IMAGE
             </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 flex flex-col flex-grow bg-white">
          <div className="mt-auto pt-6 flex justify-between items-end">
            <span className="font-medium text-lg text-gray-900 tracking-tight">
              ${parseFloat(product.price?.toString() || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-gray-400 text-[#D4AF37] group-hover:text-[#B8860B] transition-colors duration-300">
              View Item
            </span>
          </div>
        </div>
      </motion.div>

      {/* Global styles for the shine keyframes */}
      <style jsx global>{`
        @keyframes shine-sweep {
          0% { left: -100%; top: -50%; }
          5% { left: 200%; top: 50%; }
          100% { left: 200%; top: 50%; } /* wait for the remainder of 40 seconds */
        }
      `}</style>
    </>
  );
};
