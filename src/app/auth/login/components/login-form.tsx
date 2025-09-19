"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/app/core/ui/button"
import { Input } from "@/app/core/ui/input"
import { Label } from "@/app/core/ui/label"
import { login as authServiceLogin } from "@/app/core/services/auth-service"
import { useAuth } from "@/app/core/contexts/auth-context"
import { ApiError } from "@/app/core/utils/error-handler"

export default function LoginForm() {
  const router = useRouter()
  const { login, isAuthenticated, error: authError, clearError } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "a@a.co",
    password: "123",
  })

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  // Usar error del contexto de autenticación si existe
  useEffect(() => {
    if (authError) {
      setError(authError)
      clearError()
    }
  }, [authError, clearError])

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
      const response = await authServiceLogin({
        username: formData.email,
        password: formData.password,
      })

      await login(response.access_token)
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/images/logo-uva-1x.webp" width={150} height={0} alt="MultiNivel Logo"  style={{
          width: '120px',
          height: 'auto',
        }} className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Inicia sesión en tu cuenta</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Usuario o correo electrónico
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  placeholder="jose, jose@uva.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <Link href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? "Iniciando sesión..." : "Entrar"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/register" className="font-medium text-purple-600 hover:text-purple-500">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
