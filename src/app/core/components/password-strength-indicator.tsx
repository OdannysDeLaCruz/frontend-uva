"use client"

import { useState, useEffect } from "react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    calculateStrength(password)
  }, [password])

  const calculateStrength = (password: string) => {
    if (!password) {
      setStrength(0)
      setMessage("")
      return
    }

    let score = 0

    // Longitud
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complejidad
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    // Establecer nivel de fortaleza
    if (score <= 2) {
      setStrength(1) // Débil
      setMessage("Débil")
    } else if (score <= 4) {
      setStrength(2) // Media
      setMessage("Media")
    } else {
      setStrength(3) // Fuerte
      setMessage("Fuerte")
    }
  }

  const getColor = () => {
    if (strength === 0) return "bg-gray-200"
    if (strength === 1) return "bg-red-500"
    if (strength === 2) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center mb-1">
        <div className="text-xs text-gray-500 mr-1">Fortaleza de la contraseña:</div>
        <div
          className={`text-xs font-medium ${
            strength === 1 ? "text-red-500" : strength === 2 ? "text-yellow-500" : "text-green-500"
          }`}
        >
          {message}
        </div>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: `${(strength / 3) * 100}%` }}></div>
      </div>
    </div>
  )
}
