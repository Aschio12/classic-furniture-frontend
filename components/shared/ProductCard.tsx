"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0 },
      }}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface">
        <Image
          src={product.imageUrl || "/images/placeholder-furniture.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-primary/70">
          <span className="rounded-full border border-primary/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em]">
            Hub Available
          </span>
          <span className="text-sm font-semibold text-primary">ETB {product.price.toFixed(2)}</span>
        </div>
        <h3 className="text-base font-medium text-primary">{product.name}</h3>
      </div>
    </motion.article>
  );
}
