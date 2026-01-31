"use client"

import React, { useState } from "react"
import { Gift, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import ScanQrModal from "../components/ScanQrModal"
import ManualModal from "../components/ManualModal"
import ConfirmModal from "../components/ConfirmModal"
import SuccessModal from "../components/SuccessModal"
import { ValidateQrResponse } from '@/app/core/types/benefit'
import {
  validateQr as validateQrService,
  validateQrByCode,
  useQr as redeemQrService,
} from "@/app/core/services/benefits-service"

type Step = "idle" | "scan" | "manual" | "confirm" | "success"

export default function VerificarBeneficiosPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>("idle")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationData, setValidationData] =
    useState<ValidateQrResponse | null>(null)

  /* =========================
     helpers
     ========================= */
  const goToStep = (nextStep: Step) => {
    setError(null)
    setStep(nextStep)
  }

  /* =========================
     SERVICES
     ========================= */
  const validateQr = async (qr: string) => {
    try {
      setLoading(true)
      const data = await validateQrService(qr)
      setValidationData(data)
      goToStep("confirm")
    } catch (err) {
      setError("QR inválido")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateManual = async (payload: {
    code: string
    document: string
  }) => {
    const code = payload.code.trim().toUpperCase()

    if (code.length !== 6) {
      setError("El código debe tener exactamente 6 caracteres")
      return
    }

    try {
      setLoading(true)
      const data = await validateQrByCode(code, payload.document)
      setValidationData(data)
      goToStep("confirm")
    } catch (err) {
      setError("Código o documento inválidos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const redeemBenefit = async (id: string) => {
    try {
      setLoading(true)
      await redeemQrService(id)
      goToStep("success")
    } catch (err) {
      setError("No fue posible redimir el beneficio")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ========================= */
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

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

      {/* Opciones */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => goToStep("scan")}
            disabled={loading}
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
            onClick={() => goToStep("manual")}
            disabled={loading}
            className="group border rounded-xl p-6 text-center hover:shadow-lg transition disabled:opacity-50"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
              🔢
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Verificar por código
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Ingresa el código del beneficio y el número de documento
            </p>
          </button>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {step === "scan" && (
        <ScanQrModal
          onClose={() => goToStep("idle")}
          onScan={async (qr: string) => {
            await validateQr(qr)
          }}
        />
      )}

      {step === "manual" && (
        <ManualModal
          onClose={() => goToStep("idle")}
          onSubmit={async payload => {
            await validateManual(payload)
          }}
        />
      )}

      {step === "confirm" && validationData && (
        <ConfirmModal
          data={{ benefitName: validationData.benefitName }}
          onCancel={() => goToStep("idle")}
          onConfirm={async () => {
            await redeemBenefit(validationData.qrId)
          }}
        />
      )}

      {step === "success" && (
        <SuccessModal onClose={() => goToStep("idle")} />
      )}

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-xl shadow-md text-gray-900">
            Procesando...
          </div>
        </div>
      )}
    </div>
  )
}
