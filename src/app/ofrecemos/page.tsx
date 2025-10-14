"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"
import Image from "next/image"
import OfrecemosCarousel from "@/app/components/landing/OfrecemosCarousel"

export default function Ofrecemos() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <section
        id="ofrecemos"
        className="min-h-screen w-full bg-cover bg-no-repeat relative flex flex-col items-center justify-center py-12 md:py-24"
        style={{
          backgroundImage: "url('/images/backgrounds/ofrecemos.webp')",
        }}
      >
        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0"></div>
        <div className="mx-auto px-4 md:px-8 lg:px-16 w-full relative z-10">
          {/* Título centrado con imagen */}
          <div className="flex justify-center mb-12">
            <Image
              src="/images/texto-ofrecemos.png"
              alt="Ofrecemos"
              width={500}
              height={110}
              className="w-[400px] h-auto max-w-full"
              priority
            />
          </div>

          {/* Carrusel */}
          <OfrecemosCarousel />
        </div>
      </section>
    </div>
  )
}
