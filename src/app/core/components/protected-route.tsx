"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/app/core/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({ 
  children,
  fallback = <div className="flex items-center justify-center h-screen"><LoadingSpinner size="large" /></div>,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const verify = async () => {
      // Si ya está autenticado, no necesitamos verificar de nuevo
      if (isAuthenticated) {
        setChecking(false)
        return
      }
      
      // Verificar autenticación explícitamente
      const isAuth = await checkAuth()
      
      if (!isAuth) {
        router.replace(redirectTo)
      }
      
      setChecking(false)
    }

    verify()
  }, [isAuthenticated, checkAuth, router, redirectTo])

  // Mostrar fallback mientras se verifica autenticación
  if (isLoading || checking) {
    return <>{fallback}</>
  }

  // Si no está autenticado, no renderizar nada
  // (la redirección ya está en marcha)
  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
