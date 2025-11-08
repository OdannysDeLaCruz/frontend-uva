// Cliente API para comunicación con el backend
import axios, { AxiosInstance } from "axios"

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  withCredentials: true, // Enviar/recibir cookies automáticamente
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Axios response interceptors
// Manejo de errores 401 (token expirado)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si es error 401 y no es una ruta de autenticación
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/v1/auth/login') &&
      !originalRequest.url.includes('/v1/auth/refresh-token')
    ) {
      originalRequest._retry = true

      try {
        // El refresh automático sucede en el middleware de Next.js
        // Aquí solo intentamos re-ejecutar la petición original
        // El backend renovará las cookies automáticamente
        return apiClient(originalRequest)
      } catch (err) {
        // Si falla, redirigir al login
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient