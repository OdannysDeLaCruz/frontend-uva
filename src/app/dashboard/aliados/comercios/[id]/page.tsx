'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, X } from 'lucide-react'
import { getAllyById } from '@/app/core/services/allies-service'
import { Ally } from '@/app/core/types/ally'
import Image from 'next/image'
import { GenerateQrBenefitResponse, BenefitCustomField, CustomFieldValueInput } from '@/app/core/types/benefit'
import { generateBenefitQr, getBenefitCustomFields } from '@/app/core/services/benefits-service'
import { getTimeRemaining } from '@/app/dashboard/util/util'
import { QRCodeCanvas } from 'qrcode.react'
import { isApiError } from '@/app/core/utils/error-handler'
import BenefitCustomFieldsForm from '@/app/dashboard/aliados/components/BenefitCustomFieldsForm'

type ModalStep = 'terms' | 'fields' | 'qr'

const AllyDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [ally, setAlly] = useState<Ally | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState<ModalStep>('terms')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [qrData, setQrData] = useState<GenerateQrBenefitResponse | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [pendingBenefitId, setPendingBenefitId] = useState<number | null>(null)
  const [customFields, setCustomFields] = useState<BenefitCustomField[]>([])
  const [fieldValues, setFieldValues] = useState<Record<number, string>>({})
  const [fieldsLoading, setFieldsLoading] = useState(false)

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

  // Verificar si el usuario ya aceptó los términos
  useEffect(() => {
    const accepted = localStorage.getItem('benefit-terms-accepted')
    if (accepted === 'true') {
      setTermsAccepted(true)
    }
  }, [])

  const handleBenefitError = (error: unknown) => {
    if (isApiError(error)) {
      const msg = Array.isArray(error.message) ? error.message.join(', ') : error.message
      alert(msg)
    } else {
      alert('Ocurrió un error inesperado')
    }
  }

  const requestQr = async (benefitId: number, customFieldValues: CustomFieldValueInput[]) => {
    if (!ally) return;
    try {
      setQrLoading(true)

      const qr = await generateBenefitQr(benefitId, ally.id, customFieldValues)

      setQrData(qr)
      setModalStep('qr')
      setShowModal(true)
    } catch (error: unknown) {
      handleBenefitError(error)
      if (customFields.length > 0) {
        setModalStep('fields')
        setShowModal(true)
      }
    } finally {
      setQrLoading(false)
    }
  }

  const proceedAfterTerms = async (benefitId: number) => {
    if (!ally) return;
    try {
      setFieldsLoading(true)

      const fields = await getBenefitCustomFields(benefitId)
      const sortedFields = [...fields].sort((a, b) => a.order - b.order)
      setCustomFields(sortedFields)
      setFieldValues({})

      if (sortedFields.length === 0) {
        await requestQr(benefitId, [])
      } else {
        setModalStep('fields')
        setShowModal(true)
      }
    } catch (error: unknown) {
      handleBenefitError(error)
    } finally {
      setFieldsLoading(false)
    }
  }

  const handleClaimBenefit = async (benefitId: number) => {
    if (!ally) return;
    setPendingBenefitId(benefitId)

    if (!termsAccepted) {
      setModalStep('terms')
      setShowModal(true)
      return
    }

    await proceedAfterTerms(benefitId)
  }

  const handleAcceptTerms = async () => {
    if (!ally) return;
    setTermsAccepted(true)
    localStorage.setItem('benefit-terms-accepted', 'true')
    if (pendingBenefitId) {
      await proceedAfterTerms(pendingBenefitId)
    }
  }

  const handleFieldChange = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const isFieldsFormValid = customFields.every(
    (field) => !field.isRequired || (fieldValues[field.id] ?? '').trim().length > 0
  )

  const handleSubmitFields = async () => {
    if (!pendingBenefitId) return
    const customFieldValues: CustomFieldValueInput[] = customFields
      .filter((field) => (fieldValues[field.id] ?? '').trim().length > 0)
      .map((field) => ({ customFieldId: field.id, value: fieldValues[field.id].trim() }))

    await requestQr(pendingBenefitId, customFieldValues)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalStep('terms')
    setPendingBenefitId(null)
    setCustomFields([])
    setFieldValues({})
    setQrData(null)
  }

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
        <div className="rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:grid md:grid-cols-3">
            <div className="md:col-span-1">
              <Image
                src={ally.photo}
                alt={ally.name}
                width={400}
                height={400}
                className="w-full object-content"
              />
            </div>
            <div className="md:col-span-2 p-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{ally.name}</h1>

              <div
                className="prose max-w-none text-gray-700 text-xl font-semibold"
                dangerouslySetInnerHTML={{ __html: ally.description }}
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {ally.benefits && ally.benefits.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-2 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios Disponibles</h2>
            <div className="flex flex-col gap-6">
              {/* Benefit Card */}
              {ally.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="border border-gray-200 rounded-4xl md:rounded-3xl overflow-hidden hover:shadow-md transition-shadow flex flex-col-reverse md:flex-row p-2 md:p-6 gap-6"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div className='text-black'>
                      <h3 className="font-semibold text-xl mb-2">
                        {benefit.name}
                      </h3>
                      <p className="text-md mb-5">{benefit.description}</p>

                      {/* Promocion valida */}
                      <p className="text-md font-semibold mb-2">Promoción válida</p>

                      {(benefit.dateStart || benefit.dateEnd) && (
                        <div className="flex items-center text-md text-gray-500">
                          <Calendar size={24} className="mr-2" />
                          {benefit.dateStart && formatDate(benefit.dateStart)}
                          {benefit.dateStart && benefit.dateEnd && ' - '}
                          {benefit.dateEnd && formatDate(benefit.dateEnd)}
                        </div>
                      )}
                    </div>

                    {/* Boton para reclamar descuento */}
                    <button
                      onClick={() => handleClaimBenefit(benefit.id)}
                      disabled={fieldsLoading || qrLoading}
                      className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-sm font-semibold hover:bg-purple-700 transition-colors self-start uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reclamar tu beneficio
                    </button>
                  </div>
                  <Image
                    src={benefit.image}
                    alt={benefit.name}
                    width={200}
                    height={200}
                    className="flex-shrink-0 self-stretch w-auto object-contain rounded-r-3xl"
                  />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {modalStep === 'terms' && (
              // Términos y Condiciones
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Términos y Condiciones</h2>
                <div className="prose max-w-none mb-6 text-gray-700">
                  <p className="mb-4">
                    Al aceptar estos términos y condiciones, usted acepta lo siguiente:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>El beneficio es personal e intransferible.</li>
                    <li>Debe presentar el código QR al momento de reclamar el beneficio.</li>
                    <li>El beneficio está sujeto a disponibilidad del comercio aliado.</li>
                    <li>UVA no se hace responsable por la calidad de los productos o servicios ofrecidos por el comercio aliado.</li>
                    <li>El comercio aliado se reserva el derecho de validar la autenticidad del código QR.</li>
                    <li>Este beneficio no es acumulable con otras promociones.</li>
                    <li>El beneficio tiene una vigencia determinada según las condiciones del comercio.</li>
                    <li>UVA puede modificar o cancelar beneficios sin previo aviso.</li>
                  </ul>
                  <p className="mt-4">
                    Al hacer clic en Aceptar, confirma que ha leído y acepta estos términos y condiciones.
                  </p>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAcceptTerms}
                    disabled={fieldsLoading || qrLoading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'fields' && (
              // Campos extra del beneficio
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Información adicional</h2>
                <p className="text-gray-600 mb-6">
                  Este comercio requiere algunos datos adicionales para procesar tu beneficio.
                </p>
                <BenefitCustomFieldsForm
                  fields={customFields}
                  values={fieldValues}
                  onChange={handleFieldChange}
                />
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitFields}
                    disabled={!isFieldsFormValid || qrLoading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'qr' && (
              // Código QR
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu Código QR</h2>
                <p className="text-gray-600 mb-6">
                  Presenta este código en el comercio aliado para reclamar tu beneficio
                </p>
                <div className="flex justify-center mb-4">
                  {qrLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
                    </div>
                  ) : (
                    qrData && (
                      <>
                        <QRCodeCanvas
                          value={qrData.qr ?? qrData.code}
                          size={300}
                        />
                      </>
                    )
                  )}
                </div>
                {/* Código */}
                  {qrData && !qrLoading && (
                    <div className="flex flex-col items-center mb-4">
                      <span className="text-sm text-gray-500 tracking-wide">
                        Código
                      </span>

                      <span className="text-3xl font-bold text-gray-900 tracking-widest mt-1">
                        {qrData.code}
                      </span>
                    </div>
                  )}
              {/* Expiración */}
                {qrData?.expiresAt && (
                  <p className="text-sm text-gray-500">
                    ⏳ Expira en{' '}
                    <span className="font-medium text-gray-700">
                      {getTimeRemaining(qrData.expiresAt)}
                    </span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Este código es válido para un solo uso
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AllyDetailPage
