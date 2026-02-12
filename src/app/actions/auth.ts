'use server'

import { cookies } from 'next/headers'

export async function logoutAction() {
  // Solo eliminar las cookies del lado del servidor Next.js
  // La llamada al backend se hace desde el cliente (donde las cookies sí se envían)
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}
