export type KycDocumentType =
  | 'NATIONAL_IDENTITY_CARD_FRONT'
  | 'NATIONAL_IDENTITY_CARD_BACK'
  | 'NATIONAL_IDENTITY_CARD_SELFIE';

export type KycStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export interface KycVerification {
  id: number;
  document_type: KycDocumentType;
  status: KycStatus;
  rejection_reason: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const KYC_DOCUMENT_TYPES: KycDocumentType[] = [
  'NATIONAL_IDENTITY_CARD_FRONT',
  'NATIONAL_IDENTITY_CARD_BACK',
  'NATIONAL_IDENTITY_CARD_SELFIE',
];

export const KYC_DOCUMENT_LABELS: Record<KycDocumentType, string> = {
  NATIONAL_IDENTITY_CARD_FRONT: 'Cédula — Frente',
  NATIONAL_IDENTITY_CARD_BACK: 'Cédula — Reverso',
  NATIONAL_IDENTITY_CARD_SELFIE: 'Selfie con Documento',
};

export const KYC_DOCUMENT_DESCRIPTIONS: Record<KycDocumentType, string> = {
  NATIONAL_IDENTITY_CARD_FRONT:
    'Foto clara del frente de tu cédula de ciudadanía',
  NATIONAL_IDENTITY_CARD_BACK:
    'Foto clara del reverso de tu cédula de ciudadanía',
  NATIONAL_IDENTITY_CARD_SELFIE:
    'Foto tuya sosteniendo tu cédula junto a tu rostro',
};
