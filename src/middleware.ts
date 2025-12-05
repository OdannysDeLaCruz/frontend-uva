import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

// Tipos para middleware encadenable
type ChainableMiddleware = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<NextResponse>

type MiddlewareFactory = (next: ChainableMiddleware) => ChainableMiddleware

// Función para encadenar múltiples middlewares
function chainMiddleware(
  functions: MiddlewareFactory[] = [],
  index = 0
): ChainableMiddleware {
  const current = functions[index]

  if (current) {
    const next = chainMiddleware(functions, index + 1)
    return current(next)
  }

  return async () => {
    return NextResponse.next()
  }
}

// Middleware de autenticación
const withAuth: MiddlewareFactory = (next) => {
  return async (request, event) => {
    const { pathname } = request.nextUrl

    // Rutas protegidas que requieren autenticación
    const protectedRoutes = ["/dashboard"]

    // Rutas públicas que redirigen a dashboard si está autenticado
    const authRoutes = ["/auth/login", "/auth/register"]

    // Obtener tokens de las cookies
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    // Verificar si intenta acceder a una ruta protegida
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    // Verificar si intenta acceder a una ruta de autenticación
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // Si intenta acceder a una ruta protegida
    if (isProtectedRoute) {
      // Si no hay access_token
      if (!accessToken) {
        // Si hay refresh_token, intentar refrescar
        if (refreshToken) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API}/v1/auth/refresh-token`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: `refresh_token=${refreshToken}`
                },
                credentials: "include"
              }
            )

            if (response.ok) {
              // El backend estableció las cookies automáticamente
              const nextResponse = NextResponse.next()
              // Copiar las nuevas cookies de la respuesta del backend
              response.headers.getSetCookie().forEach((cookie) => {
                nextResponse.headers.append("set-cookie", cookie)
              })
              return nextResponse
            }
          } catch (error) {
            console.error("Error refreshing token:", error)
          }
        }

        // Si no hay tokens o refresh falló, redirigir a login
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar si el access_token es válido
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/v1/auth/verify`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: `access_token=${accessToken}`
            },
            credentials: "include"
          }
        )

        if (!response.ok) {
          // Token inválido, intentar refresh
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/v1/auth/refresh-token`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Cookie: `refresh_token=${refreshToken}`
                  },
                  credentials: "include"
                }
              )

              if (refreshResponse.ok) {
                const nextResponse = NextResponse.next()
                refreshResponse.headers.getSetCookie().forEach((cookie) => {
                  nextResponse.headers.append("set-cookie", cookie)
                })
                return nextResponse
              }
            } catch (error) {
              console.error("Error refreshing token:", error)
            }
          }

          // Refresh falló, redirigir a login
          const loginUrl = new URL("/auth/login", request.url)
          loginUrl.searchParams.set("redirect", pathname)
          return NextResponse.redirect(loginUrl)
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        // En caso de error, permitir continuar (podría ser un problema de red temporal)
      }
    }

    // Si intenta acceder a login/register teniendo token, redirige a dashboard
    if (isAuthRoute && accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return next(request, event)
  }
}

// Exportar la cadena de middlewares
export default chainMiddleware([withAuth])

// Configurar qué rutas usan el middleware
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public (public files)
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
