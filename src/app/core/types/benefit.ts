export interface GenerateQrBenefitResponse {
  qr: string
  code: string
  status: 'PENDING' | 'USED' | 'EXPIRED'
  expiresAt: string
}

export interface BenefitCustomField {
  id: number
  key: string
  label: string
  fieldType: 'TEXT' | 'NUMBER' | 'DATE'
  isRequired: boolean
  placeholder: string | null
  order: number
}

export interface CustomFieldValueInput {
  customFieldId: number
  value: string
}

export interface BenefitFieldValue {
  label: string
  value: string
}

export interface QrBenefit {
  qr: string
  code: string
  status: 'PENDING' | 'USED' | 'EXPIRED'
  expiresAt: string | Date
  updatedAt: string | Date

  partnerBusiness: {
    name: string
    photo: string
  }

  benefit: {
    name: string
    description: string
  }

  customFields?: BenefitFieldValue[]
}

export interface ValidateQrResponse {
  valid: true
  qrId: string
  benefitName: string
  userName: string
  customFields?: BenefitFieldValue[]
  expiresAt: string
}

export interface BenefitUsagePartnerQr {
  id: string
  code: string
  createdAt: string
  updatedAt: string
  benefitName: string
  userName: string
  benefitStartDate: string | null
  benefitEndDate: string | null
  customFields?: BenefitFieldValue[]
}

export interface UseQrResponse {
  success: true
  qrId: string
  updatedAt: string
}

export interface ValidateCodeResponse {
  valid: true
  qrId: string
  benefitName: string
  userId: string
  userName: string
  customFields?: BenefitFieldValue[]
  expiresAt: string
}

export interface SearchByFieldResponse {
  valid: true
  qrId: string
  benefitName: string
  userId: string
  userName: string
  customFields?: BenefitFieldValue[]
  expiresAt: string
}

export interface SearchableBenefitField {
  benefitId: number
  benefitName: string
  customFieldId: number
  customFieldLabel: string
}