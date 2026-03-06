"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'
import { adminLogin } from '@/app/core/services/admin-service'
import { useAdminAuth } from './context/admin-auth-context'
import { ApiError } from '@/app/core/utils/error-handler'

export default function AdminLoginPage() {
  const router = useRouter()
  const { admin, setAdmin } = useAdminAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (admin) {
      router.replace('/admin/dashboard')
    }
  }, [admin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await adminLogin(email, password)
      setAdmin(result.admin)
      router.push('/admin/dashboard')
    } catch (err: ApiError | unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const errorObj = err as ApiError
        const msg = Array.isArray(errorObj.message)
          ? errorObj.message[0]
          : errorObj.message
        setError(typeof msg === 'string' ? msg : 'Error al iniciar sesión')
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-[#0B0A17] to-purple-900/40" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md slide-in-up">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/LOGO PARA FONDO NEGRO.png"
              alt="UVA Logo"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Administrador UVA</h1>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Acceso exclusivo para administradores del sistema
          </p>
        </div>

        {/* Card de login */}
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl shadow-purple-900/20">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="admin@uvacf.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-white/40 hover:text-white/70 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/40 hover:text-white/70 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-bg text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Ingresar al panel'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Panel restringido · Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
