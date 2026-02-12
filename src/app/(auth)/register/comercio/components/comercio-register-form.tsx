"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { Button } from "@/app/core/ui/button"
import { Input } from "@/app/core/ui/input"
import { Label } from "@/app/core/ui/label"
import { Checkbox } from "@/app/core/ui/checkbox"
import PasswordStrengthIndicator from "@/app/core/components/password-strength-indicator"
import { ServerAlert } from "@/app/core/ui/alert-dialog"
import { registerPartner } from "@/app/core/services/auth-service"

import 'react-phone-number-input/style.css'

export default function ComercioRegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState({
    representativeName: "",
    name: "",
    legalName: "",
    docNumber: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    setFieldErrors(prev => {
      const newErrors = { ...prev }

      if (name === "email") {
        if (!value.trim()) {
          newErrors.email = "Este campo es obligatorio."
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = "Correo inválido."
        } else {
          delete newErrors.email
        }
      }

      if (name === "password") {
        if (!value.trim()) {
          newErrors.password = "Este campo es obligatorio."
        } else if (value.length < 8) {
          newErrors.password = "Debe tener al menos 8 caracteres."
        } else {
          delete newErrors.password
        }

        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden."
        } else {
          delete newErrors.confirmPassword
        }
      }

      if (name === "confirmPassword") {
        if (!value.trim()) {
          newErrors.confirmPassword = "Este campo es obligatorio."
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden."
        } else {
          delete newErrors.confirmPassword
        }
      }

      return newErrors
    })
  }

  const phoneOnChange = (phoneNumber: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: phoneNumber || '' }))

    if (!phoneNumber?.trim()) {
      setFieldErrors(prev => ({ ...prev, phone: "Este campo es obligatorio." }))
      return
    } else {
      if (!isValidPhoneNumber(phoneNumber)) {
        setFieldErrors(prev => ({ ...prev, phone: "Número inválido." }))
        return
      }
      setFieldErrors(prev => ({ ...prev, phone: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.representativeName.trim()) {
      errors.representativeName = "El nombre del representante es requerido"
    }

    if (!formData.name.trim()) {
      errors.name = "El nombre de la empresa es requerido"
    }

    if (!formData.docNumber.trim()) {
      errors.docNumber = "El NIT o CC es requerido"
    }

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    if (!formData.phone) {
      errors.phone = "Este campo es obligatorio."
    } else if (!isValidPhoneNumber(formData.phone)) {
      errors.phone = "Número inválido."
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!acceptTerms) {
      errors.terms = "Debe aceptar los términos y condiciones"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const result = await registerPartner({
        name: formData.name,
        representativeName: formData.representativeName,
        legalName: formData.legalName || undefined,
        docNumber: formData.docNumber,
        address: formData.address || undefined,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      if (result.ok) {
        sessionStorage.setItem("cameFromComercioRegister", "true")
        router.replace("/register/comercio/success")
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

  const inputClass = (fieldName: string) =>
    `appearance-none block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
      fieldErrors[fieldName] ? 'border-red-400 focus:ring-red-400' : ''
    }`

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md slide-in-up">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registra tu comercio</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Forma parte de la red de comercios aliados UVA
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl slide-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            {isLoading && (
              <div className="flex justify-center items-center absolute top-0 left-0 right-0 bg-white/70 backdrop-blur-sm opacity-90 h-full w-full z-50 rounded-2xl">
                <Loader className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            )}

            {/* Nombre del representante */}
            <div>
              <Label htmlFor="representativeName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del representante
              </Label>
              <div className="mt-1">
                <Input
                  id="representativeName"
                  name="representativeName"
                  type="text"
                  required
                  placeholder="Ej: Carlos Eduardo De La Cruz"
                  value={formData.representativeName}
                  onChange={handleChange}
                  className={inputClass('representativeName')}
                />
                {fieldErrors.representativeName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.representativeName}
                  </p>
                )}
              </div>
            </div>

            {/* Nombre empresa y razón social */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Empresa / Negocio
                </Label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ej: Tienda Mi Barrio"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass('name')}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="legalName" className="block text-sm font-medium text-gray-700 mb-2">
                  Razón social <span className="text-gray-400">(opcional)</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="legalName"
                    name="legalName"
                    type="text"
                    placeholder="Ej: Mi Barrio S.A.S"
                    value={formData.legalName}
                    onChange={handleChange}
                    className={inputClass('legalName')}
                  />
                </div>
              </div>
            </div>

            {/* NIT/CC y Dirección */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="docNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  NIT o CC
                </Label>
                <div className="mt-1">
                  <Input
                    id="docNumber"
                    name="docNumber"
                    type="text"
                    required
                    placeholder="Ej: 900987654-3"
                    value={formData.docNumber}
                    onChange={handleChange}
                    className={inputClass('docNumber')}
                  />
                  {fieldErrors.docNumber && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {fieldErrors.docNumber}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-gray-400">(opcional)</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Ej: Cra 10 #45-67"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClass('address')}
                  />
                </div>
              </div>
            </div>

            {/* Correo electrónico */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Ej: contacto@miempresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </Label>
              <div className="phone-input-container-light">
                <PhoneInput
                  locale="co"
                  international
                  defaultCountry="CO"
                  value={formData.phone}
                  onChange={phoneOnChange}
                  flags={flags}
                  className="w-full pl-3"
                  style={{
                    '--PhoneInputCountrySelectArrow-color': '#374151',
                    '--PhoneInputCountrySelectArrow-opacity': '0.8',
                    '--PhoneInputCountrySelect-marginRight': '0.5rem',
                    '--PhoneInput-color': '#111827',
                    '--PhoneInput-background': '#ffffff',
                    '--PhoneInput-borderRadius': '0.5rem',
                    '--PhoneInput-padding': '0.75rem 1rem',
                    '--PhoneInput-placeholderColor': '#9ca3af',
                    '--PhoneInputCountrySelect-color': '#111827',
                    '--PhoneInputCountrySelect-background': '#ffffff',
                    '--PhoneInputCountrySelect-border': '1px solid #d1d5db',
                    '--PhoneInputCountrySelect-borderRadius': '0.5rem 0 0 0.5rem',
                    '--PhoneInputCountrySelect-padding': '0.75rem 0.5rem',
                    '--PhoneInputCountrySelect-focus-borderColor': 'rgb(147, 51, 234)',
                    '--PhoneInputCountrySelect-focus-boxShadow': '0 0 0 2px rgba(147, 51, 234, 0.2)',
                    '--PhoneInput-focus-borderColor': 'rgb(147, 51, 234)',
                    '--PhoneInput-focus-boxShadow': '0 0 0 2px rgba(147, 51, 234, 0.2)',
                  } as React.CSSProperties}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="* * * * * * * *"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass('password')} pr-12`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform h-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {!fieldErrors.password && formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="* * * * * * * *"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass('confirmPassword')} pr-12`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform h-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
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
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <Label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                Acepto los{" "}
                <Link href="/terms" className="text-purple-600 hover:text-purple-500 underline">
                  términos y condiciones
                </Link>
              </Label>
            </div>
            {fieldErrors.terms && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {fieldErrors.terms}
              </p>
            )}

            {/* Botón de registro */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Registrando comercio..." : "Registrar comercio"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "} <br />
                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors underline underline-offset-2">
                  Iniciar sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ServerAlert
        open={!!error}
        onOpenChange={() => setError(null)}
        title="Atención"
        description={error || "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo."}
        variant="error"
        confirmText="Entendido"
      />
    </>
  )
}
