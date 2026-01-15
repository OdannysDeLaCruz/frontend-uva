import apiClient from './api-client';
import { Ally } from '../types/ally';
import { handleAxiosError } from '../utils/error-handler';

export async function getAllies(): Promise<Ally[]> {
  try {
    const response = await apiClient.get('/v1/allies');
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener aliados'));
  }
}

export async function getAlliesByCategory(categoryId: number): Promise<Ally[]> {
  try {
    const response = await apiClient.get(`/v1/allies/category/${categoryId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener aliados por categoría'));
  }
}

export async function searchAllies(query: string): Promise<Ally[]> {
  try {
    const response = await apiClient.get('/v1/allies/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'buscar aliados'));
  }
}

export async function getAllyById(id: number): Promise<Ally> {
  try {
    const response = await apiClient.get(`/v1/allies/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(handleAxiosError(error, 'obtener detalle del aliado'));
  }
}
