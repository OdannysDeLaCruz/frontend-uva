import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Lock, Users, Info } from 'lucide-react';

interface ToggleSetting {
  id: string;
  label: string;
  type: 'toggle';
  value: boolean;
  onToggle: () => void;
}

interface ButtonSetting {
  id: string;
  label: string;
  type: 'button';
  label2: string;
  onClick: () => void;
}

interface DangerButtonSetting {
  id: string;
  label: string;
  type: 'danger-button';
  label2: string;
  onClick: () => void;
}

interface SelectSetting {
  id: string;
  label: string;
  type: 'select';
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

type Setting = ToggleSetting | ButtonSetting | DangerButtonSetting | SelectSetting;

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  settings: Setting[];
}

const Settings: React.FC = () => {
  const { theme } = useTheme();

  // Permitir Derrame
  const [allowDerrame, setAllowDerrame] = useState(false);

  // Privacidad y Seguridad
  const [twoFa, setTwoFa] = useState(false);

  // Cuenta
  const [language, setLanguage] = useState('Español');
  const [timezone, setTimezone] = useState('(GMT-05:00) Este de EE. UU.');

  const handleDeleteAccount = () => {
    // TODO: mostrar modal de confirmación antes de eliminar
    alert('Funcionalidad de eliminación de cuenta no disponible aún.');
  };

  const handleTwoFa = () => {
    // TODO: mostrar modal de confirmación antes de eliminar
    alert('Funcionalidad de autenticación de dos factores no disponible aún.');
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'privacy',
      title: 'Privacidad y Seguridad',
      icon: <Lock size={20} />,
      description: 'Gestionar opciones de privacidad y seguridad',
      settings: [
        {
          id: '2fa',
          label: 'Autenticación de dos factores',
          type: 'toggle',
          value: twoFa,
          onToggle: () => handleTwoFa(),
        },
      ],
    },
    {
      id: 'account',
      title: 'Cuenta',
      icon: <Users size={20} />,
      description: 'Gestionar información de cuenta',
      settings: [
        {
          id: 'language',
          label: 'Idioma',
          type: 'select',
          options: ['Español'],
          value: language,
          onChange: setLanguage,
        },
        {
          id: 'timezone',
          label: 'Zona horaria',
          type: 'select',
          options: ['(GMT-05:00) Bogotá, Lima, Quito, Rio Branco'],
          value: timezone,
          onChange: setTimezone,
        },
        {
          id: 'delete-account',
          label: 'Eliminar cuenta',
          type: 'danger-button',
          label2: 'Eliminar',
          onClick: handleDeleteAccount,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Configuración</h2>
      </div>

      {/* Permitir Derrame */}
      <div className={`rounded-lg shadow-md p-6 border border-gray-700 bg-gray-700`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <h2 className={`text-lg font-semibold text-white`}>
                    Permitir Derrame
                  </h2>
                </div>
                <div className='flex items-center gap-3'>
                  <div className={`px-2 py-1 rounded-lg flex gap-3 
                    ${allowDerrame ?
                      'bg-green-900' :
                      'bg-gray-500'
                    }`}>
                    <p className={`text-sm ${allowDerrame ?
                      'text-green-300' :
                      'text-gray-100'
                      }`}>
                      {allowDerrame ? 'Activado' : 'Desactivado'}
                    </p>
                  </div>
                  <button
                    onClick={() => setAllowDerrame(v => !v)}
                    className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors flex-shrink-0 ${allowDerrame
                        ? 'bg-green-600'
                        : 'bg-gray-600'
                      }`}
                    role="switch"
                    aria-checked={allowDerrame}
                    aria-label="Permitir derrame"
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${allowDerrame ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                  </button>
                </div>
              </div>
              <p className={`text-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Permite que se te asignen referidos desde arriba sin preguntar. Ten en cuenta que esto ocupará espacio de tu primer nivel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map(section => (
          <div
            key={section.id}
            className={`rounded-lg shadow-md p-6 ${'bg-gray-700'}`}
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full mr-3 ${'bg-gray-600'}`}>
                {section.icon}
              </div>
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className={`text-sm ${'text-gray-500'}`}>{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.settings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <span className="text-sm">{setting.label}</span>

                  {setting.type === 'toggle' && (
                    <button
                      onClick={setting.onToggle}
                      role="switch"
                      aria-checked={setting.value}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.value
                          ? 'bg-indigo-600'
                          : 'bg-gray-600'
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                  )}

                  {setting.type === 'select' && (
                    <select
                      value={setting.value}
                      onChange={e => setting.onChange(e.target.value)}
                      className={`text-sm px-2 py-1 rounded-md border outline-none ${'bg-gray-600 border-gray-500 text-white'}`}
                    >
                      {setting.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {setting.type === 'button' && (
                    <button
                      onClick={setting.onClick}
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${'bg-gray-600 hover:bg-gray-500'}`}
                    >
                      {setting.label2}
                    </button>
                  )}

                  {setting.type === 'danger-button' && (
                    <button
                      onClick={setting.onClick}
                      className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                      {setting.label2}
                    </button>
                  )}
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
