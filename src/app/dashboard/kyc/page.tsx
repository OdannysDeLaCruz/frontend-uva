'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldX,
  Clock,
  AlertTriangle,
  IdCard,
  Camera,
  CheckCircle2,
  Loader2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Title from '../components/ui/Title';
import { useKyc } from '@/app/core/hooks/useKyc';
import {
  KYC_DOCUMENT_TYPES,
  KYC_DOCUMENT_LABELS,
  KYC_DOCUMENT_DESCRIPTIONS,
  type KycDocumentType,
  type KycStatus
} from '@/app/core/types/kyc';

const STATUS_CONFIG: Record<
  KycStatus | 'NOT_SUBMITTED',
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  NOT_SUBMITTED: {
    label: 'Sin enviar',
    badgeClass: 'text-gray-400 bg-gray-400/10 border border-gray-400/20',
    icon: <Clock size={14} />
  },
  PENDING: {
    label: 'Pendiente',
    badgeClass: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
    icon: <Clock size={14} />
  },
  IN_REVIEW: {
    label: 'En revisión',
    badgeClass: 'text-white bg-blue-400/80 border border-blue-400/20',
    icon: <Loader2 size={14} className="animate-spin" />
  },
  APPROVED: {
    label: 'Aprobado',
    badgeClass: 'text-white bg-green-400/80 border border-emerald-400/20',
    icon: <CheckCircle2 size={14} />
  },
  REJECTED: {
    label: 'Rechazado',
    badgeClass: 'text-white bg-red-500 border border-red-500',
    icon: <ShieldX size={14} />
  },
  EXPIRED: {
    label: 'Expirado',
    badgeClass: 'text-white bg-red-500 border border-red-500',
    icon: <AlertTriangle size={14} />
  }
};

const DOC_ICONS: Record<KycDocumentType, React.ReactNode> = {
  NATIONAL_IDENTITY_CARD_FRONT: <IdCard size={22} className="text-purple-400" />,
  NATIONAL_IDENTITY_CARD_BACK: <IdCard size={22} className="text-purple-400" />,
  NATIONAL_IDENTITY_CARD_SELFIE: <Camera size={22} className="text-purple-400" />
};

function StatusBadge({ status }: { status: KycStatus | 'NOT_SUBMITTED' }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.badgeClass}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export default function KycPage() {
  const router = useRouter();
  const { verifications, statusLoading, statusError, fetchStatus } = useKyc();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getVerification = (docType: KycDocumentType) =>
    verifications.find((v) => v.document_type === docType);

  const allApproved =
    verifications.length === 3 &&
    verifications.every((v) => v.status === 'APPROVED');

  const hasRejected = verifications.some(
    (v) => v.status === 'REJECTED' || v.status === 'EXPIRED'
  );

  const hasSubmitted = verifications.length > 0;

  const allPendingOrReview =
    hasSubmitted &&
    !allApproved &&
    !hasRejected &&
    verifications.every(
      (v) => v.status === 'PENDING' || v.status === 'IN_REVIEW'
    );

  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="Verificación KYC" />

        {statusLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-purple-400 animate-spin" />
          </div>
        )}

        {statusError && !statusLoading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between">
            <p className="text-sm text-red-400">{statusError}</p>
            <button
              onClick={fetchStatus}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              <RefreshCw size={12} />
              Reintentar
            </button>
          </div>
        )}

        {!statusLoading && !statusError && (
          <>
            {allApproved && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-300 text-lg">
                    Identidad Verificada
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Todos tus documentos han sido aprobados correctamente.
                  </p>
                </div>
              </div>
            )}

            {allPendingOrReview && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-300">
                    Documentos en revisión
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Estamos revisando tus documentos. Te notificaremos cuando
                    haya novedades.
                  </p>
                </div>
              </div>
            )}

            {hasRejected && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-center gap-3">
                <AlertTriangle
                  size={20}
                  className="text-amber-400 flex-shrink-0"
                />
                <div>
                  <p className="font-medium text-amber-300">
                    Algunos documentos requieren atención
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Revisa los documentos rechazados abajo y vuelve a subirlos.
                  </p>
                </div>
              </div>
            )}

            {!hasSubmitted && (
              <div className="rounded-xl border border-white/[0.06] bg-[#1E1B3A] p-8 flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-purple-400" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Verifica tu identidad
                  </h3>
                  <p className="text-sm text-gray-400">
                    Para acceder a todos los beneficios de UVA, necesitas
                    completar la verificación de tu identidad. El proceso toma
                    menos de 5 minutos.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/kyc/upload')}
                  className="gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold py-3 px-8 rounded-xl border border-white/20 shadow-lg flex items-center gap-2"
                >
                  Iniciar Verificación
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KYC_DOCUMENT_TYPES.map((docType) => {
                const verification = getVerification(docType);
                const status = (verification?.status ?? 'NOT_SUBMITTED') as
                  | KycStatus
                  | 'NOT_SUBMITTED';

                return (
                  <div
                    key={docType}
                    className="rounded-xl border border-blue-500/50 bg- [#1E1B3A] p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between flex-col gap-2">
                      <div className="flex items-center gap-2.5">
                        {DOC_ICONS[docType]}
                        <p className="text-sm font-semibold text-gray-100 leading-tight">
                          {KYC_DOCUMENT_LABELS[docType]}
                        </p>
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    {status !== 'APPROVED' && (
                      <p className="text-sm text-white leading-relaxed">
                        {KYC_DOCUMENT_DESCRIPTIONS[docType]}
                      </p>
                    )}


                    {verification?.rejection_reason && (
                      <div className="rounded-lg bg-[#FF6B6B]/20 p-3">
                        <p className="text-sm text-[#FF6B6B]">
                          <span className="font-semibold">Motivo: </span>
                          {verification.rejection_reason}
                        </p>
                      </div>
                    )}

                    {verification && (
                      <p className="text-sm text-gray-400">
                        Archivo enviado el {' '}
                        {new Date(verification.updated_at).toLocaleDateString(
                          'es-CO',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }
                        )}
                      </p>
                    )}

                    {(status === 'REJECTED' || status === 'EXPIRED') && (
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/kyc/re-upload?document=${docType}`
                          )
                        }
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-black bg-[#00F2FE] hover:bg-[#00F2FE]/60 rounded-lg py-2 transition-colors uppercase cursor-pointer"
                      >
                        Reintentar
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {hasSubmitted &&
              verifications.length < 3 &&
              !allPendingOrReview &&
              !allApproved && (
                <div className="flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/kyc/upload')}
                    className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Completar verificación
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </Layout>
  );
}
