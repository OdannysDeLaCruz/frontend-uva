// Tipos para respuestas de API y errores
export interface ApiError {
  statusCode?: number
  message: string | string[] | Record<string, string[]>
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: string
}
