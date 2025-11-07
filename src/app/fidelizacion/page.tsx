"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import Image from "next/image"
import { redirect } from "next/navigation"
// import UvaButton from "../components/UvaButton"

export default function Fidelizacion() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div
      className="min-h-screen h-full bg-white relative pt-0 md:pt-20 fidelizacion-bg"
    >
      <div className="lg:container 2xl:max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 relative w-full">
          <div className="p-0 md:p-2">
            <Image
              src="/images/fidelizacion/fidelizacion-parte-1.webp"
              alt="Fidelización"
              width={400}
              height={400}
              className="w-full z-0 block md:hidden"
            />

            <h1 className="fidelizacion-title absolute md:relative z-10 font-bold text-white mb-6 mt-4 md:mt-10 w-[80%] md:w-full leading-none tracking-wider">
              Programa de <br />Fidelización
            </h1>

            <p className="hidden md:block md:text-[22px] 2xl:text-4xl font-light italic leading-7 2xl:leading-9 mt-9 md:mt-auto w-full mb-12"><strong className="text-principal font-bold">UVA</strong> busca premiar a sus Miembros más entregados. Por eso crea un <strong className="italic font-medium">Programa de Fidelización</strong> por medio de un <strong className="italic font-medium">Marketing de Referidos</strong>, con <strong className="italic font-medium">Recompensas Económicas por Referidos</strong> dentro de un <strong className="italic font-medium">Plan de Recompensas de 10 Niveles y sin Candados</strong>.</p>
          </div>
        </div>
        <div className="relative w-full md:hidden mt-1">
          <Image
            src="/images/fidelizacion/fidelizacion-parte-2.webp"
            alt="Fidelización"
            width={400}
            height={400}
            className="w-full top-0 left-0 block md:hidden"
          />

          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src="/images/fidelizacion/texto-marketing-de-referidos.webp"
              alt="Fidelización"
              width={400}
              height={400}
              className="w-[55%] mt-[30%] ml-6 block md:hidden"
            />
            <p className="block md:hidden text-black font-semibold leading-5 mt-9 md:mt-auto w-full mb-12 p-6"><strong className="text-principal font-bold">UVA</strong> busca premiar a sus Miembros más entregados. Por eso crea un Programa de Fidelización por medio de un Marketing de Referidos, con Recompensas Económicas por Referidos dentro de un Plan de Recompensas de 10 Niveles y sin Candados.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
