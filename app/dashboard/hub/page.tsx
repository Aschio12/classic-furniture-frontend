import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function HubAdmin() { 
  return (
    <ProtectedRoute allowedRoles={['hub_manager']}>
      <div className="flex h-screen items-center justify-center text-2xl bg-[#faf9f6]">
        Hub Manager Dashboard - Coming Soon
      </div>
    </ProtectedRoute>
  ); 
}
