"use client"

import { usePathname } from 'next/navigation'
import Header from './header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  // No mostrar header en rutas del dashboard
  const hiddenRoutes = ['/dashboard']
  const shouldHideHeader = hiddenRoutes.some(route => pathname.startsWith(route))

  if (shouldHideHeader) {
    return null
  }

  return <Header />
}