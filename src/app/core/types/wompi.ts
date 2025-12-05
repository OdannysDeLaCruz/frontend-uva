/**
 * Tipos para el Widget de Wompi
 */

export interface WompiWidgetConfig {
  currency?: string;
  amountInCents?: number;
  reference?: string;
  publicKey?: string;
  taxInCents?: {
    vat: number,
    consumption: number
  }
  signature?: {
    integrity?: string;
  };
  redirectUrl?: string;
  customerData?: {
    email: string,
    fullName: string
    phoneNumber: string
    phoneNumberPrefix: string
    legalId: string
    legalIdType: string
  }
  onFinished?: (transaction: WompiTransaction) => void;
}

export interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'CANCELLED' | 'PENDING' | 'EXPIRED';
  statusMessage?: string;
}

export interface WompiCheckoutResult {
  transaction: WompiTransaction;
}

export interface WompiWidget {
  open(callback?: (result: WompiCheckoutResult) => void): void;
}

export interface WompiWidgetCheckoutConstructor {
  new (config: WompiWidgetConfig): WompiWidget;
}

declare global {
  interface Window {
    WidgetCheckout?: WompiWidgetCheckoutConstructor;
  }
}
