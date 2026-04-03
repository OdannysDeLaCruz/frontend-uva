'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/app/dashboard/components/layout/Layout';
import { getPaymentStatusByReference, pollPaymentStatus } from '@/app/core/services/payments-service';

type PaymentStatus = 'loading' | 'APPROVED' | 'DECLINED' | 'CANCELLED' | 'PENDING' | 'ERROR';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [displayId, setDisplayId] = useState<string | null>(null);

  useEffect(() => {
    // Bold devuelve: bold-order-id, bold-tx-id, bold-status como query params
    const boldOrderId = searchParams.get('bold-order-id');
    const boldTxId = searchParams.get('bold-tx-id');
    const boldStatus = searchParams.get('bold-status');

    if (boldOrderId) {
      setDisplayId(boldTxId ?? boldOrderId);
      handleBoldCallback(boldOrderId, boldStatus);
      return;
    }

    setStatus('ERROR');
  }, [searchParams]);

  /**
   * Consulta el estado real de la transacción en nuestro backend.
   * Bold puede devolver status en el redirect, pero el estado autoritativo
   * es el que procesó el webhook.
   */
  const handleBoldCallback = async (orderId: string, boldStatus: string | null) => {
    try {
      // Si Bold ya nos dice el status en el redirect, lo usamos como estado inicial
      // mientras esperamos la confirmación del backend
      if (boldStatus === 'APPROVED') {
        setStatus('APPROVED');
      } else if (boldStatus === 'REJECTED' || boldStatus === 'FAILED') {
        setStatus('DECLINED');
      } else if (boldStatus === 'ABANDONED') {
        setStatus('CANCELLED');
      }

      // Confirmar con nuestro backend (estado autoritativo procesado por el webhook)
      const data = await getPaymentStatusByReference(orderId);

      if (data.status === 'APPROVED') {
        setStatus('APPROVED');
      } else if (data.status === 'DECLINED') {
        setStatus('DECLINED');
      } else if (data.status === 'CANCELLED') {
        setStatus('CANCELLED');
      } else if (data.status === 'PENDING') {
        // Webhook aún no llegó — hacer polling
        await handlePendingStatus(data.id);
      } else {
        setStatus('ERROR');
      }
    } catch {
      setStatus('ERROR');
    }
  };

  /**
   * Si el webhook aún no llegó cuando el usuario regresa,
   * hacemos polling hasta obtener estado final.
   */
  const handlePendingStatus = async (transactionId: number) => {
    try {
      const result = await pollPaymentStatus(transactionId, 30, 3000);
      if (result.status === 'APPROVED') setStatus('APPROVED');
      else if (result.status === 'DECLINED') setStatus('DECLINED');
      else if (result.status === 'CANCELLED') setStatus('CANCELLED');
      else setStatus('ERROR');
    } catch {
      // Polling agotado — mostramos PENDING (el webhook llegará eventualmente)
      setStatus('PENDING');
    }
  };

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
    CANCELLED: {
      title: 'Pago cancelado',
      message: 'Cerraste el proceso de pago. Puedes intentarlo de nuevo cuando quieras.',
      color: 'text-yellow-400',
      icon: '!'
    },
    PENDING: {
      title: 'Pago en proceso',
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

          {displayId && (
            <p className="text-sm text-gray-500 mb-6">
              ID: {displayId}
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

              {(status === 'DECLINED' || status === 'CANCELLED' || status === 'ERROR') && (
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
