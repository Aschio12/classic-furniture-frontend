"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Package,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainNavbar from "@/components/shared/MainNavbar";
import Footer from "@/components/shared/Footer";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  pickupHub: string;
  createdAt: string;
  items: Array<{ product: { name: string }; quantity: number }>;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleSignOut = () => {
    logout();
    try {
      router.push("/");
    } catch {
      // fallback no-op
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <div className="rounded-2xl border border-[#2C2C2C]/5 bg-white p-10 shadow-sm">
          <p className="text-sm text-[#2C2C2C]/50">
            No profile found. Please sign in.
          </p>
        </div>
      </main>
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
            <User className="h-3 w-3 text-[#D4AF37]" strokeWidth={2} />
            <span className="text-[10px] tracking-[0.25em] text-white/40">
              ACCOUNT
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="font-serif text-5xl leading-[1.1] tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            Your{" "}
            <span className="relative italic text-[#D4AF37]">
              Profile
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
            Manage your account details and track your furniture orders.
          </motion.p>
        </motion.div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-16 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── User Info Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="lg:col-span-1"
            >
              <div className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                {/* Card header accent */}
                <div className="h-24 bg-gradient-to-br from-[#0A0B0F] via-[#12141b] to-[#0A0B0F]">
                  <div className="flex h-full items-end justify-center">
                    <div className="translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#D4AF37]/30 bg-[#0A0B0F] shadow-lg">
                      <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-12 text-center">
                  <h2 className="font-serif text-xl tracking-wide text-[#2C2C2C]">
                    {user.name}
                  </h2>
                  <p className="mt-1 text-[11px] tracking-[0.15em] text-[#2C2C2C]/30">
                    {user.role?.toUpperCase()}
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-[#FAFAF8] px-4 py-3">
                      <Mail className="h-4 w-4 text-[#D4AF37]/60" strokeWidth={1.5} />
                      <span className="text-sm text-[#2C2C2C]/60">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-[#FAFAF8] px-4 py-3">
                      <Shield className="h-4 w-4 text-[#D4AF37]/60" strokeWidth={1.5} />
                      <span className="text-sm capitalize text-[#2C2C2C]/60">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200/60 bg-white px-6 py-3 text-[10px] font-semibold tracking-[0.18em] text-red-500 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-sm"
                  >
                    <LogOut className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2} />
                    SIGN OUT
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── Recent Orders ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="lg:col-span-2"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/8">
                    <ShoppingBag className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-serif text-xl tracking-wide text-[#2C2C2C]">
                    Recent Orders
                  </h2>
                </div>
                {orders.length > 0 && (
                  <span className="rounded-full border border-[#2C2C2C]/[0.06] bg-[#F5F4F0] px-3 py-1 text-[10px] tracking-[0.12em] text-[#2C2C2C]/35">
                    {orders.length} ORDER{orders.length !== 1 ? "S" : ""}
                  </span>
                )}
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]/40" strokeWidth={1.5} />
                </div>
              ) : orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.04] bg-white py-20 shadow-sm"
                >
                  <Package className="mb-4 h-10 w-10 text-[#2C2C2C]/10" strokeWidth={1.2} />
                  <p className="text-sm text-[#2C2C2C]/30">
                    No orders yet
                  </p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-[#D4AF37] transition-opacity hover:opacity-70"
                  >
                    BROWSE COLLECTION
                    <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={STAGGER}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {orders.map((order) => (
                    <motion.div key={order._id} variants={FADE_UP}>
                      <Link
                        href={`/orders/${order._id}`}
                        className="group block overflow-hidden rounded-2xl border border-black/[0.04] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#D4AF37]/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono text-xs text-[#2C2C2C]/40">
                                #{order._id.slice(-8).toUpperCase()}
                              </span>
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] ${
                                  STATUS_STYLES[order.status] ||
                                  "border-gray-500/20 bg-gray-500/10 text-gray-400"
                                }`}
                              >
                                {order.status.toUpperCase()}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#2C2C2C]/40">
                              {order.createdAt && (
                                <span>
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              )}
                              {order.pickupHub && (
                                <>
                                  <span className="text-[#2C2C2C]/15">·</span>
                                  <span>{order.pickupHub}</span>
                                </>
                              )}
                              {order.items?.length > 0 && (
                                <>
                                  <span className="text-[#2C2C2C]/15">·</span>
                                  <span>
                                    {order.items.length} item
                                    {order.items.length !== 1 ? "s" : ""}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[9px] tracking-[0.15em] text-[#2C2C2C]/20">
                                TOTAL
                              </p>
                              <p className="text-lg font-medium tracking-tight text-[#D4AF37]">
                                {order.totalAmount?.toLocaleString()} ETB
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#2C2C2C]/15 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]" strokeWidth={2} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
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
