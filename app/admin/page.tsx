import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() { 
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex h-screen items-center justify-center text-2xl bg-[#faf9f6]">
        Admin Control Panel - Coming Soon
      </div>
    </ProtectedRoute>
  ); 
}
