import React, { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  ChevronDown,
  User,
  Settings,
  Copy
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { copyToClipboard } from '../../util/util';
import toast, { Toaster } from 'react-hot-toast';

const ProfileDropdown: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCopy = (text: string, message: string) => {
    copyToClipboard(text)
    toast.success(message, {
      position: 'top-right',
    })
  }

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
      id: 'profile',
      label: 'Mi perfil',
      icon: <User size={16} />,
      onClick: () => router.push('/dashboard/profile')
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings size={16} />,
      onClick: () => router.push('/dashboard/settings')
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 py-1 px-3 rounded-full transition-colors duration-200 ${theme === 'dark'
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
          className={`absolute right-0 mt-2 w-72 py-3 rounded-lg shadow-lg z-50 ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
            }`}
        >
          <div className="flex items-center border-b border-gray-700">
            <div className='flex items-center justify-center border-gray-200 dark:border-gray-700 overflow-hidden w-20 h-20'>
              <Image
                className='rounded-full border border-gray-200 dark:border-gray-700 bg-white p-2'
                src='/images/default-profile.webp'
                alt="Profile"
                width={48}
                height={48}
              />
            </div>
            <div className='flex flex-col'>
              <p className="text-md font-medium mb-1">{user?.name} {user?.lastname}</p>
              <p className="text-sm text-gray-400 mb-1">{user?.email}</p>
              <p className="text-xs text-gray-400">
                CODIGO: {user?.referralCode}
                <button onClick={() => handleCopy(user?.referralCode || '', 'Codigo copiado al portapapeles')} className='ml-2 cursor-pointer'>
                  <Copy size={12} className="cursor-pointer" />
                </button>
              </p>
            </div>
          </div>

          <div className="py-1">
            {profileOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-300 hover:bg-gray-700`}
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
              className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-300 hover:bg-gray-700`}
            >
              <span><LogOut size={16} /></span>
              <span>Salir</span>
            </button>
          </div>

          <Toaster />
        </div>
      )}

    </div>
  );
};

export default ProfileDropdown;