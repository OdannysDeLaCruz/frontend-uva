import apiClient from './api-client';
import { PartnerCategory } from '../types/partner-category';
import { handleAxiosError } from '../utils/error-handler';

export async function getPartnerCategories(): Promise<PartnerCategory[]> {
  try {
    const response = await apiClient.get('/v1/partner-categories');
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener categorías'));
  }
}

export async function getParentCategories(): Promise<PartnerCategory[]> {
  try {
    const response = await apiClient.get('/v1/partner-categories/parent-categories');
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener categorías principales'));
  }
}

export async function getCategoryById(id: number): Promise<PartnerCategory> {
  try {
    const response = await apiClient.get(`/v1/partner-categories/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener categoría'));
  }
}
