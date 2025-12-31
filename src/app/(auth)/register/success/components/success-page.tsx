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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-600/50"></div>
      <div className="relative z-10">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-in-up">
          <Card className="glass border border-white/10 overflow-hidden">
            <CardHeader className="py-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center glow-gold">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">¡Registro Exitoso!</CardTitle>
              <CardDescription className="text-white/80 text-lg">Tu cuenta ha sido creada correctamente</CardDescription>
            </CardHeader>
            <CardContent className="py-6 px-6">
              <div className="space-y-6">
                <p className="text-white/90 text-center leading-relaxed">
                  Bienvenido a la revolución financiera digital. Estás a un paso de comenzar tu camino hacia el
                  éxito económico.
                </p>
                <div className="surface-light-bg p-6 rounded-xl border border-white/10">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Próximos pasos:
                  </h3>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      </span>
                      Inicia sesión con tus credenciales
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      </span>
                      Completa tu perfil para personalizar tu experiencia
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      </span>
                      Explora nuestro dashboard y herramientas
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      </span>
                      Comienza a construir tu red de referidos
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="surface-bg px-6 py-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-center w-full space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg">
                  <Link href="/">Ir al inicio</Link>
                </Button>
                <Button asChild className="gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold rounded-lg border border-white/20 shadow-lg hover:shadow-purple-500/25">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}