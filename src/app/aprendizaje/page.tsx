"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"
import Image from "next/image"

export default function Aprendizaje() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Contenido principal */}
        <div className="flex-1 w-full">
          <section
            className="min-h-screen max-h-[1100px] w-full bg-white relative flex py-12"
          >
            <div className="">
              {/* Grid responsive - 1 columna en mobile, 2 en desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 pt-4 gap-8 lg:gap-12">
                {/* Columna izquierda - Contenido */}
                <article className="space-y-6 mx-6 md:ml-20">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-principal mb-10 mt-10 md:mt-20 ">
                    Aprendizaje
                  </h1>

                  <div className="text-gray-700 text-xl">
                    <p>Actualmente, la innovaciones Digitales son tendencia global y nos impulsa a estar actualizados y es por eso que <strong className="text-principal">UVA</strong> piensa en sus Miembros entregando un Programa de Aprendizaje que incluye ETDH, Capacitaciones, Talleres y otros temas relevantes que ayudan a desarrollar habilidades que pueden ser utilizadas en los diferentes retos que se presentan en la vida diaria.</p> <br />

                    <p>Con <strong className="text-principal">UVA Club Fintech</strong>, queremos que todos nuestros Miembros puedan crecer y que aprovechen las oportunidades que ofrecen las innovaciones tecnológicas y que el conocimiento se pueda compartir y se convierta en una puerta abiertas para nuevas posibilidades económicas para todos.</p>

                  </div>
                </article>

                {/* Columna derecha - Imagen */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full">
                    <Image
                      src="/images/aprendizaje.webp"
                      alt="Aprendizaje - UVA Club Fintech"
                      width={600}
                      height={600}
                      className="w-full h-auto shadow-2xl object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
