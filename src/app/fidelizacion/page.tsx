"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
// import Image from "next/image"
import { redirect } from "next/navigation"
import UvaButton from "../components/UvaButton"

export default function Fidelizacion() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div
      className="min-h-screen h-full bg-red-300 relative pt-20 fidelizacion-bg"
    >
      {/* Container principal con menú lateral */}
      <div className="flex min-h-screen">
        {/* Contenido principal */}
        <div className="flex-1 w-full">
          <section
            className="min-h-screen h-full w-full relative flex"
          >
            {/* Grid responsive - 1 columna en mobile, 2 en desktop */}
            <div className=" pt-0 md:pt-4 gap-4 md:gap-8 lg:gap-20 md:bg-transparent">
              {/* Columna izquierda - Contenido */}
              <article className="space-y-6 mx-6 md:ml-20 md:h-auto">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 mt-4 md:mt-10 w-[220px] md:w-full">
                  Programa de <br /> Fidelización
                </h1>


                <div className="text-black text-base md:text-3xl font-light mt-[600px] md:mt-auto pb-20">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 mt-32 md:mt-10 w-[220px] md:w-full text-principal md:hidden">MARKETING de REFERIDOS</h2>

                  <p className="text-justify md:text-left text-bold md:text-normal md:text-center leading-4 md:leading-8 mt-9 md:mt-auto w-full md:w-[500px] mb-12"><strong className="text-principal font-bold">UVA</strong> busca premiar a sus Miembros más entregados. Por eso crea un <strong className="italic font-medium">Programa de Fidelización</strong> por medio de un <strong className="italic font-medium">Marketing de Referidos</strong>, con <strong className="italic font-medium">Recompensas Económicas por Referidos</strong> dentro de un <strong className="italic font-medium">Plan de Recompensas de 10 Niveles y sin Candados</strong>.</p>

                  {/* Botón entrar */}
                  <div className="md:hidden">
                    <UvaButton />

                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
