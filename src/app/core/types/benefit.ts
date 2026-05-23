export interface GenerateQrBenefitResponse {
  qr: string
  code: string
  status: 'PENDING' | 'USED' | 'EXPIRED'
  expiresAt: string
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
}

export interface ValidateQrResponse {
  valid: true
  qrId: string
  benefitName: string
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
  expiresAt: string
}