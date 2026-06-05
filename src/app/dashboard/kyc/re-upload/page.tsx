'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Title from '../../components/ui/Title';
import DocumentUploadZone from '../components/DocumentUploadZone';
import { useKyc } from '@/app/core/hooks/useKyc';
import {
  KYC_DOCUMENT_TYPES,
  KYC_DOCUMENT_LABELS,
  KYC_DOCUMENT_DESCRIPTIONS,
  type KycDocumentType
} from '@/app/core/types/kyc';

function ReUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawDoc = searchParams.get('document');

  const documentType = KYC_DOCUMENT_TYPES.includes(rawDoc as KycDocumentType)
    ? (rawDoc as KycDocumentType)
    : null;

  const {
    verifications,
    fetchStatus,
    selections,
    setFile,
    uploadStatus,
    uploadError,
    uploadProgress,
    submitSingle,
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

  if (!documentType) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle size={40} className="text-amber-400" />
          <p className="text-gray-300 font-medium">Documento no válido</p>
          <button
            onClick={() => router.push('/dashboard/kyc')}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Volver a verificación
          </button>
        </div>
      </Layout>
    );
  }

  const existingStatus = verifications.find(
    (v) => v.document_type === documentType
  )?.status;

  const hasFile = selections[documentType].file !== null;

  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push('/dashboard/kyc')}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>

        <Title title="Corregir Documento" />

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert
              size={18}
              className="text-amber-400 mt-0.5 flex-shrink-0"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-200">
                Documento rechazado
              </p>
              <p className="text-xs text-gray-400">
                Sube una nueva foto que cumpla con los requisitos. Asegúrate de
                que sea nítida, legible y en formato JPEG, PNG o WebP (máx. 5MB).
              </p>
            </div>
          </div>
        </div>

        {uploadStatus === 'success' && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-300">
                ¡Documento enviado exitosamente!
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Redirigiendo a tu estado de verificación...
              </p>
            </div>
          </div>
        )}

        {uploadStatus !== 'success' && (
          <div className="rounded-xl border border-white/[0.06] bg-[#1E1B3A] p-5">
            <DocumentUploadZone
              documentType={documentType}
              label={KYC_DOCUMENT_LABELS[documentType]}
              description={KYC_DOCUMENT_DESCRIPTIONS[documentType]}
              selection={selections[documentType]}
              progress={uploadProgress[documentType]}
              existingStatus={existingStatus}
              onFileChange={(file) => setFile(documentType, file)}
              disabled={uploadStatus === 'loading'}
            />
          </div>
        )}

        {uploadError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{uploadError}</p>
          </div>
        )}

        {uploadStatus !== 'success' && (
          <button
            onClick={() => submitSingle(documentType)}
            disabled={!hasFile || uploadStatus === 'loading'}
            className="w-full gradient-bg hover:scale-[1.01] transition-all duration-200 text-white font-semibold py-4 px-6 rounded-xl border border-white/20 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {uploadStatus === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar documento'
            )}
          </button>
        )}
      </div>
    </Layout>
  );
}

export default function KycReUploadPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-purple-400 animate-spin" />
          </div>
        </Layout>
      }
    >
      <ReUploadContent />
    </Suspense>
  );
}
