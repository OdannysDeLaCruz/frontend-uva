"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, User as UserIcon, Users, UserCheck, LayoutGrid } from 'lucide-react'

import { useTheme } from 'next-themes'
import toast, { Toaster } from 'react-hot-toast'
import { getDirectos, DirectosResponse } from '@/app/core/services/mlm-service'
import Layout from '../components/layout/Layout';
import Title from '../components/ui/Title'

const UnilevelPage: React.FC = () => {
  const { theme } = useTheme()

  const [data, setData] = useState<DirectosResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDirectos = useCallback(async (showToast = false) => {
    try {
      const response = await getDirectos()
      setData(response)
      setError(null)
      if (showToast) {
        toast.success('Directos actualizados')
      }
    } catch (err) {
      console.error('Error al cargar directos:', err)
      setError('No se pudieron cargar los directos. Por favor, intenta de nuevo.')
      toast.error('Error al cargar los directos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDirectos()
  }, [fetchDirectos])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className={`flex items-center justify-center py-12 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <RefreshCw className="h-5 w-5 animate-spin text-purple-400 mr-3" />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Cargando directos...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className={`p-6 rounded-xl border flex items-start gap-4 ${
          theme === 'dark'
            ? 'bg-red-950/30 border-red-800/50'
            : 'bg-red-50 border-red-200'
        }`}>
          <AlertCircle className={`h-5 w-5 mt-1 flex-shrink-0 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-800'
            }`}>
              Error
            </h3>
            <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>
              {error}
            </p>
          </div>
          <button
            onClick={() => fetchDirectos(true)}
            className="text-purple-500 hover:text-purple-400 ml-4"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalDirectos = data.primarios.length + data.secundarios.length
  const isEmpty = data.primarios.length === 0 && data.secundarios.length === 0

  return (
    <Layout>
      <>
        <Toaster position="bottom-right" />
        <div className="space-y-8">
          <Title title='UVA AMIGOS' />

          {/* Contadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-5 rounded-xl border flex items-center gap-4 ${
              theme === 'dark'
                ? 'bg-purple-950/30 border-purple-800/40'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                theme === 'dark' ? 'bg-purple-900/60' : 'bg-purple-100'
              }`}>
                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {totalDirectos}
                </p>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                  Directos totales
                </p>
              </div>
            </div>

            <div className={`p-5 rounded-xl border flex items-center gap-4 ${
              theme === 'dark'
                ? 'bg-green-950/30 border-green-800/40'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                theme === 'dark' ? 'bg-green-900/60' : 'bg-green-100'
              }`}>
                <UserCheck className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.totalPersonales}
                </p>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  Directos personales
                </p>
              </div>
            </div>

            <div className={`p-5 rounded-xl border flex items-center gap-4 ${
              theme === 'dark'
                ? 'bg-blue-950/30 border-blue-800/40'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                theme === 'dark' ? 'bg-blue-900/60' : 'bg-blue-100'
              }`}>
                <LayoutGrid className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.primarios.length}<span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/10</span>
                </p>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  Espacios ocupados
                </p>
              </div>
            </div>
          </div>

          {/* Directos Primarios */}
          <div>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Primarios ({data.primarios.length}/10)
            </h2>
            {data.primarios.length > 0 ? (
              <div className="space-y-4">
                {data.primarios.map((direct, index) => (
                  <div key={direct.id} className={`p-4 rounded-lg border flex items-start justify-between ${
                    theme === 'dark'
                      ? 'bg-blue-950/30 border-blue-800/50 hover:bg-blue-950/50'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  } transition-colors`}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-blue-900 text-blue-400'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          <span className='capitalize'>{direct.name} {direct.lastname}</span>{' '}
                          <small className='font-normal'>{direct.email}</small>
                        </h4>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Registrado: {formatDate(direct.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!direct.isPersonal && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-amber-900/50 text-amber-400 border border-amber-700/40'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          Derrame
                        </span>
                      )}
                      {direct.isActive ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Activo
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Aún no tienes directos primarios. Comparte tu enlace de referido para conseguirlos.
              </p>
            )}
          </div>

          {/* Directos Secundarios */}
          {data.secundarios.length > 0 && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Secundarios ({data.secundarios.length})
              </h2>
              <div className="space-y-4">
                {data.secundarios.map((direct, index) => (
                  <div key={direct.id} className={`p-4 rounded-lg border flex items-start justify-between ${
                    theme === 'dark'
                      ? 'bg-orange-950/30 border-orange-800/50 hover:bg-orange-950/50'
                      : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                  } transition-colors`}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-orange-900 text-orange-400'
                          : 'bg-orange-200 text-orange-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {direct.name} {direct.lastname}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {direct.email}
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Registrado: {formatDate(direct.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {direct.isActive ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Activo
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {isEmpty && (
            <div className={`p-8 rounded-lg border text-center ${
              theme === 'dark'
                ? 'bg-gray-900/50 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <UserIcon className={`h-12 w-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Sin estructura aún
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Cuando consigas tus primeros afiliados directos y secundarios, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </>
    </Layout>
  );
};

export default UnilevelPage;
