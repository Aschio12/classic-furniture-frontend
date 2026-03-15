"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  Shield,
  MapPin,
  ArrowLeft,
  Check,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import MainNavbar from "@/components/shared/MainNavbar";
import Footer from "@/components/shared/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const HUBS = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar", "Dire Dawa"] as const;

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=90&w=1400",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=90",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  seller?: string;
};

function isValidImageUrl(url?: string): boolean {
  if (!url || url === "string") return false;
  if (url.startsWith("https://example.com")) return false;
  if (url.startsWith("http") || url.startsWith("/")) return true;
  return false;
}

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return url.startsWith("/")
    ? `https://classic-furniture-backend.onrender.com${url}`
    : `https://classic-furniture-backend.onrender.com/${url}`;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedHub, setSelectedHub] = useState<(typeof HUBS)[number] | "">("");
  const [activeImage, setActiveImage] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const productImage = useMemo(() => {
    if (imgError) {
      return FALLBACK_IMAGES[Math.abs(params.id?.charCodeAt(0) ?? 0) % FALLBACK_IMAGES.length];
    }
    if (isValidImageUrl(product?.imageUrl)) {
      return resolveImageUrl(product!.imageUrl!);
    }
    return FALLBACK_IMAGES[Math.abs(params.id?.charCodeAt(0) ?? 0) % FALLBACK_IMAGES.length];
  }, [product?.imageUrl, imgError, params.id]);

  const gallery = useMemo(() => {
    const base = productImage;
    const extras = FALLBACK_IMAGES.filter((img) => img !== base).slice(0, 2);
    return [base, ...extras];
  }, [productImage]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get("/products");
        const list: Product[] = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        const found = list.find((item) => item._id === params.id);
        if (active) {
          setProduct(found || null);
          if (!found) setError("Product not found.");
        }
      } catch {
        if (active) setError("Failed to load product.");
      } finally {
        if (active) setPageLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [params.id]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAddToCart = async () => {
    if (!token) { setError("Please sign in to continue."); return; }
    if (!product) return;

    setCartLoading(true);
    setError(null);
    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });
      showToast("Added to cart successfully!");
    } catch {
      setError("Failed to add to cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!token) { setError("Please sign in to continue."); return; }
    if (!product) { setError("Product not available."); return; }
    if (!selectedHub) { setError("Please select a pickup hub."); return; }

    setBuyLoading(true);
    setError(null);

    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });

      const checkoutResponse = await api.post("/orders/checkout", {
        paymentMethod: "Telebirr",
        transactionReference: `web_${Date.now()}`,
        pickupHub: selectedHub,
      });

      const orderId = checkoutResponse.data?.order?._id;
      if (!orderId) throw new Error("Order creation failed");

      const paymentResponse = await api.post("/payments/initialize", { orderId });
      const checkoutUrl = paymentResponse.data?.checkout_url;

      if (checkoutUrl) {
        router.push(checkoutUrl);
        return;
      }
      throw new Error("Payment initialization failed");
    } catch {
      setError("Unable to start checkout. Please try again.");
    } finally {
      setBuyLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <ProtectedRoute>
        <MainNavbar />
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37]" />
            <p className="text-xs tracking-[0.2em] text-[#2C2C2C]/40">LOADING</p>
          </motion.div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }

  if (!product && !pageLoading) {
    return (
      <ProtectedRoute>
        <MainNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center"
          >
            <p className="text-lg text-[#2C2C2C]/50">Product not found</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[#D4AF37] transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </motion.div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainNavbar />

      {/* ═══ TOAST ═══ */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed left-1/2 top-24 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-emerald-200/60 bg-white px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm font-medium text-[#2C2C2C]">{toast}</span>
          </div>
        </motion.div>
      )}

      {/* ═══ DARK HERO HEADER ═══ */}
      <section className="relative overflow-hidden bg-[#0A0B0F] pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-[400px] w-[400px] rounded-full bg-[rgba(140,200,255,0.06)] blur-[80px]" />
          <div className="absolute -bottom-28 -right-28 h-[320px] w-[320px] rounded-full bg-[rgba(140,200,255,0.04)] blur-[70px]" />
          <div className="absolute left-1/2 top-1/3 h-[180px] w-[600px] -translate-x-1/2 rounded-full bg-[rgba(212,175,55,0.025)] blur-[90px]" />
        </div>

        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl px-5 text-center"
        >
          {/* Breadcrumb */}
          <motion.div variants={FADE_UP} className="mb-6 flex items-center justify-center gap-2 text-[11px] tracking-[0.15em] text-white/30">
            <Link href="/shop" className="transition-colors hover:text-white/50">
              SHOP
            </Link>
            <ChevronRight className="h-3 w-3" />
            {product?.category && (
              <>
                <span className="uppercase">{product.category}</span>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-white/50">DETAILS</span>
          </motion.div>

          <motion.div variants={FADE_UP} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5">
            <Sparkles className="h-3 w-3 text-[#D4AF37]" strokeWidth={2} />
            <span className="text-[10px] tracking-[0.25em] text-white/40">SIGNATURE PIECE</span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl leading-[1.1] tracking-wide text-white sm:text-5xl md:text-6xl"
          >
            {product?.name}
          </motion.h1>

          {product?.category && (
            <motion.p variants={FADE_UP} className="mt-4 text-[13px] tracking-[0.15em] text-white/30">
              {product.category.toUpperCase()} COLLECTION
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ═══ PRODUCT DETAIL SECTION ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

            {/* LEFT — IMAGE GALLERY */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="space-y-5"
            >
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-black/[0.04] bg-[#F0EFEB] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                <Image
                  src={gallery[activeImage]}
                  alt={product?.name || "Luxury furniture"}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                  onError={() => setImgError(true)}
                />
                {/* Light sweep on hover */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-600 group-hover:opacity-100">
                  <div className="absolute inset-y-0 -left-[220%] w-[100%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[520%]" />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square w-20 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      activeImage === index
                        ? "border-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.15)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      quality={70}
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — PRODUCT DETAILS */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Category badge */}
              {product?.category && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                  className="mb-4 inline-block w-fit rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#B8860B]"
                >
                  {product.category.toUpperCase()}
                </motion.span>
              )}

              {/* Name */}
              <h2 className="font-serif text-3xl leading-tight tracking-wide text-[#1A1A1A] sm:text-4xl">
                {product?.name}
              </h2>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-medium tracking-tight text-[#D4AF37]">
                  ETB {product?.price?.toLocaleString()}
                </span>
                <span className="text-xs tracking-[0.1em] text-[#2C2C2C]/30">.00</span>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.04] to-transparent" />

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-[#2C2C2C]/55">
                {product?.description || "Impeccable craftsmanship with timeless finishes. Each piece is carefully curated to bring elegance and comfort to your living space."}
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { icon: Truck, label: "Free Delivery" },
                  { icon: Shield, label: "Quality Guaranteed" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-full border border-black/[0.04] bg-white px-4 py-2">
                    <Icon className="h-3.5 w-3.5 text-[#D4AF37]" strokeWidth={2} />
                    <span className="text-[11px] tracking-[0.08em] text-[#2C2C2C]/50">{label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.04] to-transparent" />

              {/* Hub selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" strokeWidth={2} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2C2C2C]/60">
                    Select Pickup Hub
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {HUBS.map((hub) => (
                    <motion.button
                      key={hub}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedHub(hub); setError(null); }}
                      className={`rounded-2xl border px-4 py-3 text-left text-[12px] font-medium transition-all duration-300 ${
                        selectedHub === hub
                          ? "border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#B8860B] shadow-[0_2px_12px_rgba(212,175,55,0.1)]"
                          : "border-black/[0.06] bg-white text-[#2C2C2C]/50 hover:border-[#D4AF37]/20 hover:text-[#2C2C2C]/70"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedHub === hub && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <Check className="h-3 w-3 text-[#D4AF37]" strokeWidth={3} />
                          </motion.span>
                        )}
                        {hub}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleBuyNow}
                  disabled={buyLoading}
                  className="relative flex-1 overflow-hidden rounded-2xl bg-[#0A0B0F] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_24px_56px_rgba(0,0,0,0.3)] disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {buyLoading ? "Processing..." : "Buy Now — Telebirr"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8860B] transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 disabled:opacity-60 sm:flex-none"
                >
                  <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </motion.button>
              </div>

              {/* Back to shop link */}
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#2C2C2C]/35 transition-colors duration-300 hover:text-[#D4AF37]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                BACK TO COLLECTION
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </ProtectedRoute>
  );
}
