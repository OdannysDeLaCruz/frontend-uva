'use client';

import { useState, useCallback } from 'react';
import {
  getMembershipInfo,
  createWompiTransaction,
  pollPaymentStatus,
  MembershipInfoResponse,
  WompiTransactionResponse,
  PaymentStatusResponse,
} from '../services/payments-service';

export type PaymentStatus = 'idle' | 'loading' | 'creating' | 'success' | 'error' | 'polling';

export interface CreateTransactionOptions {
  membershipId?: number;
  redirectUrl?: string;
}

export interface UseWompiPaymentReturn {
  status: PaymentStatus;
  error: string | null;
  membershipInfo: MembershipInfoResponse | null;
  transactionData: WompiTransactionResponse | null;
  paymentResult: PaymentStatusResponse | null;
  loadMembershipInfo: (membershipId?: number) => Promise<void>;
  createTransaction: (options?: CreateTransactionOptions) => Promise<WompiTransactionResponse | null>;
  pollStatus: (transactionId: number) => Promise<void>;
  reset: () => void;
}

/**
 * Hook para manejar lógica de pago con Wompi
 *
 * Flujo:
 * 1. loadMembershipInfo() - Al cargar página, obtiene info de membresía
 * 2. createTransaction() - Cuando usuario hace clic en "Pagar", crea transacción
 * 3. Abrir widget con transactionData
 * 4. pollStatus() - Después del pago, consulta estado
 */
export function useWompiPayment(): UseWompiPaymentReturn {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfoResponse | null>(null);
  const [transactionData, setTransactionData] = useState<WompiTransactionResponse | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentStatusResponse | null>(null);

  /**
   * Cargar información de membresía (sin crear transacción)
   */
  const loadMembershipInfo = useCallback(async (membershipId?: number) => {
    try {
      setStatus('loading');
      setError(null);

      const response = await getMembershipInfo(membershipId);
      setMembershipInfo(response);
      setStatus('idle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar información';
      setError(errorMessage);
      setStatus('error');
    }
  }, []);

  /**
   * Crear transacción de pago (cuando usuario hace clic en "Pagar")
   * Retorna los datos para abrir el widget
   */
  const createTransaction = useCallback(async (options?: CreateTransactionOptions): Promise<WompiTransactionResponse | null> => {
    try {
      setStatus('creating');
      setError(null);

      const response = await createWompiTransaction({
        membershipId: options?.membershipId,
        redirectUrl: options?.redirectUrl
      });
      setTransactionData(response);
      setStatus('idle');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear transacción';
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  }, []);

  /**
   * Polling del estado del pago después de que el widget cierra
   */
  const pollStatus = useCallback(async (transactionId: number) => {
    try {
      setStatus('polling');
      setError(null);

      const result = await pollPaymentStatus(transactionId);
      setPaymentResult(result);

      if (result.status === 'APPROVED') {
        setStatus('success');
      } else if (result.status === 'DECLINED' || result.status === 'CANCELLED') {
        setStatus('error');
        setError(result.errorMessage || `Pago ${result.status}`);
      } else if (result.status === 'EXPIRED') {
        setStatus('error');
        setError('El enlace de pago expiró');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al consultar estado';
      setError(errorMessage);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTransactionData(null);
    setPaymentResult(null);
  }, []);

  return {
    status,
    error,
    membershipInfo,
    transactionData,
    paymentResult,
    loadMembershipInfo,
    createTransaction,
    pollStatus,
    reset,
  };
}
