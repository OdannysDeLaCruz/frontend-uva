"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/images/logo-uva-1x.webp" width={150} height={0} alt="UVA Logo" className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            {isLoading && (
              <div className="flex justify-center items-center absolute top-0 left-0 right-0 bg-gray-50 opacity-50 h-full w-full z-50">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            )}
            {/* Código de referido */}
            <div>
              <Label htmlFor="referrerCode" className="block text-sm text-center font-bold text-gray-700">
                Código de referido:
              </Label>
              <div className="mt-1 mb-10 border-b border-gray-300">
                <Input
                  id="referrerCode"
                  name="referrerCode"
                  type="text"
                  required
                  value={formData.referrerCode}
                  onChange={handleChange}
                  disabled={referrerCode ? true : false}
                  placeholder="Ingrese el código de referido"
                  className={`appearance-none block w-full border-0 text-center text-lg ${
                    fieldErrors.referrerCode
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                />
                {fieldErrors.referrerCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.referrerCode}
                  </p>
                )}
              </div>
            </div>
            
            {/* Nombre y apellido */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    className={`appearance- none block w-full px-3 py-2 border ${
                      fieldErrors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
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
                    className={`appearance-none block w-full px-3 py-2 border ${
                      fieldErrors.lastname
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                  />
                  {fieldErrors.lastname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {fieldErrors.lastname}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Número de cédula */}
            <div>
              <Label htmlFor="doc_number" className="block text-sm font-medium text-gray-700">
                Número de cédula
              </Label>
              <div className="mt-1">
                <Input
                  id="doc_number"
                  name="doc_number"
                  type="text"
                  value={formData.doc_number}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.doc_number
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                />
                {fieldErrors.doc_number && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.doc_number}
                  </p>
                )}
              </div>
            </div>

            {/* Correo electrónico */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </Label>
              <div className="mt-1">
                <PhoneInput
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  defaultCountry="CO"
                  international
                  countryCallingCodeEditable={false}
                  error={formData.phone ? (isValidPhoneNumber(formData.phone) ? undefined : 'Invalid phone number') : 'Phone number required'}
                  value={formData.phone}
                  onChange={phoneOnChange}
                  className={`appearance-none w-full px-3 py-2 border ${
                    fieldErrors.phone
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                />

                {/* <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.phone
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                /> */}
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
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
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center h-[40px]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {!fieldErrors.password && formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
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
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center h-[40px]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className={`h-4 w-4 ${
                    fieldErrors.terms
                      ? "text-red-600 focus:ring-red-500 border-red-300"
                      : "text-purple-600 focus:ring-purple-500 border-gray-300"
                  } rounded`}
                />
              </div>
              <div className="ml-2">
                <Label htmlFor="terms" className="text-sm text-gray-900">
                  Acepto los{" "}
                  <Link href="#" className="text-purple-600 hover:text-purple-500">
                    términos y condiciones
                  </Link>
                </Label>
                {fieldErrors.terms && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.terms}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de registro */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
                Haga click aquí
              </Link>
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
