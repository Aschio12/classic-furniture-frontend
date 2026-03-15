"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/axios";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  SlidersHorizontal,
  Eye,
  ArrowRight,
  Sparkles,
  Package,
} from "lucide-react";
import Footer from "@/components/shared/Footer";
import MainNavbar from "@/components/shared/MainNavbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
  imageUrl?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const CURATED_CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Lighting",
  "Storage",
  "Decor",
];

function normalizeCategoryName(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const map: Record<string, string> = {
    "living room": "Living Room",
    "sofas": "Living Room",
    "chairs": "Living Room",
    "bedroom": "Bedroom",
    "dining": "Dining",
    "office": "Office",
    "lighting": "Lighting",
    "storage": "Storage",
    "decor": "Decor",
    "tables": "Dining",
    "chair": "Living Room",
  };
  return map[lower] || "";
}

const UNIQUE_IMAGES = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=90&w=1400",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1540574163026-643ea20d25b5?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=1400&q=90",
];

const DUMMY_PRODUCTS: Product[] = [
  { _id: "dm1", name: "Aura Lounge Chair", price: 1299, description: "Sculptural comfort meets modern elegance", category: "Living Room", image: UNIQUE_IMAGES[0] },
  { _id: "dm2", name: "Velvet Cloud Sofa", price: 2499, description: "Sink into cloud-like luxury", category: "Living Room", image: UNIQUE_IMAGES[1] },
  { _id: "dm3", name: "Oakhaven Accent Chair", price: 899, description: "Warm oak with artisan upholstery", category: "Living Room", image: UNIQUE_IMAGES[2] },
  { _id: "dm4", name: "Lumina Coffee Table", price: 650, description: "Clean lines, warm materials", category: "Dining", image: UNIQUE_IMAGES[3] },
  { _id: "dm5", name: "Crescent Dining Chair", price: 450, description: "Curved silhouette for modern dining", category: "Dining", image: UNIQUE_IMAGES[4] },
  { _id: "dm6", name: "Solstice Bed Frame", price: 1800, description: "Minimal platform, maximum presence", category: "Bedroom", image: UNIQUE_IMAGES[5] },
  { _id: "dm7", name: "Mid-Century Desk", price: 1200, description: "Timeless workspace inspiration", category: "Office", image: UNIQUE_IMAGES[6] },
  { _id: "dm8", name: "Gallery Bookshelf", price: 1450, description: "Display your world beautifully", category: "Storage", image: UNIQUE_IMAGES[7] },
  { _id: "dm9", name: "Oceana Sideboard", price: 1150, description: "Coastal elegance for any room", category: "Storage", image: UNIQUE_IMAGES[8] },
  { _id: "dm10", name: "Bouclé Armchair", price: 950, description: "Textured warmth, sculptural form", category: "Living Room", image: UNIQUE_IMAGES[9] },
  { _id: "dm11", name: "Halo Pendant Lamp", price: 320, description: "Ambient glow, architectural form", category: "Lighting", image: UNIQUE_IMAGES[10] },
  { _id: "dm12", name: "Artisan Dining Table", price: 1600, description: "Gather around craftsmanship", category: "Dining", image: UNIQUE_IMAGES[11] },
  { _id: "dm13", name: "Terracotta Pouf", price: 400, description: "Earthy accent, versatile comfort", category: "Decor", image: UNIQUE_IMAGES[12] },
  { _id: "dm14", name: "Rattan Wardrobe", price: 2100, description: "Natural storage with character", category: "Bedroom", image: UNIQUE_IMAGES[13] },
  { _id: "dm15", name: "Marble Side Table", price: 550, description: "Stone-cold sophistication", category: "Decor", image: UNIQUE_IMAGES[14] },
  { _id: "dm16", name: "Vesper Floor Lamp", price: 420, description: "Sculptural light for any corner", category: "Lighting", image: UNIQUE_IMAGES[15] },
  { _id: "dm17", name: "Linen Modular Sofa", price: 1950, description: "Configure your perfect lounge", category: "Living Room", image: UNIQUE_IMAGES[16] },
  { _id: "dm18", name: "Sable Nightstand", price: 280, description: "Bedside essential, refined", category: "Bedroom", image: UNIQUE_IMAGES[17] },
  { _id: "dm19", name: "Minimalist Stool", price: 150, description: "Pure form, endless function", category: "Living Room", image: UNIQUE_IMAGES[18] },
  { _id: "dm20", name: "Earthy Clay Vase", price: 120, description: "Handmade texture, organic beauty", category: "Decor", image: UNIQUE_IMAGES[19] },
  { _id: "dm21", name: "Monochrome Rug", price: 750, description: "Ground your space in style", category: "Decor", image: UNIQUE_IMAGES[20] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};
const FADE_UP = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function isValidImageUrl(url?: string): boolean {
  if (!url || url === "string") return false;
  if (url.startsWith("https://example.com")) return false;
  if (url.startsWith("http") || url.startsWith("/")) return true;
  return false;
}

function normalizeProduct(raw: ApiProduct, index: number): Product {
  const rawImage = raw.images?.[0] || raw.imageUrl;
  let image: string;

  if (isValidImageUrl(rawImage)) {
    let url = rawImage!;
    if (!url.startsWith("http")) {
      url = url.startsWith("/")
        ? `https://classic-furniture-backend.onrender.com${url}`
        : `https://classic-furniture-backend.onrender.com/${url}`;
    }
    image = url;
  } else {
    image = UNIQUE_IMAGES[index % UNIQUE_IMAGES.length];
  }

  const rawCat = raw.category || "";
  const category = normalizeCategoryName(rawCat) || "Living Room";

  return {
    _id: raw._id,
    name: raw.name && raw.name !== "string" ? raw.name : DUMMY_PRODUCTS[index % DUMMY_PRODUCTS.length].name,
    price: raw.price || 0,
    description: raw.description && raw.description !== "string" ? raw.description : "",
    category,
    image,
  };
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [currentImage, setCurrentImage] = useState(product.image);
  const [retried, setRetried] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const handleImageError = useCallback(() => {
    if (!retried) {
      setRetried(true);
      setCurrentImage(UNIQUE_IMAGES[index % UNIQUE_IMAGES.length]);
    }
  }, [retried, index]);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [40, 0, 0, -40]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.94, 1, 1, 0.94]);

  const hoverRotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const hoverRotateY = useSpring(0, { stiffness: 180, damping: 22 });

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      hoverRotateX.set(py * -6);
      hoverRotateY.set(px * 6);
    },
    [hoverRotateX, hoverRotateY]
  );

  const handleMouseLeave = useCallback(() => {
    hoverRotateX.set(0);
    hoverRotateY.set(0);
  }, [hoverRotateX, hoverRotateY]);

  return (
    <motion.article
      ref={cardRef}
      style={{
        y: scrollY,
        opacity: scrollOpacity,
        scale: scrollScale,
        rotateX: hoverRotateX,
        rotateY: hoverRotateY,
        transformPerspective: 1000,
      }}
      whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.04] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.03)] transition-shadow duration-600 hover:shadow-[0_32px_80px_rgba(0,0,0,0.13)]"
    >
      {/* Category badge */}
      {product.category && (
        <div className="absolute left-4 top-4 z-30">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.03, duration: 0.5, ease: EASE }}
            className="inline-block rounded-full border border-white/40 bg-white/85 px-3.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-[#2C2C2C]/65 shadow-[0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          >
            {product.category.toUpperCase()}
          </motion.span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[5/4] overflow-hidden bg-[#F0EFEB]">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          priority
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.09]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          quality={100}
          onError={handleImageError}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-50 transition-opacity duration-600 group-hover:opacity-15" />

        {/* Watery light sweep */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-600 group-hover:opacity-100">
          <div className="absolute inset-y-0 -left-[220%] w-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[520%]" />
        </div>

        {/* Prismatic bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-[rgba(140,200,255,0.4)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Quick actions */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-8 items-end justify-center gap-2.5 p-6 opacity-0 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/92 px-6 py-3 text-[10px] font-semibold tracking-[0.15em] text-[#1A1A1A] shadow-[0_10px_32px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all hover:bg-white"
          >
            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.2} />
            ADD TO CART
          </motion.button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={`/product/${product._id}`}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/30 bg-white/92 shadow-[0_10px_32px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all hover:bg-white"
            >
              <Eye className="h-4 w-4 text-[#1A1A1A]" strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Card body */}
      <div className="relative flex flex-1 flex-col justify-between p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,200,255,0.12)] to-transparent" />

        <div>
          <h3 className="font-serif text-lg leading-snug tracking-wide text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#0A0A0A] sm:text-xl">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-2 text-[13px] leading-relaxed text-[#2C2C2C]/35 transition-colors duration-300 group-hover:text-[#2C2C2C]/50">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-black/[0.04] pt-4">
          <div>
            <p className="text-[9px] tracking-[0.18em] text-[#2C2C2C]/20">PRICE</p>
            <p className="mt-0.5 text-xl font-medium tracking-tight text-[#D4AF37]">
              ${product.price.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/product/${product._id}`}
            className="group/link flex items-center gap-1.5 rounded-full border border-[#2C2C2C]/[0.06] bg-[#F8F7F4] px-4 py-2 text-[10px] tracking-[0.14em] text-[#2C2C2C]/40 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]"
          >
            DETAILS
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const activeCategories = React.useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return CURATED_CATEGORIES.filter((c) => present.has(c));
  }, [products]);

  const filteredProducts = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (priceFilter === "low") return a.price - b.price;
      if (priceFilter === "high") return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const fetched: ApiProduct[] = Array.isArray(res.data) ? res.data : res.data.products || [];
        const normalized = fetched.map((p, i) => normalizeProduct(p, i));
        const combined = [...normalized, ...DUMMY_PRODUCTS];
        const unique = Array.from(new Map(combined.map((item) => [item._id, item])).values()).slice(0, 21);
        setProducts(unique);
      } catch {
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProtectedRoute>
      <MainNavbar />

      {/* ═══ HERO HEADER ═══ */}
      <div className="relative overflow-hidden bg-[#0A0B0F] pb-24 pt-32 sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-[400px] w-[400px] rounded-full bg-[rgba(140,200,255,0.06)] blur-[80px]" />
          <div className="absolute -bottom-28 -right-28 h-[320px] w-[320px] rounded-full bg-[rgba(140,200,255,0.04)] blur-[70px]" />
          <div className="absolute left-1/2 top-1/3 h-[180px] w-[600px] -translate-x-1/2 rounded-full bg-[rgba(212,175,55,0.025)] blur-[90px]" />
        </div>

        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-4xl px-5 text-center"
        >
          <motion.div variants={FADE_UP} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5">
            <Sparkles className="h-3 w-3 text-[#D4AF37]" strokeWidth={2} />
            <span className="text-[10px] tracking-[0.25em] text-white/40">HANDPICKED COLLECTION</span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="font-serif text-5xl leading-[1.1] tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            Curated{" "}
            <span className="relative italic text-[#D4AF37]">
              Elegance
              <motion.span
                className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/40"
          >
            Each piece represents a perfect symphony of timeless design, luxury
            materials, and unparalleled comfort.
          </motion.p>

          <motion.div variants={FADE_UP} className="mt-10 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-light text-white/80">{products.length || "—"}</p>
              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/25">PIECES</p>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center">
              <p className="text-2xl font-light text-white/80">{activeCategories.length || "—"}</p>
              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/25">CATEGORIES</p>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Package className="h-4 w-4 text-[#D4AF37]/60" strokeWidth={1.5} />
              </div>
              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/25">FREE SHIPPING</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ SEARCH + FILTER BAR ═══ */}
      <div className="relative z-20 mx-auto -mt-7 w-[92%] max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/92 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.07)] backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:p-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C2C2C]/25" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm text-[#2C2C2C] outline-none placeholder:text-[#2C2C2C]/25 sm:rounded-full"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2C2C2C]/25" strokeWidth={2} />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl bg-[#F5F4F0] py-3 pl-9 pr-8 text-[11px] font-medium tracking-[0.1em] text-[#2C2C2C]/55 outline-none sm:w-auto sm:rounded-full"
            >
              <option value="all">ALL PRICES</option>
              <option value="low">LOW — HIGH</option>
              <option value="high">HIGH — LOW</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* ═══ CATEGORY TABS ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="mx-auto w-full max-w-[96rem] px-5 pt-10 sm:px-6 lg:px-10 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            className="flex flex-wrap items-center gap-2"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-5 py-2 text-[10px] tracking-[0.15em] font-medium transition-all duration-300 ${
                activeCategory === "all"
                  ? "border border-[#D4AF37]/25 bg-[#D4AF37]/8 text-[#B8860B] shadow-[0_2px_12px_rgba(212,175,55,0.08)]"
                  : "border border-transparent text-[#2C2C2C]/30 hover:bg-black/[0.02] hover:text-[#2C2C2C]/50"
              }`}
            >
              ALL
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-[10px] tracking-[0.15em] font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "border border-[#D4AF37]/25 bg-[#D4AF37]/8 text-[#B8860B] shadow-[0_2px_12px_rgba(212,175,55,0.08)]"
                    : "border border-transparent text-[#2C2C2C]/30 hover:bg-black/[0.02] hover:text-[#2C2C2C]/50"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ═══ PRODUCT GRID ═══ */}
        <div className="mx-auto w-full max-w-[96rem] px-5 pb-24 pt-10 sm:px-6 sm:pb-32 lg:px-10 xl:px-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] border border-black/[0.03] bg-white"
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-black/[0.02] to-transparent" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Search className="mb-4 h-8 w-8 text-[#2C2C2C]/12" strokeWidth={1.5} />
              <p className="text-sm text-[#2C2C2C]/25">No products match your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); setPriceFilter("all"); }}
                className="mt-4 text-[11px] tracking-[0.12em] text-[#D4AF37] transition-opacity hover:opacity-70"
              >
                CLEAR FILTERS
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </ProtectedRoute>
  );
}
