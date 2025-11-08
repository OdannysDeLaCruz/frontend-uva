import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    // Si no hay access_token, retornar 401
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Hacer fetch al backend para obtener el perfil del usuario
    const apiUrl = process.env.NEXT_PUBLIC_API
    const response = await fetch(`${apiUrl}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Enviar token solo en la cookie, no en Authorization header
        // El JWT Strategy del backend está configurado para leer desde cookies
        Cookie: `access_token=${accessToken}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      throw new Error(`Failed to fetch user: ${response.status}`)
    }

    const userData = await response.json()

    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
