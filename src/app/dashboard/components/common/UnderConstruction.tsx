'use client'

import React from 'react'
import { Construction } from 'lucide-react'

interface UnderConstructionProps {
  title?: string
  message?: string
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title = '¡Estamos trabajando en algo increíble!',
  message = 'Esta sección está en construcción. Pronto tendrás acceso a contenido educativo de alta calidad para potenciar tu crecimiento.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      {/* Icono animado */}
      <div className="relative mb-8">
        <Construction
          size={120}
          className="text-purple-600 animate-bounce"
          strokeWidth={1.5}
        />
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-purple-400 opacity-20 blur-3xl animate-pulse"></div>
      </div>

      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        {title}
      </h2>

      {/* Mensaje */}
      <p className="text-lg text-gray-400 text-center max-w-2xl mb-8">
        {message}
      </p>

      {/* Indicador de progreso */}
      <div className="flex gap-2 items-center">
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* Mensaje adicional */}
      <p className="mt-8 text-sm text-gray-500 italic">
        Estamos agregando los últimos detalles...
      </p>
    </div>
  )
}

export default UnderConstruction
