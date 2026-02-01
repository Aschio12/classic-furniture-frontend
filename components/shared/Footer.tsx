import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-[0.2em]">LUXECRAFT</h3>
            <p className="text-sm text-white/60">
              Redefining spaces with timeless elegance and modern craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Living Room" className="hover:text-white transition-colors">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Bedroom" className="hover:text-white transition-colors">
                  Bedroom
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/hubs" className="hover:text-white transition-colors">
                  Hub Locations
                </Link>
              </li>
              <li>
                <Link href="/seller/join" className="hover:text-white transition-colors">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Connect
            </h4>
            <div className="flex gap-4 text-white/60">
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} LuxeCraft Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
