"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // e.g., ['admin', 'hub_manager']
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, _hasHydrated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // 0. Wait for Zustand to load from localStorage (hydration)
        if (!_hasHydrated) return;

        // If still loading auth state from API login, wait
        if (authLoading) return;

        // 1. Check Authentication (Hydration complete, user is not logged in)
        if (!isAuthenticated || !user) {
            router.push("/"); // Redirect to landing (login)
            return;
        }

        // 2. Check Role (if restricted)
        if (allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.role)) {
                // Smart redirect based on their actual role
                if (user.role === 'admin') router.push("/admin");
                else if (user.role === 'hub_manager') router.push("/dashboard/hub");
                else router.push("/shop"); 
                return;
            }
        }
    }, [user, isAuthenticated, authLoading, _hasHydrated, allowedRoles, router]);

    // Derived authorization state
    const isAuthorized = _hasHydrated && !authLoading && isAuthenticated && user && 
        (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role));

    // Show loading state while checking / hydrating
    if (!mounted || !_hasHydrated || !isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFA] text-[#2C2C2C]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#d4af37]" strokeWidth={1.5} />
                    <p className="text-[10px] tracking-[0.25em] font-light text-[#2C2C2C]/50 uppercase">Restoring Session...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
