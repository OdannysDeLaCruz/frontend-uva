import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="bg-blue-600 p-3 sm:p-4 rounded-xl border-2 border-blue-400">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white sm:mr-4 md:mr-8">
            ¡Hola, {userName}!
          </h1>
          <p className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">
            Bienvenido a tu UVA oficina.
          </p>
        </div>
        <div className="text-xs sm:text-sm text-purple-200 text-left sm:text-center">
          Última actualización: <br className="hidden sm:block" />
          <span className="font-medium text-white">
            Hoy, {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
