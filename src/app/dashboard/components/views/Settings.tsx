import React from 'react';
import { useTheme } from 'next-themes';
import { Bell, Lock, Users } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme } = useTheme();

  const settingsSections = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: <Bell size={20} />,
      description: 'Configurar notificaciones y alertas',
      settings: [
        { id: 'email', label: 'Notificaciones por correo', type: 'toggle', value: true },
        { id: 'push', label: 'Notificaciones push', type: 'toggle', value: false },
        { id: 'sounds', label: 'Sonidos de notificación', type: 'toggle', value: true },
      ]
    },
    {
      id: 'privacy',
      title: 'Privacidad y Seguridad',
      icon: <Lock size={20} />,
      description: 'Gestionar opciones de privacidad y seguridad',
      settings: [
        { id: '2fa', label: 'Autenticación de dos factores', type: 'toggle', value: false },
        { id: 'sessions', label: 'Sesiones activas', type: 'button', label2: 'Administrar' },
        { id: 'data', label: 'Exportar datos', type: 'button', label2: 'Exportar' },
      ]
    },
    {
      id: 'account',
      title: 'Cuenta',
      icon: <Users size={20} />,
      description: 'Gestionar información de cuenta',
      settings: [
        { id: 'language', label: 'Idioma', type: 'select', options: ['Español', 'English', 'Português'], value: 'Español' },
        { id: 'timezone', label: 'Zona horaria', type: 'select', options: ['(GMT-05:00) Este de EE. UU.', '(GMT+01:00) Madrid', '(GMT+00:00) Londres'], value: '(GMT-05:00) Este de EE. UU.' },
        { id: 'delete-account', label: 'Eliminar cuenta', type: 'danger-button', label2: 'Eliminar' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Configuración</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settingsSections.map(section => (
          <div 
            key={section.id}
            className={`rounded-lg shadow-md p-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full mr-3 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
              }`}>
                {section.icon}
              </div>
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {section.settings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <span className="text-sm">{setting.label}</span>
                  
                  {setting.type === 'toggle' && (
                    <button 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.value 
                          ? 'bg-indigo-600' 
                          : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`} 
                      />
                    </button>
                  )}
                  
                  {setting.type === 'button' && (
                    <button className={`px-3 py-1 text-sm rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-600 hover:bg-gray-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors duration-200`}>
                      {setting.label2}
                    </button>
                  )}
                  
                  {setting.type === 'danger-button' && (
                    <button className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
                      {setting.label2}
                    </button>
                  )}
                  
                  {/* {setting.type === 'select' && (
                    <select className={`text-sm px-2 py-1 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500' 
                        : 'bg-white border-gray-300'
                    } border outline-none`}>
                      {setting.options?.map(option => (
                        <option key={option} selected={option === setting.value}>{option}</option>
                      ))}
                    </select>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;