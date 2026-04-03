/**
 * Tipos para el Widget de Bold (BoldCheckout)
 * Documentación: https://developers.bold.co
 */

export interface BoldCheckoutConfig {
  orderId: string;
  currency: string;
  /** Monto en pesos COP como string (ej: "300000"), NO centavos */
  amount: string;
  /** BOLD_IDENTITY_KEY — llave pública del comercio */
  apiKey: string;
  /** SHA-256 de "{orderId}{amount}{currency}{secretKey}" generado en backend */
  integritySignature: string;
  description?: string;
  /** 'vat-19' para IVA 19%, 'consumption' para impuesto al consumo */
  tax?: string;
  /** URL a la que Bold redirige después del pago */
  redirectionUrl?: string;
  /** URL si el usuario abandona el checkout */
  originUrl?: string;
  /** Timestamp de expiración del link (ms) */
  expirationDate?: number;
  /** 'embedded' para abrir en modal dentro de la página */
  renderMode?: 'embedded';
  /** JSON.stringify de datos del cliente */
  customerData?: string;
}

export interface BoldCheckout {
  open(): void;
  getConfig(key: string): string;
  updateConfig(key: string, value: string): void;
}

export interface BoldCheckoutConstructor {
  new (config: BoldCheckoutConfig): BoldCheckout;
}

declare global {
  interface Window {
    BoldCheckout?: BoldCheckoutConstructor;
  }
}
