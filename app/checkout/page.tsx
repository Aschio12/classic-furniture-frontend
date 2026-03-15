"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  Package,
} from "lucide-react";

import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainNavbar from "@/components/shared/MainNavbar";
import Footer from "@/components/shared/Footer";

const ease = [0.22, 1, 0.36, 1];

const hubs = [
  { name: "Addis Ababa", label: "Central Hub", tag: "Fastest" },
  { name: "Adama", label: "East Station", tag: "Next Day" },
  { name: "Hawassa", label: "South Hub", tag: "2-3 Days" },
  { name: "Bahir Dar", label: "North West", tag: "3-4 Days" },
  { name: "Dire Dawa", label: "East Hub", tag: "2-3 Days" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [selectedHub, setSelectedHub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  const handlePayment = async () => {
    if (!selectedHub) {
      setError("Please select a pickup hub.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutRes = await api.post("/orders/checkout", {
        paymentMethod: "Telebirr",
        transactionReference: `web_${Date.now()}`,
        pickupHub: selectedHub,
      });

      const orderId = checkoutRes.data?.order?._id;
      if (!orderId) throw new Error("Order creation failed.");

      const paymentRes = await api.post("/payments/initialize", { orderId });
      const checkoutUrl = paymentRes.data?.checkout_url;

      if (!checkoutUrl) throw new Error("Payment initialization failed.");

      clearCart();
      window.location.href = checkoutUrl;
    } catch {
      setError("Payment setup failed. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <MainNavbar />

      {/* Dark hero header */}
      <section className="relative overflow-hidden bg-[#0A0B0F] pt-32 pb-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              Secure Checkout
            </p>
            <h1 className="font-serif text-4xl font-light tracking-tight text-white sm:text-5xl">
              Checkout
            </h1>
            <div className="mt-6 flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
              <span className="h-4 w-px bg-white/10" />
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Encrypted & Secure
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#FAFAF8] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-16">
          {/* Left — Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="border-b border-[#2C2C2C]/10 pb-4">
              <h2 className="font-serif text-xl font-medium tracking-wide text-[#2C2C2C]">
                Order Summary
              </h2>
            </div>

            <div className="space-y-1">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                    className="flex items-center justify-between rounded-xl px-4 py-4 transition-colors hover:bg-[#2C2C2C]/[0.03]"
                  >
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-[#2C2C2C]/5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#2C2C2C]/5">
                          <Package className="h-6 w-6 text-[#2C2C2C]/20" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-[#2C2C2C]">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-[#2C2C2C]/50">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#2C2C2C]">
                      ETB{" "}
                      {(item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-3 border-t border-[#2C2C2C]/10 pt-6">
              <div className="flex justify-between text-sm text-[#2C2C2C]/60">
                <span>Subtotal</span>
                <span>
                  ETB{" "}
                  {subtotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-[#2C2C2C]/60">
                <span>Pickup</span>
                <span className="text-[#D4AF37]">Free</span>
              </div>
              <div className="flex items-end justify-between border-t border-dashed border-[#2C2C2C]/10 pt-4">
                <span className="text-base font-medium text-[#2C2C2C]">
                  Total
                </span>
                <span className="font-serif text-2xl font-semibold text-[#2C2C2C]">
                  ETB{" "}
                  {subtotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Security badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-5"
            >
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
              <div>
                <p className="text-sm font-medium text-[#2C2C2C]">
                  Chapa Escrow Protection
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2C2C]/50">
                  Your payment is held securely by Chapa until you confirm
                  pickup. Full refund if anything goes wrong.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Hub Selection & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="border-b border-[#2C2C2C]/10 pb-4">
              <h2 className="font-serif text-xl font-medium tracking-wide text-[#2C2C2C]">
                Select Pickup Hub
              </h2>
              <p className="mt-1 text-sm text-[#2C2C2C]/50">
                Choose the nearest hub for furniture collection
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {hubs.map((hub, i) => {
                const isSelected = selectedHub === hub.name;
                return (
                  <motion.button
                    key={hub.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.06 }}
                    onClick={() => {
                      setSelectedHub(hub.name);
                      setError(null);
                    }}
                    className={`group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-[#D4AF37] bg-[#D4AF37]/[0.06] shadow-lg shadow-[#D4AF37]/5"
                        : "border-transparent bg-white shadow-sm hover:border-[#2C2C2C]/10 hover:shadow-md"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin
                          className={`h-4 w-4 ${isSelected ? "text-[#D4AF37]" : "text-[#2C2C2C]/30"}`}
                        />
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#2C2C2C]">
                          {hub.name}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-xs text-[#2C2C2C]/50">
                      {hub.label}
                    </span>
                    <span
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider ${
                        isSelected
                          ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                          : "bg-[#2C2C2C]/5 text-[#2C2C2C]/50"
                      }`}
                    >
                      <Truck className="h-3 w-3" />
                      {hub.tag}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Payment button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.6 }}
              onClick={handlePayment}
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-full bg-[#0A0B0F] py-5 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-[#0A0B0F]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="h-5 w-5 animate-spin text-[#D4AF37]"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Securing Transaction…
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-500 group-hover:scale-[1.02]">
                  Proceed to Payment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>

            <p className="text-center text-xs text-[#2C2C2C]/40">
              You&apos;ll be redirected to Chapa to complete payment securely.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </ProtectedRoute>
  );
}
