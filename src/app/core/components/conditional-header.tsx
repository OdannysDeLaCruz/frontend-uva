"use client"

import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/core/contexts/auth-context'
import Header from '@/app/components/Header'

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

  // Páginas que deben mostrar el menú horizontal
  const horizontalMenuPages = ['/ofrecemos', '/aprendizaje', '/incentivos', '/referidos']
  const shouldShowHorizontalMenu = horizontalMenuPages.includes(pathname)

  // Para páginas de auth (/login, /register): mostrar header sin navegación
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return <Header showNavigation={false} showAuthButtons={true} showHorizontalMenu={false} />
  }

  // Para páginas con menú horizontal: mostrar header con menú horizontal
  if (shouldShowHorizontalMenu) {
    return <Header showNavigation={true} showAuthButtons={true} showHorizontalMenu={true} />
  }

  // Para otras páginas públicas (/nosotros, /membresia, /soporte): mostrar header completo sin menú horizontal
  return <Header showNavigation={true} showAuthButtons={true} showHorizontalMenu={false} />
}