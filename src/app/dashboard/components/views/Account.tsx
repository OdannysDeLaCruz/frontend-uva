import React, { useState } from 'react';
import { ShieldX, ShieldCheck, Droplets, Info } from 'lucide-react';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useTheme } from 'next-themes';

const Account = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [allowDerrame, setAllowDerrame] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Mi Cuenta
      </h1>

      {/* Estado de la cuenta */}
      <div className={`rounded-lg shadow-md p-6 border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Estado de la Cuenta
        </h2>
        <div className="flex items-center space-x-4">
          {user?.isActive ? (
            <>
              <ShieldCheck className="text-green-500" size={24} />
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  Cuenta Activa
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tu cuenta está activada y funcionando normalmente
                </p>
              </div>
            </>
          ) : (
            <>
              <ShieldX className="text-red-500" size={24} />
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                  Cuenta Inactiva
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tu cuenta no está activa aún
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Configuración de Derrame */}
      <div className={`rounded-lg shadow-md p-6 border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className={`${allowDerrame ? 'text-blue-500' : 'text-gray-400'}`} size={24} />
                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Permitir Derrame
                </h2>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Autoriza a tus patrocinadores a asignarte referidos directamente sin preguntar
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setAllowDerrame(!allowDerrame)}
              className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors ml-4 flex-shrink-0 ${
                allowDerrame
                  ? theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500'
                  : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={allowDerrame}
              aria-label="Permitir derrame"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  allowDerrame ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Información adicional */}
          <div className={`p-4 rounded-lg flex gap-3 ${
            theme === 'dark'
              ? 'bg-blue-900/30 border border-blue-800/50'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <Info className={`h-5 w-5 flex-shrink-0 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <p className={`text-sm ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {allowDerrame
                ? 'El derrame está habilitado. Tus patrocinadores pueden asignarte referidos directamente.'
                : 'El derrame está deshabilitado. Solo recibirás referidos que directamente asignen para ti.'}
            </p>
          </div>

          {/* Estado actual */}
          <div className={`p-3 rounded-lg text-center ${
            allowDerrame
              ? theme === 'dark'
                ? 'bg-blue-900/50'
                : 'bg-blue-100'
              : theme === 'dark'
              ? 'bg-gray-700/50'
              : 'bg-gray-100'
          }`}>
            <p className={`text-sm font-medium ${
              allowDerrame
                ? theme === 'dark'
                  ? 'text-blue-300'
                  : 'text-blue-700'
                : theme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-700'
            }`}>
              {allowDerrame ? '✓ Derrame Activado' : '✗ Derrame Desactivado'}
            </p>
          </div>
        </div>
      </div>

      {/* Opciones peligrosas */}
      <div className={`rounded-lg shadow-md p-6 border ${
        theme === 'dark'
          ? 'bg-gray-800 border-red-900/30'
          : 'bg-red-50 border-red-200'
      }`}>
        <h2 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-red-400' : 'text-red-700'
        }`}>
          Opciones Peligrosas
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Eliminar cuenta
            </span>
            <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
