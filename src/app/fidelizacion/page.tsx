"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
// import Image from "next/image"
import { redirect } from "next/navigation"

export default function Fidelizacion() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div 
      className="max-h-[1100px] w-full bg-cover bg-no-repeat bg-[position:top_center] relative flex flex-col pb-12 md:pb-24"
      style={{
        backgroundImage: "url('/images/fidelizacion/fidelizacion-background.webp')"
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
              <div className="flex flex-col-reverse md:flex-row md:grid grid-cols-1 md:grid-cols-2 pt-0 md:pt-4 gap-4 md:gap-8 lg:gap-20 md:bg-transparent">
                {/* Columna izquierda - Contenido */}
                <article className="space-y-6 mx-6 md:ml-20">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 mt-30 md:mt-10">
                    Programa de fidelización
                  </h1>

                  <div className="text-black text-base font-light md:text-xl">
                    <p><strong className="text-principal font-bold">UVA</strong> busca premiar a sus Miembros más entregados. Por eso crea un <strong className="italic font-medium">Programa de Fidelización</strong> por medio de un <strong className="italic font-medium">Marketing de Referidos</strong>, con <strong className="italic font-medium">Recompensas Económicas por Referidos</strong> dentro de un <strong className="italic font-medium">Plan de Recompensas de 10 Niveles y sin Candados</strong>.</p>
                  </div>
                </article>
                {/* <div className="block md:hidden">
                  <h1 className="absolute top-8 right-8 text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-6 mt-10">
                    Ahorro
                  </h1>
                  <Image
                    src="/images/ahorro/ahorro-mobile.webp"
                    alt="Ahorro - UVA Club Fintech"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={false}
                  />
                </div> */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
