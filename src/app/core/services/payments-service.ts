/**
 * Servicio de Pagos para Frontend
 *
 * Maneja toda la lógica de comunicación con el backend para pagos con Wompi
 * Usa apiClient (axios instance) que automáticamente envía cookies de autenticación
 */

import apiClient from './api-client';

export interface WompiInitResponse {
  transactionId: number;
  reference: string;
  integritySignature: string;
  publicKey: string;
  amountInCents: number;
  currency: string;
  expiresAt: string;
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

export interface WompiPaymentRequest {
  membershipId?: number;
}

/**
 * Inicializar pago con Wompi
 * Retorna los parámetros necesarios para mostrar el widget de Wompi
 */
export async function initWompiPayment(
  request: WompiPaymentRequest
): Promise<WompiInitResponse> {
  try {
    const response = await apiClient.post<WompiInitResponse>(
      '/v1/payments/wompi/init',
      request
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to initialize Wompi payment: ${error instanceof Error ? error.message : 'Unknown error'}`
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
