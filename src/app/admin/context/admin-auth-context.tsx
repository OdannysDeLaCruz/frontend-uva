"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { adminGetMe, adminLogout, type AdminUser } from '@/app/core/services/admin-service'

type AdminAuthContextType = {
  admin: AdminUser | null
  setAdmin: (admin: AdminUser | null) => void
  logout: () => Promise<void>
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  }
  return context
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await adminGetMe()
        setAdmin(data)
      } catch {
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/admin/dashboard')) {
        fetchAdmin()
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminLogout()
    } catch {
      // ignore
    }
    setAdmin(null)
    router.push('/admin')
  }, [router])

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
