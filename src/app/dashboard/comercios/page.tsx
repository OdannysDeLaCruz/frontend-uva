"use client"

import React, { useEffect, useState } from 'react'
import { Gift, UserCheck } from 'lucide-react'
import { useAuth } from '@/app/core/contexts/auth-context'
import ScanQrModal from './components/ScanQrModal'
import ManualModal from './components/ManualModal'
import SearchByFieldModal from './components/SearchByFieldModal'
import ConfirmModal from './components/ConfirmModal'
import SuccessModal from './components/SuccessModal'
import {
  SearchableBenefitField,
  ValidateQrResponse,
  BenefitUsagePartnerQr,
} from '@/app/core/types/benefit'
import {
  validateQr as validateQrService,
  validateQrByCode,
  searchBenefitByField,
  getSearchableBenefitFields,
  useQr as redeemQrService,
  getPartnerBenefitsQr,
} from '@/app/core/services/benefits-service'

type Step = 'idle' | 'scan' | 'manual' | 'field' | 'confirm' | 'success'

export default function ComerciosPage() {
  const { user } = useAuth()

  /* =========================
     Verificar beneficios
     ========================= */
  const [step, setStep] = useState<Step>('idle')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [validationData, setValidationData] =
    useState<ValidateQrResponse | null>(null)
  const [searchableFields, setSearchableFields] = useState<
    SearchableBenefitField[]
  >([])

  /* =========================
     Histórico de beneficios
     ========================= */
  const [history, setHistory] = useState<BenefitUsagePartnerQr[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSearchableFields = async () => {
      try {
        const data = await getSearchableBenefitFields()
        setSearchableFields(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchSearchableFields()
  }, [])

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const result = await getPartnerBenefitsQr()
      setHistory(result)
    } catch (err: unknown) {
      setHistoryError(
        err instanceof Error ? err.message : 'Error cargando histórico de beneficios'
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const searchFieldLabel = (() => {
    if (searchableFields.length === 0) return ''
    const labels = Array.from(
      new Set(searchableFields.map(f => f.customFieldLabel))
    )
    return labels.length === 1
      ? `Buscar por ${labels[0]}`
      : 'Buscar por otro dato'
  })()

  /* =========================
     helpers
     ========================= */
  const goToStep = (nextStep: Step) => {
    setVerifyError(null)
    setStep(nextStep)
  }

  /* =========================
     SERVICES
     ========================= */
  const validateQr = async (qr: string) => {
    try {
      setVerifyLoading(true)
      const data = await validateQrService(qr)
      setValidationData(data)
      goToStep('confirm')
    } catch (err) {
      setVerifyError('QR inválido')
      console.error(err)
    } finally {
      setVerifyLoading(false)
    }
  }

  const validateManual = async (payload: { code: string }) => {
    const code = payload.code.trim().toUpperCase()

    if (code.length !== 6) {
      setVerifyError('El código debe tener exactamente 6 caracteres')
      return
    }

    try {
      setVerifyLoading(true)
      const data = await validateQrByCode(code)
      setValidationData(data)
      goToStep('confirm')
    } catch (err) {
      setVerifyError('Código inválido')
      console.error(err)
    } finally {
      setVerifyLoading(false)
    }
  }

  const validateByField = async (payload: {
    benefitId: number
    value: string
  }) => {
    if (!payload.value.trim()) {
      setVerifyError('Ingresa un valor para buscar')
      return
    }

    try {
      setVerifyLoading(true)
      const data = await searchBenefitByField(payload.benefitId, payload.value)
      setValidationData(data)
      goToStep('confirm')
    } catch (err) {
      setVerifyError('No se encontró un beneficio pendiente con ese dato')
      console.error(err)
    } finally {
      setVerifyLoading(false)
    }
  }

  const redeemBenefit = async (id: string) => {
    try {
      setVerifyLoading(true)
      await redeemQrService(id)
      goToStep('success')
      fetchHistory()
    } catch (err) {
      setVerifyError('No fue posible redimir el beneficio')
      console.error(err)
    } finally {
      setVerifyLoading(false)
    }
  }

  /* ========================= */
  return (
    <div className="space-y-8">
      {/* Bienvenida - discreta */}
      <p className="text-sm text-gray-500">
        Bienvenido, <span className="font-medium text-gray-700">{user?.name}</span>
        {' '}— gestiona tu comercio y verifica miembros UVA.
      </p>

      {/* ===== Verificar beneficios ===== */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <Gift className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Verificar beneficios
            </h2>
            <p className="text-sm text-gray-600">
              Consulta y redime los beneficios de tu comercio
            </p>
          </div>
        </div>

        {verifyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {verifyError}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
              searchableFields.length > 0 ? 'lg:grid-cols-3' : ''
            }`}
          >
            <button
              onClick={() => goToStep('scan')}
              disabled={verifyLoading}
              className="group border rounded-xl p-6 text-center hover:shadow-lg transition disabled:opacity-50"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
                📷
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Escanear QR
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Escanea el código QR presentado por el usuario
              </p>
            </button>

            <button
              onClick={() => goToStep('manual')}
              disabled={verifyLoading}
              className="group border rounded-xl p-6 text-center hover:shadow-lg transition disabled:opacity-50"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
                🔢
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verificar por código
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Ingresa el código de 6 caracteres del beneficio
              </p>
            </button>

            {searchableFields.length > 0 && (
              <button
                onClick={() => goToStep('field')}
                disabled={verifyLoading}
                className="group border rounded-xl p-6 text-center hover:shadow-lg transition disabled:opacity-50"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
                  🔍
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {searchFieldLabel}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Busca el beneficio a partir de otro dato del usuario
                </p>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== Histórico de beneficios ===== */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-green-100 rounded-xl">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Histórico de beneficios
            </h2>
            <p className="text-sm text-gray-600">
              Beneficios redimidos recientemente
            </p>
          </div>
        </div>

        {historyLoading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">Cargando histórico...</p>
          </div>
        )}

        {!historyLoading && historyError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            {historyError}
          </div>
        )}

        {!historyLoading && !historyError && history.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            No hay beneficios redimidos aún
          </div>
        )}

        {!historyLoading && !historyError && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden overflow-x-auto">
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
                {history.map(item => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{item.userName}</td>
                    <td className="px-4 py-3">
                      <span>{item.benefitName}</span>
                      {item.customFields && item.customFields.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.customFields
                            .map(field => `${field.label}: ${field.value}`)
                            .join(', ')}
                        </p>
                      )}
                    </td>
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
      </section>

      {/* ===== MODALS ===== */}
      {step === 'scan' && (
        <ScanQrModal
          onClose={() => goToStep('idle')}
          onScan={async (qr: string) => {
            await validateQr(qr)
          }}
        />
      )}

      {step === 'manual' && (
        <ManualModal
          onClose={() => goToStep('idle')}
          onSubmit={async payload => {
            await validateManual(payload)
          }}
        />
      )}

      {step === 'field' && (
        <SearchByFieldModal
          fields={searchableFields}
          onClose={() => goToStep('idle')}
          onSubmit={async payload => {
            await validateByField(payload)
          }}
        />
      )}

      {step === 'confirm' && validationData && (
        <ConfirmModal
          data={{
            userName: validationData.userName,
            benefitName: validationData.benefitName,
            customFields: validationData.customFields,
          }}
          onCancel={() => goToStep('idle')}
          onConfirm={async () => {
            await redeemBenefit(validationData.qrId)
          }}
        />
      )}

      {step === 'success' && (
        <SuccessModal onClose={() => goToStep('idle')} />
      )}

      {/* Loader */}
      {verifyLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-xl shadow-md text-gray-900">
            Procesando...
          </div>
        </div>
      )}
    </div>
  )
}
