"use client"
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from 'next-themes';
import { ProtectedRoute } from '@/app/core/components/protected-route';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/core/ui/loading-spinner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar que el usuario no sea de tipo business
  useEffect(() => {
    if (!user) {
      setIsChecking(true);
      return;
    }

    // Si es business, redirigir a su dashboard
    if (user.role === 'business') {
      router.replace('/dashboard/comercios');
      return;
    }

    setIsChecking(false);
  }, [user, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Mostrar spinner mientras se verifica
  if (isChecking || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Si es business, no renderizar nada (ya se está redirigiendo)
  if (user.role === 'business') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-purple-900 text-white' : 'bg-gray-50 text-purple-800'} transition-colors duration-300`}>
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
          <main className={`flex-1 p-3 md:p-6 overflow-y-auto transition-all duration-300 ${theme === 'dark' ? 'bg-purple-950' : 'bg-white'}`}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;