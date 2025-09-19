import React from 'react';
import { HelpCircle, MessageSquare, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';

const Help: React.FC = () => {
  const { theme } = useTheme();
  
  const helpResources = [
    // {
    //   id: 'guides',
    //   title: 'Guías y Tutoriales',
    //   icon: <Book size={24} className="text-purple-500" />,
    //   description: 'Aprende a utilizar todas las funciones de la plataforma',
    //   buttonText: 'Ver guías',
    //   color: 'purple'
    // },
    // {
    //   id: 'videos',
    //   title: 'Videos Instructivos',
    //   icon: <Video size={24} className="text-blue-500" />,
    //   description: 'Tutoriales paso a paso para aprovechar al máximo el dashboard',
    //   buttonText: 'Ver videos',
    //   color: 'blue'
    // },
    {
      id: 'chat',
      title: 'Chat de Soporte',
      icon: <MessageSquare size={24} className="text-green-500" />,
      description: 'Asistencia en vivo para resolver problemas y dudas',
      buttonText: 'Iniciar chat',
      onClick: () => {},
      color: 'green'
    },
    {
      id: 'contact',
      title: 'Contacto Directo',
      icon: <Phone size={24} className="text-red-500" />,
      description: 'Comunícate con nuestro equipo de soporte técnico',
      buttonText: 'Contactar',
      onClick: () => {},
      color: 'red'
    }
  ];

  const faqs = [
    {
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Para cambiar tu contraseña, dirígete a la sección de Configuración, luego a la pestaña de Cuenta y haz clic en "Cambiar contraseña".'
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer: 'Sí, puedes exportar todos tus datos en formato CSV o PDF desde la sección de Configuración en la opción "Exportar datos".'
    },
    {
      question: '¿Cómo añado un nuevo usuario?',
      answer: 'Para añadir un nuevo usuario, ve a la sección de Administración, haz clic en "Usuarios" y luego en el botón "Añadir Usuario" en la esquina superior derecha.'
    },
    {
      question: '¿Cómo recupero mi cuenta si pierdo acceso?',
      answer: 'Si pierdes acceso a tu cuenta, puedes usar la opción "Olvidé mi contraseña" en la página de inicio de sesión o contactar directamente con soporte técnico.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Centro de Ayuda</h2>
      </div>

      {/* Help Resources */}
      <div className="flex items-center flex-row justify-center gap-6">
        {helpResources.map((resource) => (
          <div 
            key={resource.id}
            className={`rounded-lg shadow-md p-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${
                theme === 'dark' 
                  ? `bg-${resource.color}-900/30` 
                  : `bg-${resource.color}-100`
              }`}>
                {resource.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{resource.title}</h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>{resource.description}</p>
              <button onClick={resource.onClick} className={`px-4 py-2 rounded-md text-white bg-${resource.color}-500 hover:bg-${resource.color}-600 transition-colors duration-200 text-sm`}>
                {resource.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={`rounded-lg shadow-md p-6 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4 text-center">¿Cómo podemos ayudarte hoy?</h3>
          <div className="w-full">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar ayuda..." 
                className={`w-full py-3 px-4 pl-10 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-600 text-white placeholder:text-gray-400 focus:bg-gray-500' 
                    : 'bg-gray-100 text-gray-800 placeholder:text-gray-500 focus:bg-gray-200'
                } outline-none transition-colors duration-200`} 
              />
              <HelpCircle size={20} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className={`rounded-lg shadow-md p-6 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
      }`}>
        <h3 className="text-xl font-medium mb-4">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <p className="font-medium mb-2">{faq.question}</p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;