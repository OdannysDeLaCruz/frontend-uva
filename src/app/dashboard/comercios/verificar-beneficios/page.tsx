"use client"

import React from 'react'
import { Gift, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VerificarBeneficiosPage() {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-md p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
            <Gift className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Verificar beneficios</h1>
            <p className="text-emerald-100 mt-2">
              Consulta los beneficios y promociones de tu comercio
            </p>
          </div>
        </div>
      </div>

      {/* Contenido - En construcción */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Funcionalidad en desarrollo
          </h2>
          <p className="text-gray-600">
            Esta sección te permitirá consultar y gestionar los beneficios activos,
            inactivos y promociones de tu comercio en la plataforma UVA.
          </p>
        </div>
      </div>
    </div>
  )
}
