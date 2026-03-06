import type { ReactNode } from 'react'
import { AdminAuthProvider } from './context/admin-auth-context'

export const metadata = {
  title: 'Administrador UVA',
  description: 'Panel de administración UVA'
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {children}
      </div>
    </AdminAuthProvider>
  )
}
