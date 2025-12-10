"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, User as UserIcon, Mail, Phone } from 'lucide-react'
import { useTheme } from 'next-themes'
import toast, { Toaster } from 'react-hot-toast'
import { getDirectos, DirectosResponse } from '@/app/core/services/mlm-service'
import Layout from '../components/layout/Layout';

const UnilevelPage: React.FC = () => {
  const { theme } = useTheme()
  // const { user: authUser } = useAuth()

  const [data, setData] = useState<DirectosResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDirectos = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await getDirectos()
      setData(response)
      setError(null)
      if (refreshing) {
        toast.success('Directos actualizados')
      }
    } catch (err) {
      console.error('Error al cargar directos:', err)
      setError('No se pudieron cargar los directos. Por favor, intenta de nuevo.')
      toast.error('Error al cargar los directos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [refreshing])

  useEffect(() => {
    fetchDirectos()
  }, [fetchDirectos, refreshing])

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
            onClick={fetchDirectos}
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

  const UserCard = ({ user: u, type }: { user: typeof data.usuario | typeof data.primarios[0]; type?: 'primary' | 'secondary' }) => {
    const bgColor = type === 'primary'
      ? theme === 'dark' ? 'bg-blue-950/50 border-blue-800/50' : 'bg-blue-50 border-blue-200'
      : type === 'secondary'
      ? theme === 'dark' ? 'bg-orange-950/50 border-orange-800/50' : 'bg-orange-50 border-orange-200'
      : theme === 'dark' ? 'bg-purple-950/50 border-purple-800/50' : 'bg-purple-50 border-purple-200'

    // const borderColor = type === 'primary'
    //   ? 'border-blue-800'
    //   : type === 'secondary'
    //   ? 'border-orange-800'
    //   : 'border-purple-800'

    const headerColor = type === 'primary'
      ? theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
      : type === 'secondary'
      ? theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
      : theme === 'dark' ? 'text-purple-400' : 'text-purple-700'

    return (
      <div className={`p-6 rounded-xl border ${bgColor}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            type === 'primary'
              ? theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
              : type === 'secondary'
              ? theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-100'
              : theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
          }`}>
            <UserIcon className={`h-6 w-6 ${headerColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {u.name} {u.lastname}
            </h3>
            <div className={`mt-3 space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{u.phone}</span>
              </div>
              <div className={`text-xs mt-2 font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Código: {u.referralCode}
              </div>
            </div>
          </div>
          <div className={`text-right`}>
            {u.isActive ? (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === 'dark'
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-green-100 text-green-800'
              }`}>
                Activo
              </span>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                Inactivo
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <>
        <Toaster position="bottom-right" />
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Mis Directos
              </h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de directos: <span className="font-semibold text-blue-500">{data.totalDirectos}</span>
              </p>
            </div>
            <button
              onClick={fetchDirectos}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''} text-purple-400`} />
            </button>
          </div>
  
          {/* Tarjeta del usuario actual */}
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Tú
            </h2>
            <UserCard user={data.usuario} type="primary" />
          </div>
  
          {/* Directos Primarios (Azul) */}
          {data.primarios.length > 0 && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Primarios ({data.totalPrimarios}/10)
              </h2>
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
  
          {/* Directos Secundarios (Naranja) */}
          {data.secundarios.length > 0 && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Secundarios ({data.totalSecundarios})
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
                        {index + 11}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
  
          {/* Mensaje vacío */}
          {data.totalDirectos === 0 && (
            <div className={`p-8 rounded-lg border text-center ${
              theme === 'dark'
                ? 'bg-gray-900/50 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <UserIcon className={`h-12 w-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Sin directos aún
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Cuando consigas tus primeros afiliados directos, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </>
    </Layout>
  );
};

export default UnilevelPage;
