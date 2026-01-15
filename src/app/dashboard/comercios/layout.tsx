"use client"

import React from 'react'
import { RoleProtectedRoute } from '@/app/core/components/role-protected-route'
import ComerciosHeader from './components/ComerciosHeader'

interface ComerciosLayoutProps {
  children: React.ReactNode
}

export default function ComerciosLayout({ children }: ComerciosLayoutProps) {
  return (
    <RoleProtectedRoute allowedRole="business">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ComerciosHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </RoleProtectedRoute>
  )
}
