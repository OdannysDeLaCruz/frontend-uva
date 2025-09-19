"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/app/core/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/core/ui/card"

export default function SuccessPageClient() {
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const cameFromRegister = sessionStorage.getItem("cameFromRegister");

    if (cameFromRegister) {
      setCanShow(true); // Permitimos mostrar
      setTimeout(() => {
        sessionStorage.removeItem("cameFromRegister"); // Limpiamos después de un pequeño tiempo
      }, 100); // Esperamos 100ms para evitar romper la validación
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!canShow) {
    return null; // No mostrar nada hasta validar
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white shadow overflow-hidden">
          <CardHeader className="bg-green-50 py-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">¡Registro Exitoso!</CardTitle>
            <CardDescription className="text-gray-600">Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="py-6 px-4 sm:px-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Gracias por unirte a nuestra comunidad de emprendedores. Estás a un paso de comenzar tu camino hacia el
                éxito financiero.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Próximos pasos:</h3>
                <ul className="list-disc pl-5 text-purple-700 space-y-1">
                  <li>Inicia sesión con tus credenciales</li>
                  <li>Completa tu perfil para personalizar tu experiencia</li>
                  <li>Explora nuestros recursos de capacitación</li>
                  <li>Comienza a invitar a nuevos miembros a tu red</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="flex justify-center w-full space-x-4">
              <Button asChild variant="outline">
                <Link href="/">Ir al inicio</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}