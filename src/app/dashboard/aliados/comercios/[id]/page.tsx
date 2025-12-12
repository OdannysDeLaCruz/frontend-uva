'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getAllyById } from '@/app/core/services/allies-service'
import { Ally } from '@/app/core/types/ally'

const AllyDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [ally, setAlly] = useState<Ally | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAlly = async () => {
      try {
        setLoading(true)
        const id = Number(params.id)
        const data = await getAllyById(id)
        setAlly(data)
      } catch (err) {
        setError('Error al cargar el detalle del comercio')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadAlly()
    }
  }, [params.id])

  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !ally) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Comercio no encontrado'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a comercios
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ally Info */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={ally.photo}
                alt={ally.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{ally.name}</h1>

              {ally.categories && ally.categories.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {ally.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{ally.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {ally.benefits && ally.benefits.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ally.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={benefit.image}
                      alt={benefit.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {benefit.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>

                    {(benefit.dateStart || benefit.dateEnd) && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {benefit.dateStart && formatDate(benefit.dateStart)}
                        {benefit.dateStart && benefit.dateEnd && ' - '}
                        {benefit.dateEnd && formatDate(benefit.dateEnd)}
                      </div>
                    )}

                    {!benefit.isActive && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        No disponible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!ally.benefits || ally.benefits.length === 0) && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500">Este comercio no tiene beneficios disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllyDetailPage
