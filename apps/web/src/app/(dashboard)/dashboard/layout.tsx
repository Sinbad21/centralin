'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchUser();
    }
  }, [isAuthenticated, router, fetchUser]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">Chatbot Platform</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Esci
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                🏠 Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/bots">
              <Button variant="ghost" className="w-full justify-start">
                🤖 I Miei Bot
              </Button>
            </Link>
            <Link href="/dashboard/conversations">
              <Button variant="ghost" className="w-full justify-start">
                💬 Conversazioni
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" className="w-full justify-start">
                📊 Analytics
              </Button>
            </Link>
            <Link href="/dashboard/scraping">
              <Button variant="ghost" className="w-full justify-start">
                🔍 Lead Generation
              </Button>
            </Link>
            <Link href="/dashboard/marketplace">
              <Button variant="ghost" className="w-full justify-start">
                🛒 Marketplace
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                ⚙️ Impostazioni
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
