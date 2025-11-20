'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/Loader';
import {
  LayoutDashboard,
  Calendar,
  Users,
  GraduationCap,
  Image as ImageIcon,
  Lightbulb,
  Bell,
  Sparkles,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavbar({ sidebarOpen, setSidebarOpen }: any) {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border z-30 shadow-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg md:text-xl font-display font-bold gradient-text">
            AIML Club Admin
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
            {user?.name || 'Admin'}
          </span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function AdminSidebar({ sidebarOpen, setSidebarOpen }: any) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/team', label: 'Team', icon: Users },
    { href: '/admin/members', label: 'Members', icon: GraduationCap },
    { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/admin/suggestions', label: 'Suggestions', icon: Lightbulb },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/highlights', label: 'Highlights', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border overflow-y-auto z-20 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary-600 dark:text-primary-400' : ''} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
