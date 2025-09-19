"use client"
import { useState, useEffect } from 'react';
import {
  // Bell, 
  Menu, 
  X
} from 'lucide-react';
// import ThemeToggle from '../ui/ThemeToggle';
import ProfileDropdown from '../ui/ProfileDropdown';
import { useTheme } from "next-themes";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className={`px-4 py-3 flex items-center justify-between shadow-md border-b border-purple-600 ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-500'} transition-colors duration-300 z-10`}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-2 lg:hidden`}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-purple-200' : 'text-white'}`}>Panel de control</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notificaciones */}
        {/* <button 
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}
        
        {/* Tema */}
        {/* <ThemeToggle /> */}
        
        {/* Perfil */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;