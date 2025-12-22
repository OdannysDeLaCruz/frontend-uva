"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"
import VerticalMenu from "@/app/components/VerticalMenu"
import Image from "next/image"

export default function Membresia() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      {/* Container principal con menú lateral */}
      <div className="flex min-h-screen">
        {/* Contenido principal */}
        <div className="flex-1 w-full">
          <section
            className="min-h-screen max-h-[1100px] w-full bg-white relative flex items-center py-12"
          >
            <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-0 lg:pr-40">
              {/* Grid responsive - 1 columna en mobile, 2 en desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 pt-8 md:pt-20 gap-8 lg:gap-12">
                {/* Columna izquierda - Contenido */}
                <article className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-4">
                    Activación Mensual
                  </h1>

                  <Image src="/images/membresia/aporte.webp" alt="Activacion mensual" className="ml-auto" width={400} height={300} />

                  <div className="text-gray-700 text-base">

                    <p>El <strong className="text-principal md:text-lg italic">Aporte Mensual</strong>, es para el <strong className="text-principal md:text-lg italic">Sostenimiento de la Activación Mensual</strong>.</p> <br />

                    <p><strong className="italic">La Activación Mensual</strong> te da derecho a <strong className="italic">Programas de Aprendizaje</strong> y a otros servicios inluidos como <strong className="italic">Valor Agregado.</strong></p>

                    <p>Además, el Miembro de <strong className="italic">UVA</strong> podrá contar con otros <strong className="italic">Beneficios</strong> Adherentes a la misma Membresía, como: <strong className="italic">Ahorro Programado, Plan de Recompensas, Prestamos, Marketplace, etc..</strong></p>
                    

                  </div>
                </article>

                {/* Columna derecha - Imagen */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-md lg:max-w-lg">
                    <Image
                      src="/images/membresia/imagen.webp"
                      alt="Nosotros - UVA Club Fintech"
                      width={600}
                      height={600}
                      className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Menú vertical derecho - Solo desktop */}
        <VerticalMenu />
      </div>
    </div>
  )
}
