"use client";

import HubDashboardComp from "@/components/dashboard/HubDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function HubManagerContent() {
  return <HubDashboardComp />;
}

export default function HubManagerPage() {
  return (
    <ProtectedRoute allowedRoles={['hub_manager', 'admin']}>
      <HubManagerContent />
    </ProtectedRoute>
  );
}

