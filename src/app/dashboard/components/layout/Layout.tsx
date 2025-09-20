"use client"
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from 'next-themes';
import { ProtectedRoute } from '@/app/core/components/protected-route';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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