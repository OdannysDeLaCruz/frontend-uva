"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import Image from "next/image"
import { redirect } from "next/navigation"
import UvaButton from "@/app/components/UvaButton"

export default function Ahorro() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div 
      className="max-h-[1100px] w-full bg-cover bg-no-repeat bg-[#d5bbad] bg-[position:top_center] relative flex flex-col pb-12 md:pb-24"
      style={{
        backgroundImage: "url('/images/ahorro/ahorro-background.webp')"
      }}
    >
      {/* Container principal con menú lateral */}
      <div className="flex min-h-screen">
        {/* Contenido principal */}
        <div className="flex-1 w-full">
          <section
            className="min-h-screen max-h-[1100px] w-full relative flex py-0 md:py-12"
          >
            <div className="">
              {/* Grid responsive - 1 columna en mobile, 2 en desktop */}
              <div className="flex flex-col-reverse md:flex-row md:grid grid-cols-1 md:grid-cols-2 pt-0 md:pt-4 gap-4 md:gap-8 lg:gap-20 bg-[#a79c92] md:bg-transparent">
                {/* Columna izquierda - Contenido */}
                <article className="space-y-6 mx-6 md:ml-20">
                  <h1 className="hidden md:block text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-6 mt-10">
                    Incentivos por Logros
                  </h1>

                  <div className="text-gray-700 text-base md:text-xl">
                    <p>Para <strong className="text-principal">UVA</strong> es prioridad que sus Miembros logren sus objetivos de vida, y por eso es indispensable que cuenten con un <strong className="italic">Programa de Incentivos por Logros</strong> en donde los ahorradores puedan tener la posibilidad de ganar el 1% mensual sobre lo ahorrado en un tiempo de 6 a 12 meses o más tiempo, si así lo determina nuestro Miembro de <strong className="text-principal">UVA Club Fintech</strong>.</p> <br />

                    <p>El ahorro será mediante entidades en alianza con UVA y reguladas por la Superintendencia Financiera de Colombia (SFC) y regulaciones internacionales.</p>
                  </div>

                  <div className="block md:hidden my-0 scale-70">
                    <UvaButton />
                  </div>

                  <Image
                    src="/images/ahorro/leyenda.webp"
                    alt="UVA Club Fintech"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover md:mt-10 mb-20"
                    priority={false}
                  />
                </article>
                <div className="block md:hidden">
                  <h1 className="absolute top-8 right-8 text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-6 mt-10">
                    Incentivos por Logros
                  </h1>
                  <Image
                    src="/images/ahorro/ahorro-mobile.webp"
                    alt="Ahorro - UVA Club Fintech"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
