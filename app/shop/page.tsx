"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Footer from "@/components/shared/Footer";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

// 21 High-Fidelity Unsplash Placeholders (Verified Unsplash IDs)
const PREMIUM_DUMMY_DATA: Product[] = [
  { _id: 'dm1', name: 'Aura Lounge Chair', price: 1299, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000'] },
  { _id: 'dm2', name: 'Velvet Cloud Sofa', price: 2499, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm3', name: 'Oakhaven Accent Chair', price: 899, images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm4', name: 'Lumina Coffee Table', price: 650, images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm5', name: 'Crescent Dining Chair', price: 450, images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm6', name: 'Solstice Bed Frame', price: 1800, images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm7', name: 'Mid-Century Desk', price: 1200, images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm8', name: 'Gallery Bookshelf', price: 1450, images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm9', name: 'Oceana Sideboard', price: 1150, images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm10', name: 'Bouclé Armchair', price: 950, images: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm11', name: 'Halo Pendant Lamp', price: 320, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm12', name: 'Artisan Dining Table', price: 1600, images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm13', name: 'Terracotta Pouf', price: 400, images: ['https://images.unsplash.com/photo-1598300042247-d088f8d22ef1?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm14', name: 'Rattan Wardrobe', price: 2100, images: ['https://images.unsplash.com/photo-1601366530622-b2ce14421cc6?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm15', name: 'Marble Side Table', price: 550, images: ['https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm16', name: 'Vesper Floor Lamp', price: 420, images: ['https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm17', name: 'Linen Modular Sofa', price: 1950, images: ['https://images.unsplash.com/photo-1540574163026-643ea20d25b5?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm18', name: 'Sable Nightstand', price: 280, images: ['https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm19', name: 'Minimalist Stool', price: 150, images: ['https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm20', name: 'Earthy Clay Vase', price: 120, images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80'] },
  { _id: 'dm21', name: 'Monochrome Rug', price: 750, images: ['https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=1000&q=80'] },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--x', `${x}%`);
    target.style.setProperty('--y', `${y}%`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const fetched = Array.isArray(res.data) ? res.data : res.data.products || [];
        
        const combined = [...fetched, ...PREMIUM_DUMMY_DATA].slice(0, 21);
        const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
        
        setProducts(unique);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts(PREMIUM_DUMMY_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-[#FAFAFA] text-[#2C2C2C] selection:bg-[#D4AF37]/30 flex flex-col"
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300" 
        style={{ 
            background: 'radial-gradient(circle 800px at var(--x, 50%) var(--y, 50%), rgba(212,175,55,0.04), transparent 45%)', 
            mixBlendMode: 'normal' 
        }} 
      />

      <div className="w-full max-w-[2200px] mx-auto relative z-10 px-4 sm:px-8 lg:px-12 xl:px-20 pt-32 pb-20 flex-grow">
        <header className="mb-12 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-[#2C2C2C] mb-4 drop-shadow-sm font-serif"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              The Main Gallery
            </h1>
            <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Timeless elegance encased in clarity. Flow through our curated pieces.
            </p>
          </motion.div>
        </header>

        {loading ? (
          <div className="grid gap-6 sm:gap-10 lg:gap-12 xl:gap-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-full bg-white/40 backdrop-blur-md rounded-[1.6rem] overflow-hidden relative aspect-square border border-white/50 shadow-[0_15px_45px_rgba(0,0,0,0.04)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-[shimmer_2s_infinite_ease-in-out]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-10 lg:gap-12 xl:gap-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {products.map((product, index) => (
              <motion.article
                key={product._id}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, delay: index * 0.1, type: "spring", stiffness: 80 }}
                whileHover={{ y: -12 }}
                className="glass oil-slick wet-shine group relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/50 shadow-[0_12px_45px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_25px_65px_rgba(0,0,0,0.08)] hover:bg-white w-full flex flex-col"
              >
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#F9F9FB]">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      loading={index < 6 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Pure Form</div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* 
                    Glossy shine sweeping across every 4 seconds.
                    Also sweeps on hover via group-hover for immediate response.
                  */}
                  <div className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 opacity-70 group-hover:opacity-100">
                    <div className="absolute inset-y-0 -left-[160%] w-[75%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-none group-hover:translate-x-[450%] transition-transform duration-[1200ms]" style={{ animation: "continuous-shine 40s ease-in-out infinite" }} />
                  </div>
                </div>

                <div className="relative flex flex-col p-5 bg-white/60 backdrop-blur-2xl z-20 shrink-0">
                  <div className="wet-line w-full mb-3 hidden" />
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0 flex-1">
                      <h2 className="text-[1.35rem] font-semibold text-[#2C2C2C] truncate pr-2">{product.name}</h2>
                      <p className="text-xl font-medium text-[#D4AF37]">${product.price.toLocaleString()}</p>
                    </div>

                    <div className="flex shrink-0 items-center justify-end gap-3 z-30">
                         {/* Golden Add to Cart Button */}
                         <button 
                            className="flex items-center justify-center py-3.5 px-4 rounded-[1rem] bg-[#D4AF37]/10 shadow-[0_4px_12px_rgba(212,175,55,0.05)] border border-[#D4AF37]/30 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-105"
                            title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        
                        {/* Golden Details Button */}
                        <Link href={`/product/${product._id}`} className="group/link flex items-center justify-center p-3 sm:p-3.5 rounded-[1rem] bg-transparent border border-[#D4AF37]/30 text-[#B8860B] transition-all duration-300 hover:bg-[#D4AF37]/10 hover:text-[#8B6508] hover:border-[#D4AF37]/50 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]" title="View Details">
                            <span className="font-semibold text-sm tracking-widest pl-2 pr-1">DETAILS</span>
                            <span className="inline-block transition-transform duration-300 font-bold group-hover/link:translate-x-1 pr-1">
                                →
                            </span>
                        </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes continuous-shine {
          0% { transform: translateX(0); opacity: 0; }
          2.5% { opacity: 1; }
          5% { transform: translateX(450%); opacity: 0; }
          100% { transform: translateX(450%); opacity: 0; }
        }
      `}} />
    </main>
  );
}
