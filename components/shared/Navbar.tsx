"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, ShoppingBag, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Hubs", href: "/hubs" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const { itemCount } = useCartStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-[0.3em] text-primary">
          LUXECRAFT
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-primary/80 md:flex">
          {navLinks.map((link) => (
            <motion.div key={link.href} whileHover="hover" className="relative">
              <Link href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
              <motion.span
                variants={{
                  hover: { scaleX: 1, opacity: 1 },
                  initial: { scaleX: 0, opacity: 0 },
                }}
                initial="initial"
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-accent"
              />
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-primary/80 transition hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-primary">
                {itemCount}
              </span>
            )}
          </Link>

          <Link href="/notifications" className="relative text-primary/80 transition hover:text-primary">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 px-3 py-1.5 text-sm text-primary/80 shadow-sm transition hover:text-primary">
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
