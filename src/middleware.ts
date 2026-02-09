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
    const authRoutes = ["/login", "/register"]

    // Obtener tokens de las cookies
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    // Debug: ver todas las cookies
    // console.log("[Middleware] All cookies:", request.cookies.getAll())

    // Verificar si intenta acceder a una ruta protegida
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    // Verificar si intenta acceder a una ruta de autenticación
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // Si intenta acceder a una ruta protegida
    if (isProtectedRoute) {
      // Sin ningún token → redirigir a login
      if (!accessToken && !refreshToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Si hay access_token, verificar restricciones de rol
      // (Si no hay access_token pero sí refresh_token, dejar pasar;
      // el axios interceptor del cliente se encargará del refresh)
      if (accessToken) {
        try {
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API}/v1/auth/me`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Cookie: `access_token=${accessToken}`
              },
              credentials: "include"
            }
          )

          if (userResponse.ok) {
            const userData = await userResponse.json()

            // Si el usuario es de tipo "business"
            if (userData.role === "business") {
              // Y está intentando acceder a rutas del dashboard que NO sean /dashboard/comercios/*
              if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/comercios")) {
                // Redirigir a /dashboard/comercios
                return NextResponse.redirect(new URL("/dashboard/comercios", request.url))
              }
            }
          }
        } catch (error) {
          console.error("Error verifying token:", error)
        }
      }
    }

    // Si intenta acceder a login/register teniendo token, redirige a dashboard
    if (isAuthRoute && accessToken) {
      // Verificar el rol del usuario para redirigir correctamente
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/v1/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: `access_token=${accessToken}`
            },
            credentials: "include"
          }
        )

        if (userResponse.ok) {
          const userData = await userResponse.json()
          // Si es business, redirigir a su dashboard
          const dashboardUrl = userData.role === "business"
            ? "/dashboard/comercios"
            : "/dashboard"
          return NextResponse.redirect(new URL(dashboardUrl, request.url))
        }
      } catch (error) {
        console.error("Error fetching user data for redirect:", error)
      }

      // Fallback: redirigir a dashboard general
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
