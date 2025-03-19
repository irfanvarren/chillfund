
import AdminTokenManager from '@/components/ui/AdminTokenManager';
import { Toaster } from 'react-hot-toast';

export default function TokenManagerPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-32">
      <Toaster position="top-right" />
      <AdminTokenManager />
    </div>
  );
}
