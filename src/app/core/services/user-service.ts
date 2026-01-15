import { User, PublicUserDto, RewardsCount, ReferralMarketingCount } from "@/app/core/types/user";
import { handleAxiosError } from "@/app/core/utils/error-handler";
import apiClient from "@/app/core/services/api-client";
import { AssignParentDto } from "@/app/core/types/mlm";

export async function getUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>("/v1/auth/me")
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener datos del usuario"))
  }
}

export async function getDirectUsers(parentId: number): Promise<PublicUserDto[]> {
  try {
    const response = await apiClient.get(`/v1/users/${parentId}/direct-children`);
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener usuarios directos"))
  }
}

export async function getUserByReferralCode(referralCode: string): Promise<PublicUserDto> {
  try {
    const response = await apiClient.get<PublicUserDto>(`/v1/users/referral-code/${referralCode}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener datos del usuario"))
  }
}

export async function assignParentToUser(assignParentDto: AssignParentDto): Promise<void> {
  try {
    const response = await apiClient.post(`/v1/mlm/assign-parent`, assignParentDto);
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "asignar padre"))
  }
}

export async function getTanqueAffiliates(parentId: number): Promise<PublicUserDto[]> {
  try {
    const response = await apiClient.get(`/v1/users/${parentId}/tanque-affiliates`);
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener usuarios del tanque"))
  }
}

export async function getRewardsCount(user_id: number): Promise<RewardsCount> {
  try {
    const response = await apiClient.get(`/v1/users/${user_id}/rewards/count`)
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener datos de recompensas"))
  }
}

export async function getReferralMarketingCount(user_id: number): Promise<ReferralMarketingCount> {
  try {
    const response = await apiClient.get(`/v1/users/${user_id}/referral-marketing/count`)
    
    return response.data
  } catch (error) {
    return Promise.reject(handleAxiosError(error, "obtener datos de marketing"))
  }
}

