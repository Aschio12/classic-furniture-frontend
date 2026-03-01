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
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group relative flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2C2C2C_0%,#1a1a1a_100%)] shadow-[0_4px_12px_rgba(212,175,55,0.2)] transition-all duration-300 group-hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)]">
            <span className="font-[Cormorant_Garamond] text-lg font-bold text-[#D4AF37]">CF</span>
            <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,transparent,rgba(212,175,55,0.1))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="text-xl font-bold tracking-[0.15em] text-neutral-900 transition-colors duration-300 group-hover:text-[#D4AF37]">
            LUXECRAFT
          </span>
        </Link>
        
        {showNavLinks && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover="hover" className="group relative">
                <Link href={link.href} className="text-neutral-700 transition-colors duration-300 hover:text-neutral-900">
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
              <Link href="/cart" className="relative text-primary/80 transition hover:text-primary">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-primary">
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
                    <button className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
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
                    <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95">
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
