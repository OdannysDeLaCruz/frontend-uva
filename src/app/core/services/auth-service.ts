import { redirect } from "next/navigation"
import { RegisterData, AuthCredentials, StandardResponse, User } from "@/app/core/types/user"
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

export async function login(credentials: AuthCredentials): Promise<{ user: User }> {
  try {
    // Con credentials: 'include', las cookies se envían/reciben automáticamente
    const response = await apiClient.post<{ user: User }>("/v1/auth/login", credentials, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "iniciar sesión"));
  }
}

export async function register(data: RegisterData): Promise<StandardResponse> {
  try {
    const response = await apiClient.post<StandardResponse>("/v1/mlm/register", data, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "registrar al usuario"));
  }
}

export async function logout(): Promise<StandardResponse> {
  try {
    const response = await apiClient.post<StandardResponse>("/v1/auth/logout", {}, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "cerrar sesión"))
  }
  // Las cookies se eliminan automáticamente por el backend
}

export async function refreshAccessToken(): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.get<{ success: boolean }>("/v1/auth/refresh-token", {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw await Promise.reject(handleAxiosError(error, "refrescar el token"))
  }
}

