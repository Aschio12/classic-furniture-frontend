"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/useAuthStore";

const hubs = [
  { name: "Addis Ababa", label: "Central Hub", tag: "Fastest Pickup" },
  { name: "Adama", label: "East Station", tag: "Next Day" },
  { name: "Hawassa", label: "South Hub", tag: "2-3 Days" },
  { name: "Bahir Dar", label: "North West", tag: "3-4 Days" },
  { name: "Dire Dawa", label: "East Hub", tag: "2-3 Days" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [selectedHub, setSelectedHub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
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
      // 1. Create Order
      const checkoutRes = await api.post("/orders/checkout", {
        paymentMethod: "Telebirr",
        transactionReference: `manual_${Date.now()}`,
        pickupHub: selectedHub,
      });

      const orderId = checkoutRes.data?.order?._id;
      if (!orderId) throw new Error("Order creation failed");

      // 2. Initialize Payment
      const paymentRes = await api.post("/payments/initialize", { orderId });
      const checkoutUrl = paymentRes.data?.checkout_url;

      if (!checkoutUrl) throw new Error("Payment initialization failed");

      // 3. Clear cart and redirect
      clearCart();
      router.push(checkoutUrl);
    } catch (err) {
      setError("Payment setup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-background pt-24 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="space-y-8">
          <div className="border-b border-primary/10 pb-4">
            <h2 className="text-xl font-semibold uppercase tracking-widest text-primary">
              Order Summary
            </h2>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-2">
                <div>
                  <h3 className="font-medium text-primary">{item.name}</h3>
                  <p className="text-sm text-primary/60">Qty: {item.quantity}</p>
                </div>
                <div className="font-semibold text-primary">ETB {item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-primary/10 pt-6">
            <span className="text-lg font-medium text-primary">Total</span>
            <span className="text-2xl font-bold text-primary">ETB {totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4 text-sm text-primary/70">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <p>Payments are secured by Chapa & held in escrow until pickup.</p>
          </div>
        </div>

        {/* Hub Selection & Payment */}
        <div className="space-y-8">
          <div className="border-b border-primary/10 pb-4">
            <h2 className="text-xl font-semibold uppercase tracking-widest text-primary">
              Select Pickup Hub
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {hubs.map((hub) => (
              <button
                key={hub.name}
                onClick={() => setSelectedHub(hub.name)}
                className={`group relative flex flex-col items-start gap-2 rounded-xl border p-5 transition-all duration-300 ${
                  selectedHub === hub.name
                    ? "border-primary bg-primary text-white shadow-xl"
                    : "border-primary/10 bg-white hover:border-primary/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-wider opacity-80">
                    {hub.name}
                  </span>
                  {selectedHub === hub.name && <CheckCircle2 className="h-5 w-5 text-accent" />}
                </div>
                <div className="text-xs font-light opacity-60">{hub.label}</div>
                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-wider ${
                    selectedHub === hub.name
                      ? "bg-white/10 text-accent"
                      : "bg-primary/5 text-primary/60"
                  }`}
                >
                  <Truck className="h-3 w-3" /> {hub.tag}
                </span>
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-full bg-primary py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="h-5 w-5 animate-spin text-accent" viewBox="0 0 24 24">
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
                Securing Transaction...
              </span>
            ) : (
              <span className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                Proceed to Payment
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
