'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/app/dashboard/components/layout/Layout';
import { getWompiTransactionStatus } from '@/app/core/services/payments-service';

type PaymentStatus = 'loading' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'PENDING' | 'ERROR';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    setTransactionId(id);

    if (!id) {
      setStatus('ERROR');
      return;
    }

    const checkTransaction = async () => {
      try {
        const data = await getWompiTransactionStatus(id);
        setStatus(data.status);
      } catch {
        setStatus('ERROR');
      }
    };

    checkTransaction();
  }, [searchParams]);

  const statusConfig: Record<PaymentStatus, { title: string; message: string; color: string; icon: string }> = {
    loading: {
      title: 'Verificando pago...',
      message: 'Por favor espera mientras confirmamos tu transacción.',
      color: 'text-sky-400',
      icon: '⏳'
    },
    APPROVED: {
      title: '¡Pago exitoso!',
      message: 'Tu membresía ha sido activada correctamente.',
      color: 'text-green-400',
      icon: '✓'
    },
    DECLINED: {
      title: 'Pago rechazado',
      message: 'Tu pago fue rechazado. Por favor intenta con otro método de pago.',
      color: 'text-red-400',
      icon: '✗'
    },
    VOIDED: {
      title: 'Pago anulado',
      message: 'La transacción fue anulada.',
      color: 'text-yellow-400',
      icon: '!'
    },
    PENDING: {
      title: 'Pago pendiente',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      color: 'text-yellow-400',
      icon: '⏳'
    },
    ERROR: {
      title: 'Error',
      message: 'No pudimos verificar el estado de tu pago. Por favor contacta soporte.',
      color: 'text-red-400',
      icon: '!'
    }
  };

  const config = statusConfig[status];

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="border-2 border-sky-400 rounded-lg p-8 max-w-md w-full text-center">
          <div className={`text-6xl mb-4 ${config.color}`}>
            {config.icon}
          </div>

          <h1 className={`text-3xl font-semibold mb-4 ${config.color}`}>
            {config.title}
          </h1>

          <p className="text-gray-300 mb-6">
            {config.message}
          </p>

          {transactionId && (
            <p className="text-sm text-gray-500 mb-6">
              ID: {transactionId}
            </p>
          )}

          {status !== 'loading' && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/dashboard/membership')}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                Volver a Membresía
              </button>

              {(status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') && (
                <button
                  onClick={() => router.push('/dashboard/membership')}
                  className="px-6 py-2 border border-sky-400 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors"
                >
                  Intentar de nuevo
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
