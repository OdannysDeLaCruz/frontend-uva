"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/app/core/types/user"
import { getUser } from "@/app/core/services/user-service"
import { logout as authServiceLogout, refreshAccessToken } from "@/app/core/services/auth-service"

// Tipo para el estado de autenticación
type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  clearError: () => void
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Proveedor de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // Inicialmente cargando hasta verificar auth
    error: null
  })

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  // Verificar autenticación - devuelve un booleano que indica si el usuario está autenticado
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {

      // Si ya hay un token, quiere decir que el usuario está autenticado
      // Por lo tanto, podemos verificarlo con los datos del usuario en el contexto

      if (authState.user) {
        return true
      }

      const storedToken = localStorage.getItem("access_token")
      
      if (!storedToken) {
        setAuthState({ user: null, token: null, isLoading: false, error: null })
        return false
      }
      
      // Intentar obtener datos del usuario con el token actual
      try {
        const userData = await getUser()
        setAuthState({
          user: userData,
          token: storedToken,
          isLoading: false,
          error: null
        })
        return true
      } catch {
        try {
          const response = await refreshAccessToken()
          localStorage.setItem("access_token", response.access_token)
          
          // Obtener usuario con el nuevo token
          const userData = await getUser()
          setAuthState({
            user: userData,
            token: response.access_token,
            isLoading: false,
            error: null
          })
          return true
        } catch {
          // Si falla el refresh, limpiar tokens
          localStorage.removeItem("access_token")
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            error: "La sesión ha expirado. Por favor inicia sesión nuevamente."
          })
          return false
        }
      }
    } catch {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        error: "Error al verificar la autenticación"
      })
      return false
    }
  }, [authState.user])
  
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Función para iniciar sesión
  const login = useCallback(async (token: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      localStorage.setItem("access_token", token)
      
      const userData = await getUser()
      setAuthState({
        user: userData,
        token,
        isLoading: false,
        error: null
      })
    } catch (error) {
      localStorage.removeItem("access_token")
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Error al obtener información del usuario"
      }))
      
      throw error
    }
  }, [])

  // Función para cerrar sesión
  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Cerrar sesión en la API
      await authServiceLogout()
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error)
      // Continuamos con el cierre de sesión local aunque falle en el servidor
    } finally {
      // Limpiar datos locales
      localStorage.removeItem("access_token")
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        error: null
      })
      
      // Redirigir al login
      router.push("/auth/login")
    }
  }, [router])

  const value = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    checkAuth,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
