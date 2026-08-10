import apiClient from './api-client';
import { GenerateQrBenefitResponse, QrBenefit, BenefitUsagePartnerQr, UseQrResponse, ValidateCodeResponse, ValidateQrResponse, BenefitCustomField, CustomFieldValueInput, SearchByFieldResponse, SearchableBenefitField } from '../types/benefit';
import { handleAxiosError } from '../utils/error-handler';


export const generateBenefitQr = async (
  benefitId: number,
  partnerBusinessId: number,
  customFieldValues?: CustomFieldValueInput[]
): Promise<GenerateQrBenefitResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/generate_qr',
      { benefitId, partnerBusinessId, customFieldValues },
    )
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'generar QR de beneficio'));
  }

}

export const getBenefitCustomFields = async (
  benefitId: number
): Promise<BenefitCustomField[]> => {
  try {
    const { data } = await apiClient.get(`/v1/benefits/${benefitId}/custom_fields`)
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener campos extra del beneficio'));
  }
}

export const searchBenefitByField = async (
  benefitId: number,
  value: string
): Promise<SearchByFieldResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/search_by_field',
      { benefitId, value },
    )
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'buscar beneficio por campo'));
  }
}

export const getSearchableBenefitFields = async (): Promise<SearchableBenefitField[]> => {
  try {
    const { data } = await apiClient.get('/v1/benefits/searchable_fields')
    return data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener campos de búsqueda de beneficios'));
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
  code: string
): Promise<ValidateCodeResponse> => {
  try {
    const { data } = await apiClient.post('/v1/benefits/validate_code',
      { code })
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