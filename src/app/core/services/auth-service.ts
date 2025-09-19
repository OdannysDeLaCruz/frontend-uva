import { redirect } from "next/navigation"
import { RegisterData, AuthCredentials, AuthResponse, StandardResponse } from "@/app/core/types/user"
import apiClient from "@/app/core/services/api-client"
import { getUser } from "@/app/core/services/user-service"
import { handleAxiosError } from "@/app/core/utils/error-handler"

// Middleware para proteger rutas que requieren autenticación
export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/v1/auth/login", credentials)
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "iniciar sesión"));
  }
}

export async function register(data: RegisterData): Promise<StandardResponse> {
  try {
    const response = await apiClient.post<StandardResponse>("/v1/mlm/register", data)
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "registrar al usuario"));
  }
}

export async function logout(): Promise<StandardResponse> {
  try {
    const response = await apiClient.post<StandardResponse>("/v1/auth/logout")
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "cerrar sesión"))
  } finally {
    localStorage.removeItem("access_token")
  }
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<AuthResponse>("/v1/auth/refresh-token")
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "refrescar el token"))
  }
}

