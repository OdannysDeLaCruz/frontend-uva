"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/app/core/ui/button"
import { Input } from "@/app/core/ui/input"
import { Label } from "@/app/core/ui/label"
import { login as authServiceLogin } from "@/app/core/services/auth-service"
import { getUser } from "@/app/core/services/user-service"
import { useAuth } from "@/app/core/contexts/auth-context"
import { ApiError } from "@/app/core/utils/error-handler"

export default function LoginForm() {
  const router = useRouter()
  const { user, setUser } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Si ya está autenticado, redirigir según el rol
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'business' ? '/dashboard/comercios' : '/dashboard'
      router.replace(redirectPath)
    }
  }, [user, router])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Llamar a la API para iniciar sesión
      // Las cookies httpOnly se establecen automáticamente por el backend
      await authServiceLogin({
        username: formData.email,
        password: formData.password,
      })

      // Obtener la info completa del usuario
      const fullUser = await getUser()
      setUser(fullUser)

      // El middleware redirigirá automáticamente a /dashboard
    } catch (error: ApiError | unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as ApiError

        if (Array.isArray(errorObj.message)) {
          setError(errorObj.message[0])
          return;
        }

        if (typeof errorObj.message === 'string') {
          setError(errorObj.message)
          return;
        }
      }

      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md slide-in-up">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Inicia sesión en tu cuenta</h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Accede a tu dashboard y gestiona tu red
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-in-up p-4" style={{ animationDelay: '0.2s' }}>
        <div className="glass py-8 px-4 border border-white/10 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-red-300 flex items-center">
                <AlertCircle className="min-h-4 min-w-4 w-4 mr-3" />
                {error}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Correo electrónico
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  placeholder="josedelacruz@uva.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Contraseña
                </Label>
                {/* <Link href="/forgot-password" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="* * * * * * *"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Iniciando sesión..." : "Entrar"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-white/70">
                ¿No tienes cuenta?{" "} <br />
                <Link href="/register" className="font-medium text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-2">
                  Registrarse aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
