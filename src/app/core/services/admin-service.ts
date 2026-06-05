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
const adminMultipartConfig = {
  withCredentials: true,
  headers: { 'Content-Type': undefined } // Let axios/browser set multipart boundary automatically
};

function toFormData(data: Record<string, unknown>, fileField?: string, file?: File): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, String(v)));
    } else {
      formData.append(key, String(value));
    }
  }
  if (file && fileField) formData.append(fileField, file);
  return formData;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string): Promise<{ ok: boolean; admin: AdminUser }> {
  try {
    const response = await apiClient.post('/v1/admin/auth/login', { email, password }, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'iniciar sesión como administrador');
  }
}

export async function adminGetMe(): Promise<AdminUser> {
  try {
    const response = await apiClient.get('/v1/admin/auth/me', adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener perfil de administrador');
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await apiClient.post('/v1/admin/auth/logout', {}, adminConfig);
  } catch (error) {
    throw handleAxiosError(error, 'cerrar sesión de administrador');
  }
}

// ─── COMERCIOS ─────────────────────────────────────────────────────────────

export async function adminGetComercios(): Promise<AdminComercio[]> {
  try {
    const response = await apiClient.get('/v1/admin/comercios', adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener comercios');
  }
}

export async function adminGetComercio(id: number): Promise<AdminComercio> {
  try {
    const response = await apiClient.get(`/v1/admin/comercios/${id}`, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener comercio');
  }
}

export async function adminCreateComercio(data: CreateComercioData, file?: File): Promise<AdminComercio> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo: _photo, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'photo', file);
    const response = await apiClient.post('/v1/admin/comercios', formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'crear comercio');
  }
}

export async function adminUpdateComercio(id: number, data: Partial<CreateComercioData>, file?: File): Promise<AdminComercio> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo: _photo, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'photo', file);
    const response = await apiClient.patch(`/v1/admin/comercios/${id}`, formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'actualizar comercio');
  }
}

export async function adminToggleComercioStatus(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
  try {
    const response = await apiClient.patch(`/v1/admin/comercios/${id}/toggle-status`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'cambiar estado del comercio');
  }
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────

export async function adminGetBenefits(): Promise<AdminBenefit[]> {
  try {
    const response = await apiClient.get('/v1/admin/benefits', adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener beneficios');
  }
}

export async function adminCreateBenefit(data: CreateBenefitData, file?: File): Promise<AdminBenefit> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _image, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'image', file);
    const response = await apiClient.post('/v1/admin/benefits', formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'crear beneficio');
  }
}

export async function adminUpdateBenefit(id: number, data: Partial<CreateBenefitData>, file?: File): Promise<AdminBenefit> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _image, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'image', file);
    const response = await apiClient.patch(`/v1/admin/benefits/${id}`, formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'actualizar beneficio');
  }
}

export async function adminToggleBenefitStatus(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
  try {
    const response = await apiClient.patch(`/v1/admin/benefits/${id}/toggle-status`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'cambiar estado del beneficio');
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
    throw handleAxiosError(error, 'asignar beneficio al comercio');
  }
}

export async function adminRemoveBenefit(comercioId: number, benefitId: number): Promise<void> {
  try {
    await apiClient.delete(`/v1/admin/comercios/${comercioId}/benefits/${benefitId}`, adminConfig);
  } catch (error) {
    throw handleAxiosError(error, 'remover beneficio del comercio');
  }
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export type KycDocumentType =
  | 'NATIONAL_IDENTITY_CARD_FRONT'
  | 'NATIONAL_IDENTITY_CARD_BACK'
  | 'NATIONAL_IDENTITY_CARD_SELFIE';

export type KycStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface KycDocument {
  id: number;
  document_type: KycDocumentType;
  document_url: string;
  status: KycStatus;
  rejection_reason?: string | null;
  verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KycUserSubmission {
  id: number;
  name: string;
  lastname: string;
  email: string;
  doc_number: string;
  kycVerified: boolean;
  kycVerifications: KycDocument[];
}

export async function adminGetKycSubmissions(): Promise<KycUserSubmission[]> {
  try {
    const response = await apiClient.get('/v1/admin/kyc', adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener solicitudes KYC');
  }
}

export async function adminApproveKycDocument(documentId: number): Promise<KycDocument> {
  try {
    const response = await apiClient.patch(`/v1/admin/kyc/documents/${documentId}/approve`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'aprobar documento KYC');
  }
}

export async function adminRejectKycDocument(documentId: number, reason: string): Promise<KycDocument> {
  try {
    const response = await apiClient.patch(
      `/v1/admin/kyc/documents/${documentId}/reject`,
      { reason },
      adminConfig
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'rechazar documento KYC');
  }
}

export async function adminSetKycVerified(userId: number, verified: boolean): Promise<{ id: number; kycVerified: boolean; message: string }> {
  try {
    const response = await apiClient.patch(
      `/v1/admin/users/${userId}/kyc-verified`,
      { verified },
      adminConfig
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'actualizar verificación KYC del usuario');
  }
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
  order: number;
  isActive: boolean;
  subcategories?: AdminCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
  order?: number;
  isActive?: boolean;
}

export async function adminGetCategories(): Promise<AdminCategory[]> {
  try {
    const response = await apiClient.get('/v1/admin/categorias', adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'obtener categorías');
  }
}

export async function adminCreateCategory(data: CreateCategoryData, file?: File): Promise<AdminCategory> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _image, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'image', file);
    const response = await apiClient.post('/v1/admin/categorias', formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'crear categoría');
  }
}

export async function adminUpdateCategory(id: number, data: Partial<CreateCategoryData>, file?: File): Promise<AdminCategory> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _image, ...rest } = data;
    const formData = toFormData(rest as Record<string, unknown>, 'image', file);
    const response = await apiClient.patch(`/v1/admin/categorias/${id}`, formData, adminMultipartConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'actualizar categoría');
  }
}

export async function adminToggleCategoryStatus(id: number): Promise<{ id: number; isActive: boolean; message: string }> {
  try {
    const response = await apiClient.patch(`/v1/admin/categorias/${id}/toggle-status`, {}, adminConfig);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'cambiar estado de la categoría');
  }
}

export async function adminDeleteCategory(id: number): Promise<void> {
  try {
    await apiClient.delete(`/v1/admin/categorias/${id}`, adminConfig);
  } catch (error) {
    throw handleAxiosError(error, 'eliminar categoría');
  }
}
