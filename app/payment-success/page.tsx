"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, X, Loader2, ArrowRight, ShoppingBag } from "lucide-react";

import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainNavbar from "@/components/shared/MainNavbar";

const ease = [0.22, 1, 0.36, 1];

const triggerCelebration = () => {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 80,
    zIndex: 9999,
    colors: ["#D4AF37", "#FFD700", "#FFF8DC", "#0A0B0F", "#FFFFFF"],
  };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const tx_ref =
    searchParams.get("tx_ref") || searchParams.get("transaction_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function verifyPayment() {
      if (!tx_ref) {
        if (mounted) {
          setStatus("error");
          setErrorMessage("No transaction reference found.");
        }
        return;
      }

      try {
        const { data } = await api.get(`/payments/verify/${tx_ref}`);

        if (mounted) {
          if (data.status === "success" || data.status === "Paid") {
            setStatus("success");
            setOrderId(data.data?.orderId);
            clearCart();
            triggerCelebration();
          } else {
            setStatus("error");
            setErrorMessage(
              "Payment verification returned an unexpected status."
            );
          }
        }
      } catch (error: unknown) {
        console.error("Verification error:", error);
        if (mounted) {
          setStatus("error");
          const typedError = error as {
            response?: { data?: { message?: string } };
          };
          setErrorMessage(
            typedError.response?.data?.message ||
              "Failed to verify transaction."
          );
        }
      }
    }

    verifyPayment();
    return () => {
      mounted = false;
    };
  }, [tx_ref, clearCart]);

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {/* Verifying */}
        {status === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-28 w-28 rounded-full border-4 border-[#2C2C2C]/10 border-t-[#D4AF37]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-light text-[#2C2C2C]">
                Verifying Payment
              </h2>
              <p className="mt-3 text-sm text-[#2C2C2C]/50">
                Please wait while we confirm your transaction with Chapa…
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="h-2 w-2 rounded-full bg-[#D4AF37]"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Success */}
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.9, bounce: 0.3 }}
            className="flex max-w-lg flex-col items-center gap-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500 shadow-2xl shadow-green-500/25">
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: 2,
                  repeatDelay: 0.5,
                }}
                className="absolute inset-0 rounded-full border-2 border-green-400"
              />
            </motion.div>

            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease }}
                className="font-serif text-4xl font-light tracking-tight text-[#2C2C2C] sm:text-5xl"
              >
                Order Confirmed!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#2C2C2C]/55 leading-relaxed"
              >
                Thank you for your purchase. Your payment has been successfully
                processed and your furniture is being prepared for pickup.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease }}
              className="flex flex-col items-center gap-4 sm:flex-row"
            >
              <button
                onClick={() =>
                  router.push(orderId ? `/orders/${orderId}` : "/shop")
                }
                className="group flex items-center gap-2 rounded-full bg-[#0A0B0F] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-[#0A0B0F]/20"
              >
                {orderId ? "Track Your Order" : "Continue Shopping"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
              {orderId && (
                <button
                  onClick={() => router.push("/shop")}
                  className="flex items-center gap-2 rounded-full border border-[#2C2C2C]/15 px-6 py-3.5 text-sm font-medium text-[#2C2C2C]/70 transition-colors hover:bg-[#2C2C2C]/5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </button>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Error */}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="flex max-w-md flex-col items-center gap-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50 shadow-lg shadow-red-100"
            >
              <X className="h-12 w-12 text-red-500" strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-light text-[#2C2C2C]">
                Verification Failed
              </h2>
              <p className="text-sm leading-relaxed text-red-500/80">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-[#0A0B0F] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="rounded-full border border-[#2C2C2C]/15 px-6 py-3 text-sm font-medium text-[#2C2C2C]/60 transition-colors hover:bg-[#2C2C2C]/5"
              >
                Back to Shop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ProtectedRoute>
      <MainNavbar />
      <main className="min-h-screen bg-[#FAFAF8] pt-24">
        <Suspense
          fallback={
            <div className="flex min-h-[70vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            </div>
          }
        >
          <PaymentStatusContent />
        </Suspense>
      </main>
    </ProtectedRoute>
  );
}
