"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, X, Loader2, ArrowRight } from "lucide-react";

import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";

const triggerCelebration = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
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

// Wrapper component to use useSearchParams inside Suspense
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const tx_ref = searchParams.get("tx_ref") || searchParams.get("transaction_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
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
        // Call our backend to verify against Chapa
        const { data } = await api.get(`/payments/verify/${tx_ref}`);

        if (mounted) {
          if (data.status === "success" || data.status === "Paid") {
            setStatus("success");
            setOrderId(data.data?.orderId);
            clearCart(); // Clear the cart now that payment is confirmed
            triggerCelebration();
          } else {
            setStatus("error");
            setErrorMessage("Payment verification returned unexpected status.");
          }
        }
      } catch (error: unknown) {
        console.error("Verification error:", error);
        if (mounted) {
          setStatus("error");
          const typedError = error as { response?: { data?: { message?: string } } };
          setErrorMessage(
            typedError.response?.data?.message || "Failed to verify transaction."
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
    <div className="flex flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {status === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-primary/10" />
              <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-primary">Verifying Payment</h2>
              <p className="mt-2 text-primary/60">
                Please wait while we confirm your transaction...
              </p>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-green-500/20"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-4xl font-light tracking-tight text-primary">
                Order Confirmed!
              </h2>
              <p className="max-w-md text-primary/60">
                Thank you for your purchase. Your payment has been successfully
                processed and your order is being prepared.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push(orderId ? `/orders/${orderId}` : "/shop")}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="relative z-10 flex items-center gap-2 font-medium">
                  {orderId ? "Track your Furniture" : "Continue Shopping"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
                {/* Liquid hover effect */}
                <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-primary">Verification Failed</h2>
              <p className="mt-2 max-w-md text-red-500/80">{errorMessage}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-primary/20 bg-white px-6 py-2 text-sm font-medium text-primary hover:bg-primary/5"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F9F9FB] px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
          </div>
        }
      >
        <PaymentStatusContent />
      </Suspense>
    </main>
  );
}
