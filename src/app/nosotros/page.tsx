"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"
import VerticalMenu from "@/app/components/landing/VerticalMenu"
import Image from "next/image"

export default function Nosotros() {
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
            id="nosotros"
            className="min-h-screen max-h-[1100px] w-full bg-white relative flex items-center py-12"
          >
            <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-0 lg:pr-40">
              {/* Grid responsive - 1 columna en mobile, 2 en desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 pt-20 gap-8 lg:gap-12">
                {/* Columna izquierda - Contenido */}
                <article className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-12">
                    Nosotros
                  </h1>

                  <div className="space-y-4 text-gray-700 text-base leading-relaxed">

                    <p><strong className="text-principal">UVA Club Fintech</strong>, es la primera StartUp Disruptiva con el modelo de Club y fundamentada en una Fintech.</p>

                    <p><strong className="font-bold text-principal">UVA</strong> dentro de sus objetivos, presenta un Programa de Aprendizaje y un Sistema de Ahorro impulsando la cultura de una educación financiera mediante Herramientas Fintech.</p>

                    <p>Gracias a que el modelo de <strong>UVA</strong> es tipo Club, los miembros acceden a Beneficios Exclusivos, Descuentos Especiales y otros Servicios como Valor Agregado a su Membresía de Miembro Activo. Además, nuestro Sistema cuenta con un Programa de Fidelización, mediante un Marketing de Referidos con Recompensas Económicas por Referidos en un Plan de Recompensas a 10 Nivel.</p>

                    <p>Un tema bastante importante y ganador, es los sistemas de préstamo que vamos a tener, al igual, que la Compra y Venta de Propiedades entre los mismos <strong className="text-principal">Miembros Activos de UVA Club Fintech</strong>.</p>
                  </div>
                </article>

                {/* Columna derecha - Imagen */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-md lg:max-w-lg">
                    <Image
                      src="/images/backgrounds/section2.png"
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
        <VerticalMenu 
          textColor="text-gray-700"
          activeTextColor="text-white"
          activeGradientFrom="#772783"
          activeGradientTo="#772783"
          inactiveGradientFrom="rgb(229 231 235 / 0.5)"
          inactiveGradientTo="transparent"
        />
      </div>
    </div>
  )
}
