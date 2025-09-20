"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { Button } from "@/app/core/ui/button"
import { Input } from "@/app/core/ui/input"
import { Label } from "@/app/core/ui/label"
import { Checkbox } from "@/app/core/ui/checkbox"
import PasswordStrengthIndicator from "@/app/core/components/password-strength-indicator"
import { ServerAlert } from "@/app/core/ui/alert-dialog"
import { MODES } from "@/app/core/constants"
import { register as authServiceRegister } from "@/app/core/services/auth-service"

import 'react-phone-number-input/style.css'
import { useAuth } from "@/app/core/contexts/auth-context"

type RegisterFormProps = {
  mode: 'automatic' | 'manual';
  referrerCode: string;
};

export default function RegisterForm({ mode, referrerCode }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState({
    mode: mode,
    referrerCode: referrerCode,
    name: "",
    lastname: "",
    doc_number: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const { token } = useAuth()

  if (token) {
    router.replace("/dashboard")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validaciones en vivo
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      // Validar email
      if (name === "email") {
        if (!value.trim()) {
          newErrors.email = "Este campo es obligatorio.";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = "Correo inválido.";
        } else {
          delete newErrors.email;
        }
      }

      // Validar contraseña
      if (name === "password") {
        if (!value.trim()) {
          newErrors.password = "Este campo es obligatorio.";
        } else if (value.length < 8) {
          newErrors.password = "Debe tener al menos 8 caracteres.";
        } else {
          delete newErrors.password;
        }

        // Validar confirmación también porque puede haberse desincronizado
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden.";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      // Validar confirmación de contraseña
      if (name === "confirmPassword") {
        if (!value.trim()) {
          newErrors.confirmPassword = "Este campo es obligatorio.";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden.";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      return newErrors;
    });
  };

  const phoneOnChange = (phoneNumber: string | undefined) => {
    console.log("Phone number:", phoneNumber) 
    setFormData(prev => ({ ...prev, phone: phoneNumber || '' }));

    if (!phoneNumber?.trim()) {
      setFieldErrors(prev => ({ ...prev, phone: "Este campo es obligatorio." }));
      console.log("Errors:", fieldErrors)
      return;
    } else {
      if (!isValidPhoneNumber(phoneNumber)) {
        setFieldErrors(prev => ({ ...prev, phone: "Número inválido." }));
        console.log("Errors:", fieldErrors)
        return;
      }
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido"
    }

    // Validar apellidos
    if (!formData.lastname.trim()) {
      errors.lastname = "Los apellidos son requeridos"
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    // Validar número de teléfono
    if (!formData.phone) {
      errors.phone = "Este campo es obligatorio."
    } else if (!isValidPhoneNumber(formData.phone)) {
      errors.phone = "Número inválido."
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }
    
    // Validar términos
    if (!acceptTerms) {
      errors.terms = "Debe aceptar los términos y condiciones"
    }
    console.log("Errors:", errors)
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      if (![MODES.AUTOMATIC, MODES.MANUAL].includes(formData.mode)) {
        throw new Error("Modo de registro no válido")
      }

      // Llamar a la API para registrar al usuario
      const payload = {
        ...formData,
        confirmPassword: undefined
      }
      const result = await authServiceRegister(payload)

      if (result.ok) {
        router.push("/auth/register/success")
        sessionStorage.setItem("cameFromRegister", "true");
        router.replace("/auth/register/success")
      }
    } catch (error: unknown) {
      console.error("Error de registro:", error)
      if (typeof error === "object" && error !== null && "message" in error) {
        setError(String((error as { message: string }).message))
      } else {
        setError("Error desconocido")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md slide-in-up">
        <div className="flex justify-center">
          <Image src="/images/logo-blanco.png" width={150} height={0} alt="UVA Logo" className="h-16 w-auto transition-transform hover:scale-105" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Crea tu cuenta</h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Únete a la revolución financiera digital
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="glass py-8 px-4 border border-white/10 sm:rounded-2xl sm:px-10">
          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            {isLoading && (
              <div className="flex justify-center items-center absolute top-0 left-0 right-0 bg-black/30 backdrop-blur-sm opacity-90 h-full w-full z-50 rounded-2xl">
                <Loader className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            )}
            {/* Código de referido */}
            <div>
              <Label htmlFor="referrerCode" className="block text-sm text-center font-bold text-white/90 mb-3">
                Código de referido:
              </Label>
              <div className="mt-1 mb-8 border-b border-white/20">
                <Input
                  id="referrerCode"
                  name="referrerCode"
                  type="text"
                  required
                  value={formData.referrerCode}
                  onChange={handleChange}
                  disabled={referrerCode ? true : false}
                  placeholder="Ingrese el código de referido"
                  className={`appearance-none block w-full border-0 text-center text-lg bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 focus:border-transparent ${
                    fieldErrors.referrerCode
                      ? "text-red-300"
                      : "text-white"
                  }`}
                />
                {fieldErrors.referrerCode && (
                  <p className="mt-2 text-sm text-red-300 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.referrerCode}
                  </p>
                )}
              </div>
            </div>
            
            {/* Nombre y apellido */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  Nombre
                </Label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                      fieldErrors.name
                        ? "border-red-300 focus:ring-red-400"
                        : ""
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-300 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="lastname" className="block text-sm font-medium text-white/90">
                  Apellidos
                </Label>
                <div className="mt-1">
                  <Input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    value={formData.lastname}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                      fieldErrors.lastname
                        ? "border-red-300 focus:ring-red-400"
                        : ""
                    }`}
                  />
                  {fieldErrors.lastname && (
                    <p className="mt-1 text-sm text-red-300 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {fieldErrors.lastname}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Número de cédula */}
            <div>
              <Label htmlFor="doc_number" className="block text-sm font-medium text-white/90">
                Número de cédula
              </Label>
              <div className="mt-1">
                <Input
                  id="doc_number"
                  name="doc_number"
                  type="text"
                  value={formData.doc_number}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                {fieldErrors.doc_number && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.doc_number}
                  </p>
                )}
              </div>
            </div>

            {/* Correo electrónico */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Correo electrónico
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                Teléfono
              </Label>
              <div className="phone-input-container">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="CO"
                  value={formData.phone}
                  onChange={phoneOnChange}
                  flags={flags}
                  className="w-full pl-3"
                  style={{
                    '--PhoneInputCountrySelectArrow-color': 'white',
                    '--PhoneInputCountrySelectArrow-opacity': '0.8',
                    '--PhoneInputCountrySelect-marginRight': '0.5rem',
                    '--PhoneInput-color': 'white',
                    '--PhoneInput-background': 'rgba(255, 255, 255, 0.05)',
                    '--PhoneInput-borderRadius': '0.5rem',
                    '--PhoneInput-padding': '0.75rem 1rem',
                    '--PhoneInput-placeholderColor': 'rgba(255, 255, 255, 0.5)',
                    '--PhoneInputCountrySelect-color': 'white',
                    '--PhoneInputCountrySelect-background': 'rgba(255, 255, 255, 0.05)',
                    '--PhoneInputCountrySelect-border': '1px solid rgba(255, 255, 255, 0.2)',
                    '--PhoneInputCountrySelect-borderRadius': '0.5rem 0 0 0.5rem',
                    '--PhoneInputCountrySelect-padding': '0.75rem 0.5rem',
                    '--PhoneInputCountrySelect-focus-borderColor': 'rgb(168, 85, 247)',
                    '--PhoneInputCountrySelect-focus-boxShadow': '0 0 0 2px rgba(168, 85, 247, 0.2)',
                    '--PhoneInput-focus-borderColor': 'rgb(168, 85, 247)',
                    '--PhoneInput-focus-boxShadow': '0 0 0 2px rgba(168, 85, 247, 0.2)',
                  } as React.CSSProperties}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-white/90">
                Contraseña
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
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
                {!fieldErrors.password && formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                Confirmar contraseña
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60 hover:text-white" />
                  )}
                </button>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-center">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-white/30 rounded"
              />
              <Label htmlFor="acceptTerms" className="ml-2 block text-sm text-white/90">
                Acepto los{" "}
                <Link href="/terms" className="text-purple-300 hover:text-purple-200 underline">
                  términos y condiciones
                </Link>
              </Label>
            </div>
            {fieldErrors.terms && (
              <p className="text-sm text-red-300 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {fieldErrors.terms}
              </p>
            )}

            {/* Botón de registro */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-white/70">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="font-medium text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-2">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ServerAlert
        open={!!error}
        onOpenChange={() => setError(null)}
        title="Error de registro"
        description={error || "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo."}
        variant="error"
        confirmText="Entendido"
      />
    </>
  )
}
