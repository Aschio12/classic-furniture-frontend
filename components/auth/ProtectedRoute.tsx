"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // e.g., ['admin', 'hub_manager']
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

    useEffect(() => {
        // If still loading auth state from persistence, wait
        if (authLoading) return;

        // 1. Check Authentication
        if (!isAuthenticated || !user) {
            router.push("/"); // Redirect to landing (login)
            return;
        }

        // 2. Check Role (if restricted)
        if (allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.role)) {
                // If logged in but wrong role, redirect to appropriate home
                router.push("/unauthorized"); // Or fallback to '/shop'
                return;
            }
        }
    }, [user, isAuthenticated, authLoading, allowedRoles, router]);

    // Derived authorization state (avoiding useState/useEffect sync issues)
    const isAuthorized = !authLoading && isAuthenticated && user && 
        (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role));

    // Show loading state while checking
    if (!isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <Loader2 className="h-10 w-10 animate-spin text-[#d4af37]" />
            </div>
        );
    }

    return <>{children}</>;
}
