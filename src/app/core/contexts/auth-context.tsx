"use client"

import { createContext, useContext, type ReactNode, useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/app/core/types/user"
import { logout as authServiceLogout } from "@/app/core/services/auth-service"
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
  const router = useRouter()

  // Al montar el proveedor, obtener usuario si hay sesión activa
  // Solo en rutas protegidas, no en rutas públicas
  useEffect(() => {
    const fetchUser = async () => {
      // Rutas públicas que no requieren autenticación
      const publicRoutes = ['/nosotros', '/ofrecemos', '/aprendizaje', '/incentivos', '/referidos', '/login', '/register']

      // No intentar obtener usuario en rutas públicas
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        // Verificar si es la ruta raíz exactamente
        if (currentPath === '/') {
          return
        }

        // El panel admin usa su propio sistema de auth
        if (currentPath.startsWith('/admin')) {
          return
        }

        // Verificar si es alguna otra ruta pública
        const isPublicRoute = publicRoutes.some(route =>
          currentPath.startsWith(route)
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
      // 1. Llamar al backend desde el cliente (donde las cookies sí se envían)
      await authServiceLogout()
    } catch (error) {
      console.error("Error al cerrar sesión en backend:", error)
    }

    try {
      // 2. Eliminar cookies del lado del servidor Next.js via server action
      await logoutAction()
    } catch (error) {
      console.error("Error al eliminar cookies:", error)
    }

    // 3. Limpiar estado local y redirigir
    setUser(null)
    router.push('/login')
  }, [router])

  const value = {
    user,
    setUser,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
