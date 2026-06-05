'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Title from '../../components/ui/Title';
import DocumentUploadZone from '../components/DocumentUploadZone';
import { useKyc } from '@/app/core/hooks/useKyc';
import {
  KYC_DOCUMENT_TYPES,
  KYC_DOCUMENT_LABELS,
  KYC_DOCUMENT_DESCRIPTIONS
} from '@/app/core/types/kyc';

export default function KycUploadPage() {
  const router = useRouter();
  const {
    verifications,
    fetchStatus,
    selections,
    setFile,
    uploadStatus,
    uploadError,
    uploadProgress,
    submitAll,
    allSelected,
    reset
  } = useKyc();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (uploadStatus === 'success') {
      const t = setTimeout(() => router.push('/dashboard/kyc'), 1500);
      return () => clearTimeout(t);
    }
  }, [uploadStatus, router]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const getExistingStatus = (docType: typeof KYC_DOCUMENT_TYPES[number]) =>
    verifications.find((v) => v.document_type === docType)?.status;

  const selectedCount = KYC_DOCUMENT_TYPES.filter(
    (t) => selections[t].file !== null
  ).length;

  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push('/dashboard/kyc')}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>

        <Title title="Subir Documentos" />

        {/* Instrucciones */}
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-200">Requisitos de los documentos</p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Las fotos deben ser nítidas y legibles</li>
                <li>Tamaño máximo por archivo: 5MB</li>
                <li>Formatos aceptados: JPEG, PNG, WebP</li>
                <li>La selfie debe mostrar claramente tu rostro y el documento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progreso de selección */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300"
              style={{ width: `${(selectedCount / 3) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {selectedCount} / 3 seleccionados
          </span>
        </div>

        {/* Success overlay */}
        {uploadStatus === 'success' && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-300">¡Documentos enviados exitosamente!</p>
              <p className="text-sm text-gray-400 mt-1">Redirigiendo a tu estado de verificación...</p>
            </div>
          </div>
        )}

        {/* Upload zones */}
        {uploadStatus !== 'success' && (
          <div className="space-y-6">
            {KYC_DOCUMENT_TYPES.map((docType) => (
              <div
                key={docType}
                className="rounded-xl border border-white/[0.06] bg-[#1E1B3A] p-5"
              >
                <DocumentUploadZone
                  documentType={docType}
                  label={KYC_DOCUMENT_LABELS[docType]}
                  description={KYC_DOCUMENT_DESCRIPTIONS[docType]}
                  selection={selections[docType]}
                  progress={uploadProgress[docType]}
                  existingStatus={getExistingStatus(docType)}
                  onFileChange={(file) => setFile(docType, file)}
                  disabled={uploadStatus === 'loading'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Error banner */}
        {uploadError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{uploadError}</p>
            <p className="text-xs text-gray-500 mt-1">
              Los documentos ya subidos no se perderán. Puedes reintentar.
            </p>
          </div>
        )}

        {/* Submit button */}
        {uploadStatus !== 'success' && (
          <button
            onClick={submitAll}
            disabled={!allSelected || uploadStatus === 'loading'}
            className="w-full gradient-bg hover:scale-[1.01] transition-all duration-200 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {uploadStatus === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enviando documentos...
              </>
            ) : (
              'Enviar documentos'
            )}
          </button>
        )}
      </div>
    </Layout>
  );
}
