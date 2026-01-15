'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logout as authServiceLogout } from '@/app/core/services/auth-service'

export async function logoutAction() {
  try {
    // Llamar al backend para invalidar el token
    await authServiceLogout()
  } catch (error) {
    console.error('Error during logout:', error)
    // Continuar incluso si hay error, eliminamos las cookies de todas formas
  }

  // Eliminar las cookies de autenticación
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')

  // Redirigir a la página de login
  redirect('/login')
}
