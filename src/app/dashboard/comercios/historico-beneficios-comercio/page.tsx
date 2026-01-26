"use client"

import React, { useEffect, useState } from 'react'
import { UserCheck, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { getPartnerBenefitsQr } from '@/app/core/services/benefits-service'
import { BenefitUsagePartnerQr } from '@/app/core/types/benefit'

export default function VerificarMiembroPage() {
  const router = useRouter()

  const [data, setData] = useState<BenefitUsagePartnerQr[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await getPartnerBenefitsQr()
      setData(result)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error cargando histórico de beneficios')
      }
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-md p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
            <UserCheck className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Histórico de Beneficios</h1>
            <p className="text-green-100 mt-2">
              Beneficios redimidos recientemente
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-gray-500">Cargando histórico...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && data.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
          No hay beneficios redimidos aún
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && data.length > 0 && (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Beneficio</th>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Redimido</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {data.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.userName}</td>
                  <td className="px-4 py-3">{item.benefitName}</td>
                  <td className="px-4 py-3 font-mono">{item.code}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
