"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Store,
  Gift,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { useAdminAuth } from '../context/admin-auth-context'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    label: 'Comercios',
    href: '/admin/dashboard/comercios',
    icon: Store
  },
  {
    label: 'Beneficios',
    href: '/admin/dashboard/beneficios',
    icon: Gift
  }
]

export default function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { admin, logout, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace('/admin')
    }
  }, [admin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Image
            src="/images/LOGO PARA FONDO NEGRO.png"
            alt="UVA"
            width={36}
            height={36}
            className="object-contain"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">UVA Admin</p>
            <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
              Panel de Control
            </p>
          </div>
          <button
            className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin info */}
        <div className="px-4 py-3 mx-3 mt-4 rounded-xl" style={{ background: 'var(--surface-light)' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin.name}</p>
              <p className="text-xs truncate capitalize" style={{ color: 'var(--text-muted)' }}>
                {admin.role}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
            Gestión
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-150 group
                      ${active
                        ? 'text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                    `}
                    style={active ? { background: 'var(--gradient-primary)' } : {}}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`} />
                    <span className="truncate">{item.label}</span>
                    {active && <ChevronRight className="h-3 w-3 ml-auto text-white/70" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b shrink-0"
          style={{
            background: 'rgba(30,27,58,0.8)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--border)'
          }}
        >
          <button
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Admin</span>
            <ChevronRight className="h-3 w-3" style={{ color: 'var(--text-muted)' }} />
            <span className="text-white font-medium">
              {navItems.find(n => isActive(n.href, n.exact))?.label || 'Panel'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Sesión activa
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
