"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

const hubs = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar", "Dire Dawa"] as const;

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedHub, setSelectedHub] = useState<(typeof hubs)[number] | "">("");
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gallery = useMemo(() => {
    const fallback = "/images/hero-furniture.jpg";
    const base = product?.imageUrl || fallback;
    return [base, base, base];
  }, [product?.imageUrl]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get("/products");
        const found = (response.data || []).find((item: Product) => item._id === params.id);
        if (active) {
          setProduct(found || null);
        }
      } catch (err) {
        if (active) setError("Failed to load product.");
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  const handleBuyNow = async () => {
    if (!token) {
      setError("Please sign in to continue.");
      return;
    }
    if (!product) {
      setError("Product not available.");
      return;
    }
    if (!selectedHub) {
      setError("Please select a hub for pickup.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });

      const checkoutResponse = await api.post("/orders/checkout", {
        paymentMethod: "Telebirr",
        transactionReference: `web_${Date.now()}`,
        pickupHub: selectedHub,
      });

      const orderId = checkoutResponse.data?.order?._id;
      if (!orderId) {
        throw new Error("Order creation failed");
      }

      const paymentResponse = await api.post("/payments/initialize", { orderId });
      const checkoutUrl = paymentResponse.data?.checkout_url;

      if (checkoutUrl) {
        router.push(checkoutUrl);
        return;
      }

      throw new Error("Payment initialization failed");
    } catch (err) {
      setError("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface">
            <Image
              src={gallery[activeImage]}
              alt={product?.name || "Luxury furniture"}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-4">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={`relative h-20 w-16 overflow-hidden rounded-xl border ${
                  activeImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setActiveImage(index)}
                aria-label="Select image"
              >
                <Image src={image} alt="Gallery thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60">Signature Piece</span>
            <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
              {product?.name || "Loading..."}
            </h1>
            <p className="text-primary/70">
              {product?.description || "Impeccable craftsmanship with timeless finishes."}
            </p>
            <div className="text-2xl font-semibold text-primary">
              ETB {product?.price?.toFixed(2) || "0.00"}
            </div>
          </motion.div>

          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
              Select Pickup Hub
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {hubs.map((hub) => (
                <button
                  key={hub}
                  onClick={() => setSelectedHub(hub)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedHub === hub
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-primary/10 text-primary/70 hover:border-primary/40"
                  }`}
                >
                  {hub}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="relative w-full overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-background shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
