"use client"

import { createContext, useContext, type ReactNode, useCallback, useState, useEffect } from "react"
import type { User } from "@/app/core/types/user"
import { logoutAction } from "@/app/actions/auth"
import { getUser } from "@/app/core/services/user-service"

// Tipo simplificado para el contexto de autenticación
type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
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

// Proveedor de autenticación simplificado
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Al montar el proveedor, obtener usuario si hay sesión activa
  // Solo en rutas protegidas, no en rutas públicas
  useEffect(() => {
    const fetchUser = async () => {
      // Rutas públicas que no requieren autenticación
      const publicRoutes = ['/', '/nosotros', '/ofrecemos', '/aprendizaje', '/incentivos', '/referidos', '/auth/']

      // No intentar obtener usuario en rutas públicas
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        const isPublicRoute = publicRoutes.some(route =>
          currentPath === route || currentPath.startsWith(route)
        )

        if (isPublicRoute) {
          return
        }
      }

      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        // Si falla (401), no hay sesión activa, user permanece null
        console.error('Error fetching user on mount:', error)
      }
    }

    fetchUser()
  }, [])

  // Función para cerrar sesión
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Usar server action para logout
      // Esto invalida la sesión en el backend y elimina las cookies
      await logoutAction()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Continuamos con el cierre de sesión aunque falle
    } finally {
      // Limpiar estado local
      setUser(null)
    }
  }, [])

  const value = {
    user,
    setUser,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
