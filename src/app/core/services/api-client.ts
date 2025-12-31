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

// Variable para evitar múltiples llamadas simultáneas al refresh
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

// Función para agregar suscriptores que esperan el nuevo token
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

// Función para notificar a todos los suscriptores con el nuevo token
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

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

      // Si ya hay un refresh en progreso, esperar a que termine
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        // Llamar al endpoint de refresh-token
        const refreshResponse = await apiClient.get('/v1/auth/refresh-token')

        if (refreshResponse.status === 200) {
          // Token refrescado exitosamente
          isRefreshing = false
          onRefreshed('refreshed')

          // Reintentar la petición original
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar estado y redirigir
        isRefreshing = false
        refreshSubscribers = []

        // Redirigir al login solo si no estamos ya en una ruta de autenticación
        if (typeof window !== "undefined" && !window.location.pathname.startsWith('/login') || !window.location.pathname.startsWith('/register')) {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient