import apiClient from './api-client';
import { handleAxiosError } from '../utils/error-handler';
import type { KycDocumentType, KycVerification } from '../types/kyc';

export async function uploadKycDocument(
  documentType: KycDocumentType,
  file: File
): Promise<KycVerification> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await apiClient.post<KycVerification>(
      '/v1/kyc/upload',
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': undefined },
        timeout: 60000
      }
    );
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'subir documento KYC'));
  }
}

export async function getKycStatus(): Promise<KycVerification[]> {
  try {
    const response = await apiClient.get<KycVerification[]>('/v1/kyc/status');
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener estado KYC'));
  }
}
