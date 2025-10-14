"use client"

import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/core/contexts/auth-context'
import LandingHeader from '@/app/components/landing/Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Ocultar header cuando el usuario está autenticado (dashboard maneja su propio header)
  if (user) {
    return null
  }

  // Páginas de landing que manejan su propio header localmente
  const landingPages = ['/']
  const shouldHideHeader = landingPages.includes(pathname)

  if (shouldHideHeader) {
    return null
  }

  // Para páginas de auth (/auth/login, /auth/register): mostrar header sin navegación
  if (pathname.startsWith('/auth')) {
    return <LandingHeader showNavigation={false} showAuthButtons={true} />
  }

  // Para otras páginas públicas (/nosotros, /ofrecemos, etc.): mostrar header completo
  return <LandingHeader showNavigation={true} showAuthButtons={true} />
}