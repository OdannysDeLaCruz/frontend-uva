"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Store } from "lucide-react"
import { Button } from "@/app/core/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/core/ui/card"

export default function ComercioSuccessPageClient() {
  const router = useRouter()
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    const cameFromRegister = sessionStorage.getItem("cameFromComercioRegister")

    if (cameFromRegister) {
      setCanShow(true)
      setTimeout(() => {
        sessionStorage.removeItem("cameFromComercioRegister")
      }, 100)
    } else {
      router.replace("/")
    }
  }, [router])

  if (!canShow) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
      <div className="relative z-10">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-in-up">
          <Card className="bg-white border border-gray-200 shadow-xl overflow-hidden">
            <CardHeader className="py-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                ¡Registro Exitoso!
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Tu comercio ha sido registrado correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 px-6">
              <div className="space-y-6">
                <p className="text-gray-700 text-center leading-relaxed">
                  Bienvenido a la red de comercios aliados de UVA.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Store className="w-5 h-5 text-purple-600 mr-2" />
                    Próximos pasos:
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      </span>
                      Inicia sesión con tus credenciales de comercio
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      </span>
                      Comienza a recibir miembros UVA en tu comercio
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-center w-full space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Link href="/">Ir al inicio</Link>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
