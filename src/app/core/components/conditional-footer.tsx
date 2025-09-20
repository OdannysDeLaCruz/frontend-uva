"use client"

import { usePathname } from 'next/navigation'
import Footer from './footer'

export default function ConditionalFooter() {
  const pathname = usePathname()

  // No mostrar footer en rutas del dashboard
  const hiddenRoutes = ['/dashboard']
  const shouldHideFooter = hiddenRoutes.some(route => pathname.startsWith(route))

  if (shouldHideFooter) {
    return null
  }

  return <Footer />
}