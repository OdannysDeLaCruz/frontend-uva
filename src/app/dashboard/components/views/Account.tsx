import React from 'react';
import { ShieldX, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useTheme } from 'next-themes';

const Account = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cuenta</h1>

      {/* Estado de la cuenta */}
      <div className={`rounded-lg shadow-md p-6 ${ theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
        <div className="flex items-center space-x-4">
          {user?.isActive ? (
            <ShieldCheck className={`text-green-500`} size={20} />
          ) : (
            <ShieldX className={`text-red-500`} size={20} />
          )}
          <p className="text-sm font-medium">{user?.isActive ? 'Activa' : 'Inactiva'}</p>
        </div>
      </div>

      <div className={`rounded-lg shadow-md p-6 ${ theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Eliminar cuenta</span>
            <button className={`px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200`}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
