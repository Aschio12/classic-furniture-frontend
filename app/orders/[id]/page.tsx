"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderTracker from "@/components/shared/OrderTracker";
import MainNavbar from "@/components/shared/MainNavbar";
import Footer from "@/components/shared/Footer";

const BACKEND_URL = "https://classic-furniture-backend.onrender.com";

interface OrderItem {
  product: {
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "Pending"
    | "Paid"
    | "Shipped"
    | "Arrived at Hub"
    | "Completed"
    | "Cancelled"
    | "Payout Failed";
  pickupHub: string;
  createdAt: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const STATUS_STYLES: Record<string, string> = {
  Paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Shipped: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  "Arrived at Hub": "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Cancelled: "border-red-500/20 bg-red-500/10 text-red-400",
  "Payout Failed": "border-red-500/20 bg-red-500/10 text-red-400",
};

function resolveImageUrl(url: string): string {
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return url;
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const handleConfirmDelivery = async () => {
    if (!verificationCode.trim()) {
      setConfirmError("Please enter the verification code.");
      return;
    }
    setConfirming(true);
    setConfirmError("");
    try {
      await api.patch("/orders/confirm", {
        orderId: id,
        verificationCode: verificationCode.trim(),
      });
      setConfirmSuccess(true);
      setOrder((prev) =>
        prev ? { ...prev, status: "Completed" } : prev
      );
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setConfirmError(
        axiosErr?.response?.data?.message || "Confirmation failed. Please try again."
      );
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]/40" strokeWidth={1.5} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAF8]">
        <Package className="h-12 w-12 text-[#2C2C2C]/10" strokeWidth={1.2} />
        <h1 className="font-serif text-2xl text-[#2C2C2C]">Order Not Found</h1>
        <p className="text-sm text-[#2C2C2C]/40">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link
          href="/profile"
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-[#D4AF37] transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          BACK TO PROFILE
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <MainNavbar />

      {/* ═══ DARK HERO HEADER ═══ */}
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
          <motion.div
            variants={FADE_UP}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5"
          >
            <Package className="h-3 w-3 text-[#D4AF37]" strokeWidth={2} />
            <span className="text-[10px] tracking-[0.25em] text-white/40">
              ORDER TRACKING
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="font-serif text-5xl leading-[1.1] tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            Order{" "}
            <span className="relative italic text-[#D4AF37]">
              Details
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
            Tracking ID:{" "}
            <span className="font-mono text-white/55">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </motion.p>

          <motion.div variants={FADE_UP} className="mt-6">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.12em] ${
                STATUS_STYLES[order.status] ||
                "border-gray-500/20 bg-gray-500/10 text-gray-400"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-16 sm:px-6 lg:px-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-8"
          >
            <Link
              href="/profile"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#2C2C2C]/35 transition-colors duration-300 hover:text-[#D4AF37]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2} />
              BACK TO PROFILE
            </Link>
          </motion.div>

          {/* ── Order Tracker ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-12 flex justify-center overflow-x-auto rounded-2xl border border-black/[0.04] bg-white px-4 py-8 shadow-[0_2px_24px_rgba(0,0,0,0.04)] sm:px-8"
          >
            <OrderTracker status={order.status} />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Order Items ── */}
            <motion.div
              variants={STAGGER}
              initial="hidden"
              animate="visible"
              className="space-y-4 lg:col-span-2"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/8">
                  <Package className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-xl tracking-wide text-[#2C2C2C]">
                  Items
                </h2>
                <span className="ml-auto rounded-full border border-[#2C2C2C]/[0.06] bg-[#F5F4F0] px-3 py-1 text-[10px] tracking-[0.12em] text-[#2C2C2C]/35">
                  {order.items.length} ITEM{order.items.length !== 1 ? "S" : ""}
                </span>
              </div>

              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={FADE_UP}
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#D4AF37]/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:gap-5 sm:p-5"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F0EFEB] sm:h-24 sm:w-24">
                    {item.product.images?.[0] ? (
                      <Image
                        src={resolveImageUrl(item.product.images[0])}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-[#2C2C2C]/10" strokeWidth={1.2} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-serif text-base tracking-wide text-[#2C2C2C] sm:text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-[13px] text-[#2C2C2C]/35">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] tracking-[0.15em] text-[#2C2C2C]/20">
                      PRICE
                    </p>
                    <p className="text-lg font-medium tracking-tight text-[#D4AF37]">
                      {item.priceAtPurchase.toLocaleString()} ETB
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Sidebar: Delivery Info + Confirmation ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="space-y-6 lg:col-span-1"
            >
              {/* Delivery Info */}
              <div className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                <div className="border-b border-black/[0.04] px-6 py-4">
                  <h2 className="font-serif text-lg tracking-wide text-[#2C2C2C]">
                    Delivery Info
                  </h2>
                </div>

                <div className="space-y-4 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]/60" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] tracking-[0.12em] text-[#2C2C2C]/25">
                        PICKUP HUB
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-[#2C2C2C]/70">
                        {order.pickupHub}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]/60" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] tracking-[0.12em] text-[#2C2C2C]/25">
                        PAYMENT STATUS
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] ${
                          STATUS_STYLES[order.status] ||
                          "border-gray-500/20 bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {order.createdAt && (
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]/60" strokeWidth={1.5} />
                      <div>
                        <p className="text-[10px] tracking-[0.12em] text-[#2C2C2C]/25">
                          ORDER DATE
                        </p>
                        <p className="mt-0.5 text-sm text-[#2C2C2C]/60">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-black/[0.04] pt-4">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-medium text-[#2C2C2C]/50">
                        Total
                      </span>
                      <span className="text-2xl font-medium tracking-tight text-[#D4AF37]">
                        {order.totalAmount.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Confirm Delivery Section ── */}
              {order.status === "Arrived at Hub" && !confirmSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                  className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-white shadow-[0_2px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="border-b border-emerald-500/10 bg-emerald-500/[0.03] px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                      <h3 className="font-serif text-base tracking-wide text-[#2C2C2C]">
                        Confirm Delivery
                      </h3>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#2C2C2C]/40">
                      Enter the verification code you received to confirm pickup.
                    </p>
                  </div>

                  <div className="px-6 py-5">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setConfirmError("");
                      }}
                      placeholder="Enter verification code"
                      className="w-full rounded-xl border border-black/[0.06] bg-[#FAFAF8] px-4 py-3 text-center font-mono text-sm tracking-[0.15em] text-[#2C2C2C] outline-none transition-all duration-300 placeholder:text-[#2C2C2C]/20 focus:border-[#D4AF37]/30 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]"
                    />

                    {confirmError && (
                      <div className="mt-3 flex items-center gap-2 text-[12px] text-red-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        {confirmError}
                      </div>
                    )}

                    <button
                      onClick={handleConfirmDelivery}
                      disabled={confirming}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-[10px] font-semibold tracking-[0.18em] text-white shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50"
                    >
                      {confirming ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                          CONFIRM DELIVERY
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Success state */}
              {confirmSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] px-6 py-8"
                >
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
                  <p className="font-serif text-lg text-[#2C2C2C]">
                    Delivery Confirmed
                  </p>
                  <p className="text-center text-[13px] text-[#2C2C2C]/40">
                    Your order has been marked as completed. Thank you!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </ProtectedRoute>
  );
}
