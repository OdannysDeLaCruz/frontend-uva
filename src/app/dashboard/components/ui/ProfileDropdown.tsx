import React, { useState, useRef, useEffect } from 'react';
import { LogOut, 
  // Settings, 
  ChevronDown, Home, 
  // Trees as Tree, 
  // Cylinder, 
  User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfileDropdown: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profileOptions = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={16} />,
      onClick: () => router.push('/dashboard')
    },
    // {
    //   id: 'tree-view',
    //   label: 'Vista de árbol',
    //   icon: <Tree size={16} />,
    //   onClick: () => router.push('/dashboard/tree-view')
    // },
    // {
    //   id: 'tanque',
    //   label: 'Mi tanque',
    //   icon: <Cylinder size={16} />,
    //   onClick: () => router.push('/dashboard/tanque')
    // },
    {
      id: 'account',
      label: 'Cuenta',
      icon: <User size={16} />,
      onClick: () => router.push('/dashboard/account')
    },
    // {
    //   id: 'settings',
    //   label: 'Configuración',
    //   icon: <Settings size={16} />,
    //   onClick: () => router.push('/dashboard/settings')
    // }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 py-1 px-3 rounded-full transition-colors duration-200 ${
          theme === 'dark' 
            ? 'hover:bg-gray-700' 
            : 'hover:bg-gray-200'
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
          {user?.name.charAt(0)}{user?.lastname.charAt(0)}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-64 py-2 rounded-lg shadow-lg z-50 ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex flex-col items-center px-4 pb-6 pt-2 border-b border-gray-700">
            <div className='flex items-center justify-center border-gray-200 dark:border-gray-700 overflow-hidden w-20 h-20'>
              <Image
                className='rounded-full border border-gray-200 dark:border-gray-700 bg-white p-2'
                src='/images/default-profile.webp'
                alt="Profile"
                width={48}
                height={48}
              />
            </div>
            <p className="text-sm font-medium mb-1">{user?.name} {user?.lastname}</p>
            <p className="text-xs text-gray-400 mb-2">{user?.email}</p>

             <button  
                className={`text-sm mt-2 w-full border border-gray-200 rounded px-2 py-2 cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => router.push('/dashboard/profile')}
              >
                Ver perfil
              </button>
          </div>
          
          <div className="py-1">
            {profileOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}

             <button
                onClick={async () => {
                  await logout();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 pt-4 pb-2 flex items-center space-x-2 text-red-500 ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span><LogOut size={16} /></span>
                <span>Cerrar Sesión</span>
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;