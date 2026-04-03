'use client';

import { useState, useCallback } from 'react';
import {
  getMembershipInfo,
  createBoldTransaction,
  pollPaymentStatus,
  MembershipInfoResponse,
  BoldTransactionResponse,
  PaymentStatusResponse,
} from '../services/payments-service';

export type PaymentStatus = 'idle' | 'loading' | 'creating' | 'success' | 'error' | 'polling';

export interface CreateTransactionOptions {
  membershipId?: number;
  redirectUrl?: string;
}

export interface UsePaymentReturn {
  status: PaymentStatus;
  error: string | null;
  membershipInfo: MembershipInfoResponse | null;
  transactionData: BoldTransactionResponse | null;
  paymentResult: PaymentStatusResponse | null;
  loadMembershipInfo: (membershipId?: number) => Promise<void>;
  createTransaction: (options?: CreateTransactionOptions) => Promise<BoldTransactionResponse | null>;
  pollStatus: (transactionId: number) => Promise<void>;
  reset: () => void;
}

/**
 * Hook para manejar lógica de pago con Bold
 *
 * Flujo:
 * 1. loadMembershipInfo() — Al cargar página, obtiene info de membresía
 * 2. createTransaction()  — Cuando usuario hace clic en "Pagar", crea transacción
 * 3. Abrir widget Bold con transactionData (window.BoldCheckout)
 * 4. pollStatus()         — Después del pago (vía redirect o evento), consulta estado
 */
export function useWompiPayment(): UsePaymentReturn {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfoResponse | null>(null);
  const [transactionData, setTransactionData] = useState<BoldTransactionResponse | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentStatusResponse | null>(null);

  const loadMembershipInfo = useCallback(async (membershipId?: number) => {
    try {
      setStatus('loading');
      setError(null);
      const response = await getMembershipInfo(membershipId);
      setMembershipInfo(response);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información');
      setStatus('error');
    }
  }, []);

  const createTransaction = useCallback(
    async (options?: CreateTransactionOptions): Promise<BoldTransactionResponse | null> => {
      try {
        setStatus('creating');
        setError(null);
        const response = await createBoldTransaction({
          membershipId: options?.membershipId,
          redirectUrl: options?.redirectUrl,
        });
        setTransactionData(response);
        setStatus('idle');
        return response;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear transacción');
        setStatus('error');
        return null;
      }
    },
    []
  );

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
      setError(err instanceof Error ? err.message : 'Error al consultar estado');
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
