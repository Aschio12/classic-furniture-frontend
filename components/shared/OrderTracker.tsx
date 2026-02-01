"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Paid"
  | "Shipped"
  | "Arrived at Hub"
  | "Completed"
  | "Cancelled"
  | "Payout Failed";

type OrderTrackerProps = {
  status: OrderStatus;
};

const steps = [
  { label: "Payment Confirmed", status: "Paid" },
  { label: "Shipped by Seller", status: "Shipped" },
  { label: "Arrived at Hub", status: "Arrived at Hub" },
  { label: "Ready for Pickup", status: "Completed" }, // Use Completed as alias for ready/done for UI purposes
];

export default function OrderTracker({ status }: OrderTrackerProps) {
  const currentIndex = steps.findIndex((step) => step.status === status);
  // If status is not in the list (e.g., Pending, Cancelled), handle mostly logic:
  // For Pending: index -1. For others, treat as partial.
  // Here we map exact status match.
  // Note: Backend might return 'Pending' or 'Payout Failed' which are not in the display timeline.
  // We'll treat Pending as index -1 (no steps done).

  const activeIndex =
    status === "Completed" ? 3 : steps.findIndex((s) => s.status === status);

  return (
    <div className="w-full max-w-3xl py-10">
      <div className="relative flex items-center justify-between">
        {/* Background Grey Line */}
        <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-primary/10" />

        {/* Liquid Progress Bar */}
        <motion.div
          className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-green-500/80"
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.label} className="relative flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted ? "#22c55e" : "#f7f6f2", // sage green vs surface
                  borderColor: isCompleted ? "#22c55e" : "#e5e7eb",
                }}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-500`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-primary/20" />
                )}

                {/* Pulse Glow for Current Step */}
                {isCurrent && (
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-green-400/30 blur-md"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>

              <div className="absolute top-10 w-32 text-center text-xs font-medium uppercase tracking-wider text-primary">
                <span
                  className={`transition-opacity duration-500 ${
                    isCompleted ? "opacity-100" : "opacity-40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
