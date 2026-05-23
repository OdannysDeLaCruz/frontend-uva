/**
 * Servicio de Pagos para Frontend
 *
 * Maneja toda la lógica de comunicación con el backend para pagos con Wompi
 * Usa apiClient (axios instance) que automáticamente envía cookies de autenticación
 */

import apiClient from './api-client';

export interface MembershipInfoResponse {
  membershipId: number;
  membershipName: string;
  price: number;
  taxRate: number;
  taxAmount: number;
  taxAmountInCents: number;
  totalAmountInCents: number;
  amountInCents: number;
  currency: string;
  /** API key pública de Bold para el widget */
  apiKey: string;
  hasActiveSubscription: boolean;
  isExpired: boolean;
  isWithinGracePeriod: boolean;
  canRenew: boolean;
  gracePeriodDays: number;
  durationDays: number;
  subscription: {
    startDate: string;
    endDate: string;
    nextRenewalDate: string | null;
    status: string;
  } | null;
}

export interface WompiTransactionResponse {
  transactionId: number;
  reference: string;
  integritySignature: string;
  publicKey: string;
  amountInCents: number;
  baseAmountInCents: number;
  taxAmountInCents: number;
  currency: string;
  redirectUrl?: string;
}

export interface PaymentStatusResponse {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  createdAt: string;
  processedAt?: string;
  errorMessage?: string;
  message: string;
}

export interface WompiTransactionStatusResponse {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
  reference: string;
  amountInCents: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
  finalizedAt?: string;
  statusMessage?: string;
}

export interface BoldTransactionResponse {
  transactionId: number;
  /** orderId = nuestro reference interno */
  orderId: string;
  integritySignature: string;
  /** BOLD_IDENTITY_KEY público */
  apiKey: string;
  /** Monto total en pesos COP como string (ej: "300000") */
  amount: string;
  currency: string;
  description: string;
  /** 'vat-19' para IVA 19% */
  tax?: string;
  redirectionUrl?: string;
}

export interface PaymentHistoryItem {
  id: number;
  reference: string;
  gateway: 'WOMPI' | 'BOLD' | 'MANUAL';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  baseAmount: number | null;
  taxAmount: number | null;
  description: string | null;
  membershipName: string;
  createdAt: string;
  processedAt: string | null;
}

export interface CreateTransactionRequest {
  membershipId?: number;
  redirectUrl?: string;
}

/**
 * Obtener información de membresía para mostrar en UI
 * NO crea transacción - solo retorna datos para display
 */
export async function getMembershipInfo(
  membershipId?: number
): Promise<MembershipInfoResponse> {
  try {
    const response = await apiClient.get<MembershipInfoResponse>(
      '/v1/payments/membership-info',
      { params: membershipId ? { membershipId } : {} }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get membership info: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Crear transacción de pago con Wompi
 * Se llama cuando el usuario hace clic en "Pagar"
 */
export async function createWompiTransaction(
  request: CreateTransactionRequest
): Promise<WompiTransactionResponse> {
  try {
    const response = await apiClient.post<WompiTransactionResponse>(
      '/v1/payments/wompi/create-transaction',
      request
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to create payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Crear transacción de pago con Bold
 * Se llama cuando el usuario hace clic en "Pagar"
 */
export async function createBoldTransaction(
  request: CreateTransactionRequest
): Promise<BoldTransactionResponse> {
  try {
    const response = await apiClient.post<BoldTransactionResponse>(
      '/v1/payments/bold/create-transaction',
      request
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to create Bold payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Obtener historial de pagos del usuario autenticado
 */
export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  try {
    const response = await apiClient.get<PaymentHistoryItem[]>('/v1/payments/history');
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get payment history: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Consultar estado de pago por reference (orderId de Bold)
 * Útil en la página callback donde Bold devuelve el orderId como query param
 */
export async function getPaymentStatusByReference(
  reference: string
): Promise<PaymentStatusResponse> {
  try {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/v1/payments/status/reference/${reference}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get payment status by reference: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Obtener estado de una transacción de pago
 * Poll para monitorear el estado del pago
 */
export async function getPaymentStatus(
  transactionId: number
): Promise<PaymentStatusResponse> {
  try {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/payments/status/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get payment status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Obtener estado de transacción de Wompi por ID externo
 * Útil para callbacks donde solo tenemos el ID de Wompi
 */
export async function getWompiTransactionStatus(
  wompiTransactionId: string
): Promise<WompiTransactionStatusResponse> {
  try {
    const response = await apiClient.get<WompiTransactionStatusResponse>(
      `/v1/payments/wompi/status/${wompiTransactionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get Wompi transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Realizar polling del estado de pago
 * Continúa consultando hasta que el pago sea APPROVED, DECLINED, CANCELLED o EXPIRED
 *
 * @param transactionId - ID de la transacción
 * @param maxAttempts - Máximo número de intentos (default: 60)
 * @param intervalMs - Intervalo entre intentos en ms (default: 2000)
 * @returns El estado final del pago
 */
export async function pollPaymentStatus(
  transactionId: number,
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<PaymentStatusResponse> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      attempts++;

      try {
        const status = await getPaymentStatus(transactionId);

        // Estados finales - dejar de hacer polling
        if (
          ['APPROVED', 'DECLINED', 'CANCELLED', 'EXPIRED'].includes(
            status.status
          )
        ) {
          clearInterval(timer);
          resolve(status);
          return;
        }

        // Si excedemos máximo de intentos
        if (attempts >= maxAttempts) {
          clearInterval(timer);
          reject(
            new Error(
              `Payment polling timeout after ${maxAttempts} attempts. Status: ${status.status}`
            )
          );
        }
      } catch (error) {
        clearInterval(timer);
        reject(error);
      }
    }, intervalMs);
  });
}

/**
 * Obtener métricas de webhooks (admin only)
 */
export async function getPaymentMetrics(minutes: number = 60) {
  try {
    const response = await apiClient.get('/payments/admin/metrics', {
      params: { minutes },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get payment metrics: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Obtener webhooks fallidos (admin only)
 */
export async function getFailedWebhooks(limit: number = 20) {
  try {
    const response = await apiClient.get('/payments/admin/failed-webhooks', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get failed webhooks: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Triggerar recovery manual de webhooks (admin only)
 */
export async function triggerWebhookRecovery(reference?: string) {
  try {
    const response = await apiClient.post('/payments/admin/recovery', null, {
      params: reference ? { reference } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to trigger webhook recovery: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
