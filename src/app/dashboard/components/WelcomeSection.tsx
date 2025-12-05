import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'Usuario' }) => {
  return (
    <div className="bg-blue-600 p-3 rounded-xl border-2 border-blue-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-white mr-8">
            ¡Hola, {userName}!
          </h1>
          <p className="text-white text-2xl font-bold">
            Bienvenido a tu UVA oficina.
          </p>
        </div>
        <div className="text-sm text-purple-200 text-center">
          Última actualización: <br />
          <span className="font-medium text-white">
            Hoy, {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
