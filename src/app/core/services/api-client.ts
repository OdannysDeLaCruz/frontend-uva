// Cliente API para comunicación con el backend
import axios, { AxiosInstance } from "axios"

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Axios request interceptors

// Interceptor: Add Authorization header if token is available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

// Interceptor: Handle token refresh on 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Ignora rutas de autenticación específicas para el refresh token
    const isAuthEndpoint = 
      originalRequest.url.includes('/v1/auth/login') || 
      originalRequest.url.includes('/v1/auth/refresh-token');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        try {
          // Espera a que se complete el refresh en curso
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
              },
              reject: (err: Error) => reject(err),
            });
          });
        } catch (queueError) {
          // Si hay un error en la cola, asegúrate de propagarlo
          return Promise.reject(queueError);
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await apiClient.get("/v1/auth/refresh-token")
        const newToken = response.data.access_token

        if (newToken) {
          localStorage.setItem("access_token", newToken)
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } else {
          // Si no hay nuevo token, propaga el error original
          processQueue(error, null);
          return Promise.reject(error);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // Si falla el refresh token, limpia tokens si es necesario
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");

          if (typeof window !== "undefined") {
            window.location.href = "/auth/login"
          }
        }
        processQueue(error, null);
        
        // Propaga el error original, no el error del refresh
        // Esto mantiene el contexto de error de la solicitud original
        return Promise.reject(error);
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient