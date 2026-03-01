"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bell, ShoppingBag, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Hubs", href: "/hubs" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { unreadCount } = useNotificationStore();

  const isLandingPage = pathname === "/";
  
  // Luxury Scroll logic: On landing page, start invisible and fade in as user scrolls down
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 400], [0, 1]);
  const navY = useTransform(scrollY, [0, 400], [-20, 0]);
  const navPointerEvents = useTransform(scrollY, (y: number) => y < 200 ? "none" : "auto");

  // Show nav links only if we are user OR if we are NOT on the landing page
  const showNavLinks = !isLandingPage || !!user;

  if (isLandingPage && !user) {
    return null;
  }

  return (
    <motion.header 
      style={{ 
        opacity: isLandingPage ? navOpacity : 1, 
        y: isLandingPage ? navY : 0,
        pointerEvents: isLandingPage ? navPointerEvents : "auto"
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,10,12,0.86)_0%,rgba(12,12,16,0.72)_100%)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group relative flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f0f13_0%,#1a1a1f_100%)] shadow-[0_4px_14px_rgba(212,175,55,0.25)] transition-all duration-300 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.4)]">
            <span className="font-[Cormorant_Garamond] text-lg font-bold text-[#D4AF37]">CF</span>
            <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,transparent,rgba(212,175,55,0.1))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="text-xl font-bold tracking-[0.15em] text-white/90 transition-colors duration-300 group-hover:text-[#D4AF37]">
            LUXECRAFT
          </span>
        </Link>
        
        {showNavLinks && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/65 md:flex">
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover="hover" className="group relative">
                <Link href={link.href} className="text-white/75 transition-colors duration-300 hover:text-white">
                  {link.label}
                </Link>
                <motion.span
                  variants={{
                    hover: { scaleX: 1, opacity: 1 },
                    initial: { scaleX: 0, opacity: 0 },
                  }}
                  initial="initial"
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-[linear-gradient(90deg,#D4AF37_0%,#C5A028_100%)] shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                />
              </motion.div>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/cart" className="relative text-white/75 transition hover:text-white">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-primary">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link href="/notifications" className="relative text-white/75 transition hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/85 shadow-[0_2px_12px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:bg-white/15 hover:text-white">
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/20 bg-[#111217]/90 text-white backdrop-blur-xl">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      My Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full">
                      Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => logout()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                      Sign In
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md border border-white/20 bg-black/60 backdrop-blur-xl p-0 shadow-2xl">
                    <VisuallyHidden>
                        <DialogTitle>Sign In</DialogTitle>
                    </VisuallyHidden>
                    <LoginForm />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="rounded-full border border-[#D4AF37]/60 bg-[linear-gradient(135deg,#D4AF37_0%,#B98D1F_100%)] px-5 py-2 text-sm font-medium text-[#111217] shadow-[0_6px_20px_rgba(212,175,55,0.35)] transition-all hover:shadow-[0_10px_28px_rgba(212,175,55,0.45)] active:scale-95">
                      Create Account
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md border border-white/20 bg-black/60 backdrop-blur-xl p-0 shadow-2xl">
                    <VisuallyHidden>
                        <DialogTitle>Create Account</DialogTitle>
                    </VisuallyHidden>
                    <RegisterForm />
                  </DialogContent>
                </Dialog>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
