"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

// --- Types ---
interface Product {
  name: string;
  imageUrl?: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  pickupHub: string;
  updatedAt: string; // Used to calculate "Days at Hub"
}

// --- Helper: Days at Hub ---
function getDaysAtHub(dateString: string) {
  const arrivedDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - arrivedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays; 
}

export default function HubDashboardComp() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For Modal

  // --- Fetch Orders ---
  useEffect(() => {
    async function fetchHubOrders() {
      try {
        const { data } = await api.get("/orders/hub/pending");
        
        // Filter specifically for 'Arrived at Hub'
        const arrivedOrders = (data as Order[]).filter((o) => o.status === "Arrived at Hub");
        
        setOrders(arrivedOrders);
      } catch (error) {
        console.error("Failed to fetch hub orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHubOrders();
  }, []);

  const handleVerifyHandover = async () => {
    if (!selectedOrder) return;
    try {
      // Call backend to complete order
      await api.put(`/orders/hub/complete`, { 
          orderId: selectedOrder._id,
          // verificationCode // If needed later
      });

      // Update local state
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrder._id));
      setSelectedOrder(null);
    } catch (error) {
      console.error("Verification failed", error);
      alert("Verification failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const hubName = user?.name ? `${user.name} Center` : "Adama Central Hub"; 

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-primary">
      {/* --- Header --- */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-primary">
            {hubName}
          </h1>
          <p className="mt-1 text-sm text-primary/60">Hub Operations Dashboard</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          <span className="text-sm font-medium tracking-wide text-primary">
            Live
          </span>
        </div>
      </header>

      {/* --- Order Cards List --- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 ? (
          <div className="col-span-full py-20 text-center text-primary/40">
            <p>No orders currently waiting for pickup.</p>
          </div>
        ) : (
          orders.map((order) => {
            const daysAtHub = getDaysAtHub(order.updatedAt || new Date().toISOString());
            // Use first product image (safe casting since backend populates items)
            const product = order.items?.[0]?.product;
            const itemCount = order.items?.length || 0;
            const buyerName = order.buyer?.name || "Unknown Buyer";

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                {/* Image Section */}
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={product?.imageUrl || "/images/placeholder-furniture.jpg"}
                    alt={product?.name || "Product"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                    {itemCount} Item{itemCount > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-6 space-y-3">
                  <div>
                    <h3 className="text-lg font-medium leading-tight">
                      {buyerName}
                    </h3>
                    <p className="text-xs text-primary/50">Order #{order._id.slice(-6).toUpperCase()}</p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-primary/70">
                    <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-orange-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {daysAtHub} Day{daysAtHub !== 1 ? "s" : ""} at Hub
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Verify Handover
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* --- Verification Modal --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* Header Image */}
              <div className="relative h-32 bg-primary">
                <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-10" />
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-green-500 text-white shadow-lg">
                  <Check className="h-10 w-10" />
                </div>
              </div>

              <div className="px-8 pb-8 pt-14 text-center">
                <h3 className="mb-2 text-2xl font-light text-primary">
                  Confirm Handover
                </h3>
                <p className="mb-8 text-sm text-primary/60">
                  Are you sure you want to release this order to 
                  <span className="font-semibold text-primary"> {selectedOrder.buyer?.name}</span>?
                  This action cannot be undone.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-xl border border-gray-200 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyHandover}
                    className="rounded-xl bg-primary py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-transform active:scale-95"
                  >
                    Confirm Release
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
