import apiClient from './api-client';
import { GenerateQrBenefitResponse, QrBenefit, BenefitUsagePartnerQr, UseQrResponse, ValidateCodeResponse, ValidateQrResponse } from '../types/benefit';
import { handleAxiosError } from '../utils/error-handler';


export const generateBenefitQr = async (
  benefitId: number,
  partnerBusinessId: number
): Promise<GenerateQrBenefitResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/generate_qr',
      { benefitId, partnerBusinessId },
    )
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'generar QR de beneficio'));
  }

}

export const getMyBenefitsQr = async (): Promise<QrBenefit[]> => {
  try {
    const { data } = await apiClient.get('/v1/benefits/user_qrs')
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener mis beneficio'));
  }
}

export const getPartnerBenefitsQr = async (): Promise<BenefitUsagePartnerQr[]> => {
  try {
    const { data } = await apiClient.get('/v1/benefits/partner_qrs')
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener mis beneficio'));
  }
}

export const validateQrByCode = async (
  code: string,
  docNumber: string
): Promise<ValidateCodeResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/validate_code',
      {
        code: code,
        docNumber: docNumber
      })
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener mis beneficio'));
  }
}

export const validateQr = async (qr: string): Promise<ValidateQrResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/validate_qr',
      { qr },
    )
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'validando qr'));
  }
}

export const useQr = async (qr: string): Promise<UseQrResponse> => {
  try {
    const { data } = await apiClient.patch('/v1/benefits/use_qr',
      { qrId: qr },
    )
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener mis beneficio'));
  }
}