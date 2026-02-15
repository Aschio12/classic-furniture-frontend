"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { Loader2, Package } from "lucide-react";

import api from "@/lib/axios";
import OrderTracker from "@/components/shared/OrderTracker";
import MainLayout from "@/components/shared/MainLayout";

interface Order {
  _id: string;
  items: Array<{
    product: {
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    priceAtPurchase: number;
  }>;
  totalAmount: number;
  status: "Pending" | "Paid" | "Shipped" | "Arrived at Hub" | "Completed" | "Cancelled" | "Payout Failed";
  pickupHub: string;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F9F9FB]">
        <h1 className="text-2xl font-light text-primary">Order Not Found</h1>
        <p className="text-primary/60">We couldn&apos;t find the order you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-[#F9F9FB] pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-primary">Order Status</h1>
          <p className="mt-2 text-primary/60">Tracking ID: {order._id}</p>
        </div>

        {/* Tracker Component */}
        <div className="mb-12 flex justify-center rounded-2xl bg-white p-8 shadow-sm">
          <OrderTracker status={order.status} />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Items */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-xl font-medium text-primary">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                     {item.product.images?.[0] ? (
                        <Image
                            src={`http://localhost:5000${item.product.images[0]}`}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                        />
                     ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                             <Package className="h-8 w-8" />
                        </div>
                     )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-primary">{item.product.name}</h3>
                    <p className="text-sm text-primary/60">Quantity: {item.quantity}</p>
                    <p className="font-medium text-accent">
                      {item.priceAtPurchase.toLocaleString()} ETB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="h-fit space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-medium text-primary">Delivery Info</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-primary/60">Pickup Hub</span>
                <span className="font-medium text-primary">{order.pickupHub}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-primary/60">Payment Status</span>
                <span
                  className={`font-medium ${
                    order.status === "Paid" || order.status === "Completed"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-base font-medium text-primary">Total</span>
                <span className="text-xl font-bold text-primary">
                  {order.totalAmount.toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </MainLayout>
  );
}
