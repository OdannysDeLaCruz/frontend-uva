"use client"

import React from 'react'
import { UserCheck, Gift, ArrowRight } from 'lucide-react'
import { useAuth } from '@/app/core/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface OptionCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}

export default function ComerciosPage() {
  const { user } = useAuth()
  const router = useRouter()

  const options: OptionCard[] = [
    {
      id: 'historico-beneficios',
      title: 'Historico de Beneficios',
      description: 'Podrás ver el histórico de beneficios aprobados en el último mes.',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      href: '/dashboard/comercios/historico-beneficios-comercio'
    },
    {
      id: 'verificar-beneficios',
      title: 'Verificar beneficios',
      description: 'Consulta los beneficios activos, inactivos y promociones de tu comercio',
      icon: <Gift className="h-5 w-5" />,
      color: 'from-emerald-400 to-emerald-600',
      href: '/dashboard/comercios/verificar-beneficios'
    }
  ]

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
            <span className="text-3xl text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tu comercio y verifica miembros UVA
            </p>
          </div>
        </div>
      </div>

      {/* Título de opciones */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Opciones disponibles
        </h2>
      </div>

      {/* Grilla de opciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleNavigate(option.href)}
          >
            {/* Header con gradiente */}
            <div className={`bg-gradient-to-br ${option.color} px-5 py-3 text-white`}>
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {option.icon}
                </div>
                <div className='px-4'>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {option.title}
                  </h3>
                </div>
                {/* <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" /> */}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              
              <p className="text-gray-600 mb-4">
                {option.description}
              </p>

              {/* Botón */}
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>Acceder</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md p-6 border border-purple-200 mt-16">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900 mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-purple-800">
              Si tienes dudas sobre cómo usar estas herramientas, contacta al equipo de soporte de UVA.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
