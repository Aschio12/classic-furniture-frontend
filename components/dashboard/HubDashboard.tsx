"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Package } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import VerificationModal from "./VerificationModal";

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

  const handleSuccess = () => {
    if (selectedOrder) {
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrder._id));
      setSelectedOrder(null);
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
      {selectedOrder && (
        <VerificationModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          orderId={selectedOrder._id}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
