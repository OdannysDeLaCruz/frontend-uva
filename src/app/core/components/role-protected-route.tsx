"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/app/core/ui/loading-spinner"

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRole: string
  redirectTo?: string
}

export const RoleProtectedRoute = ({
  children,
  allowedRole,
  redirectTo
}: RoleProtectedRouteProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, redirigir al login
      router.replace("/login")
      return
    }

    // Verificar el rol del usuario
    if (user.role !== allowedRole) {
      // Redirigir según el rol actual del usuario
      const defaultRedirect = user.role === 'business' ? '/dashboard/comercios' : '/dashboard'
      router.replace(redirectTo || defaultRedirect)
      return
    }

    setIsChecking(false)
  }, [user, allowedRole, router, redirectTo])

  // Mostrar spinner mientras se verifica
  if (isChecking || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-950">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Si el rol no coincide, no renderizar nada (ya se está redirigiendo)
  if (user.role !== allowedRole) {
    return null
  }

  return <>{children}</>
}
