import apiClient from './api-client';
import { handleAxiosError } from '../utils/error-handler';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AdminComercio {
  id: number;
  name: string;
  representativeName?: string;
  legalName?: string;
  docNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  photo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: { id: number; name: string }[];
  benefits?: AdminBenefit[];
}

export interface AdminBenefit {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  dateStart?: string;
  dateEnd?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComercioData {
  name: string;
  representativeName?: string;
  legalName?: string;
  docNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  password?: string;
  photo?: string;
  description?: string;
  isActive?: boolean;
  categoryIds?: number[];
}

export interface CreateBenefitData {
  name: string;
  description: string;
  image?: string;
  dateStart?: string;
  dateEnd?: string;
  isActive?: boolean;
}

const adminConfig = { withCredentials: true };

// ─── AUTH ─────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string): Promise<{ ok: boolean; admin: AdminUser }> {
  try {
    const response = await apiClient.post('/v1/admin/auth/login', { email, password }, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'iniciar sesión como administrador'));
  }
}

export async function adminGetMe(): Promise<AdminUser> {
  try {
    const response = await apiClient.get('/v1/admin/auth/me', adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'obtener perfil de administrador'));
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await apiClient.post('/v1/admin/auth/logout', {}, adminConfig);
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'cerrar sesión de administrador'));
  }
}

// ─── COMERCIOS ─────────────────────────────────────────────────────────────

export async function adminGetComercios(): Promise<AdminComercio[]> {
  try {
    const response = await apiClient.get('/v1/admin/comercios', adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'obtener comercios'));
  }
}

export async function adminGetComercio(id: number): Promise<AdminComercio> {
  try {
    const response = await apiClient.get(`/v1/admin/comercios/${id}`, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'obtener comercio'));
  }
}

export async function adminCreateComercio(data: CreateComercioData): Promise<AdminComercio> {
  try {
    const response = await apiClient.post('/v1/admin/comercios', data, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'crear comercio'));
  }
}

export async function adminUpdateComercio(id: number, data: Partial<CreateComercioData>): Promise<AdminComercio> {
  try {
    const response = await apiClient.patch(`/v1/admin/comercios/${id}`, data, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'actualizar comercio'));
  }
}

export async function adminToggleComercioStatus(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
  try {
    const response = await apiClient.patch(`/v1/admin/comercios/${id}/toggle-status`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'cambiar estado del comercio'));
  }
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────

export async function adminGetBenefits(): Promise<AdminBenefit[]> {
  try {
    const response = await apiClient.get('/v1/admin/benefits', adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'obtener beneficios'));
  }
}

export async function adminCreateBenefit(data: CreateBenefitData): Promise<AdminBenefit> {
  try {
    const response = await apiClient.post('/v1/admin/benefits', data, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'crear beneficio'));
  }
}

export async function adminUpdateBenefit(id: number, data: Partial<CreateBenefitData>): Promise<AdminBenefit> {
  try {
    const response = await apiClient.patch(`/v1/admin/benefits/${id}`, data, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'actualizar beneficio'));
  }
}

export async function adminToggleBenefitStatus(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
  try {
    const response = await apiClient.patch(`/v1/admin/benefits/${id}/toggle-status`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'cambiar estado del beneficio'));
  }
}

// ─── COMERCIO BENEFITS ─────────────────────────────────────────────────────

export async function adminAssignBenefit(comercioId: number, benefitId: number): Promise<{ benefit: AdminBenefit }> {
  try {
    const response = await apiClient.post(
      `/v1/admin/comercios/${comercioId}/benefits`,
      { benefitId },
      adminConfig
    );
    return response.data;
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'asignar beneficio al comercio'));
  }
}

export async function adminRemoveBenefit(comercioId: number, benefitId: number): Promise<void> {
  try {
    await apiClient.delete(`/v1/admin/comercios/${comercioId}/benefits/${benefitId}`, adminConfig);
  } catch (error) {
    throw Promise.reject(handleAxiosError(error, 'remover beneficio del comercio'));
  }
}
