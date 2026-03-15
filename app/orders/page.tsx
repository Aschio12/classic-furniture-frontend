"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import api from "@/lib/axios";
import MainNavbar from "@/components/shared/MainNavbar";
import Footer from "@/components/shared/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  pickupHub: string;
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Arrived at Hub": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  "Payout Failed": "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProtectedRoute>
      <MainNavbar />

      <div className="relative overflow-hidden bg-[#0A0B0F] pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-[400px] w-[400px] rounded-full bg-[rgba(140,200,255,0.06)] blur-[80px]" />
          <div className="absolute -bottom-28 -right-28 h-[320px] w-[320px] rounded-full bg-[rgba(140,200,255,0.04)] blur-[70px]" />
        </div>
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-4xl px-5 text-center"
        >
          <motion.div variants={FADE_UP} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5">
            <Package className="h-3 w-3 text-[#D4AF37]" strokeWidth={2} />
            <span className="text-[10px] tracking-[0.25em] text-white/40">ORDER HISTORY</span>
          </motion.div>
          <motion.h1 variants={FADE_UP} className="font-serif text-5xl leading-[1.1] tracking-wide text-white sm:text-6xl">
            My <span className="italic text-[#D4AF37]">Orders</span>
          </motion.h1>
          <motion.p variants={FADE_UP} className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/40">
            Track your purchases and manage deliveries.
          </motion.p>
        </motion.div>
      </div>

      <section className="bg-[#FAFAF8]">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : orders.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-[#2C2C2C]/10" strokeWidth={1} />
              <p className="text-sm text-[#2C2C2C]/35">No orders yet.</p>
              <Link href="/shop" className="mt-6 rounded-full bg-[#0A0B0F] px-6 py-2.5 text-[10px] tracking-[0.16em] text-white transition-shadow hover:shadow-lg">
                START SHOPPING
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
              {orders.map((order) => {
                const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                const statusStyle = STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600 border-gray-200";
                return (
                  <motion.div key={order._id} variants={FADE_UP}>
                    <Link
                      href={`/orders/${order._id}`}
                      className="group flex flex-col gap-4 rounded-2xl border border-black/[0.04] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A0B0F] text-[#D4AF37]">
                          <Package className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[#2C2C2C]/40">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {" · "}{itemCount} item{itemCount !== 1 ? "s" : ""}
                            {order.pickupHub ? ` · ${order.pickupHub}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.1em] ${statusStyle}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-medium text-[#D4AF37]">
                          {order.totalAmount?.toLocaleString()} ETB
                        </p>
                        <ArrowRight className="h-4 w-4 text-[#2C2C2C]/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]" strokeWidth={2} />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </ProtectedRoute>
  );
}
