'use client';

import { useState, useCallback } from 'react';
import {
  initWompiPayment,
  pollPaymentStatus,
  WompiInitResponse,
  PaymentStatusResponse,
} from '../services/payments-service';

export type PaymentStatus = 'idle' | 'loading' | 'success' | 'error' | 'polling';

export interface UseWompiPaymentReturn {
  status: PaymentStatus;
  error: string | null;
  paymentData: WompiInitResponse | null;
  paymentStatus: PaymentStatusResponse | null;
  initPayment: (membershipId?: number) => Promise<void>;
  pollStatus: (transactionId: number) => Promise<void>;
  reset: () => void;
}

/**
 * Hook para manejar lógica de pago con Wompi
 *
 * Maneja:
 * - Inicializar pago
 * - Polling de estado
 * - Manejo de errores
 * - Estados de carga
 */
export function useWompiPayment(): UseWompiPaymentReturn {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<WompiInitResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);

  const initPayment = useCallback(async (membershipId?: number) => {
    try {
      setStatus('loading');
      setError(null);

      const response = await initWompiPayment({ membershipId });
      setPaymentData(response);
      setStatus('idle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      setError(errorMessage);
      setStatus('error');
    }
  }, []);

  const pollStatus = useCallback(async (transactionId: number) => {
    try {
      setStatus('polling');
      setError(null);

      const status = await pollPaymentStatus(transactionId);
      setPaymentStatus(status);

      if (status.status === 'APPROVED') {
        setStatus('success');
      } else if (status.status === 'DECLINED' || status.status === 'CANCELLED') {
        setStatus('error');
        setError(status.errorMessage || `Payment ${status.status}`);
      } else if (status.status === 'EXPIRED') {
        setStatus('error');
        setError('Payment link expired');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to poll payment status';
      setError(errorMessage);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setPaymentData(null);
    setPaymentStatus(null);
  }, []);

  return {
    status,
    error,
    paymentData,
    paymentStatus,
    initPayment,
    pollStatus,
    reset,
  };
}
