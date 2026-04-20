import axios from "axios"

export interface ApiError {
  ok: false;
  message: string | string[];
  statusCode?: number;
  details?: unknown;
  isAuthError?: boolean;
}

export function handleAxiosError(error: unknown, contexto: string): ApiError {
  // Para debugging
  console.error(`Error al ${contexto}:`, error);

  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    
    // Extraer mensaje de error según estructura de respuesta
    let message: string | string[];

    if (responseData?.message) {
      message = Array.isArray(responseData.message)
        ? responseData.message
        : responseData.message;
    } else if (responseData?.error) {
      message = typeof responseData.error === 'string' 
        ? responseData.error 
        : (responseData.error.message || `Error en ${contexto}`);
    } else {
      message = `Error al ${contexto}`;
    }
    
    // Identificar errores de autenticación
    const isAuthError = statusCode === 401 || statusCode === 403;
    
    return { 
      ok: false, 
      message, 
      statusCode,
      details: responseData,
      isAuthError
    };
  } else if (error instanceof Error) {
    return { 
      ok: false, 
      message: error.message || `Error desconocido al ${contexto}` 
    };
  } else {
    return { 
      ok: false, 
      message: `Error desconocido al ${contexto}` 
    };
  }
}
