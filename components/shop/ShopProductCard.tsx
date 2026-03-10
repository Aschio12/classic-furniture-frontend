'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

interface ShopProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    images?: string[];
    imageUrl?: string;
  };
}

export const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `https://classic-furniture-backend.onrender.com${url}`;
    return `https://classic-furniture-backend.onrender.com/${url}`;
  };

  const rawImageUrl = (product.images && product.images[0]) || product.imageUrl || '';
  const imageUrl = getImageUrl(rawImageUrl);

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      // Sharp edges (no rounded corners), thin border, bg-white, break-inside-avoid for masonry
      className="relative bg-white border border-[#eaeaea] overflow-hidden group mb-6 hover:shadow-xl transition-all duration-500 break-inside-avoid cursor-pointer"
    >
      {/* Oily Shine Radial Gradient Overlay */}
      {/* Follows mouse via CSS variables --x and --y updated in onMouseMove */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 oily-shine" />

      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-light text-xs tracking-widest uppercase">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col z-10 relative bg-white">

        <div className="mt-6 flex justify-between items-end">
          <span className="text-gray-900 font-medium tracking-tight">
            ${parseFloat(product.price?.toString() || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-semibold text-[#D4AF37] group-hover:text-[#B8860B] transition-colors duration-300">
            Details
          </span>
        </div>
      </div>
    </motion.div>
  );
};
