"use client"

import Link from "next/link"
import { Button } from "@/app/core/ui/button"

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="h-full min-h-screen w-full bg-cover bg-no-repeat bg-[position:73%_50%] md:bg-[position:50%_50%] relative flex flex-col pb-12 md:pb-24 pt-24"
      style={{
        backgroundImage: "url('/images/backgrounds/section1.webp')"
      }}
    >
      {/* Overlay morado oscuro solo en mobile */}
      <div className="absolute inset-0 bg-purple-900/40 md:bg-transparent"></div>

      <div className="container 2xl:max-w-[1800px] mx-auto">
        {/* Contenido principal - Título - Mobile First */}
        <div className="flex-1 flex items-center px-4 md:px-8 lg:px-16 pt-24 relative z-10 2xl:mb-64">
          <div className="text-white backdrop-blur-sm md:backdrop-blur-none bg-purple-900/20 md:bg-transparent p-4 md:p-0 rounded-lg">
            <p className="text-white text-3xl md:text-6xl">Primera</p>
            <p className="text-blue-300 font-bold text-3xl md:text-6xl xl:text-7xl 2xl:text-[90px]">STARTUP DISRUPTIVA</p>
            <p className="text-white flex">
              <span className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl italic mb-16">MÁS QUE UN</span>{" "}
              <span className="text-2xl md:text-5xl xl:text-6xl 2xl:text-7xl italic">CLUB FINTECH</span>
            </p>
          </div>
        </div>

        {/* Sección inferior - CTA - Mobile First */}
        <div className="py-4 md:py-8 px-4 md:px-8 lg:px-16 pb-12 md:pb-24 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8 2xl:gap-28 relative z-10 mt-16">
          <p className="text-white text-base md:text-xl lg:text-xl 2xl:text-2xl italic backdrop-blur-sm md:backdrop-blur-none bg-purple-900/20 md:bg-transparent p-3 md:p-0 rounded-lg text-center md:text-left">
            Únete al más <strong>Revolucionario Sistema Social,</strong> que reúne{" "}
            <strong>Tecnología y Oportunidad</strong>... <br />
            Generando grandes <strong>Beneficios de Aprendizaje, Economicos y de Bienestar.</strong>
          </p>
          <Link href="/auth/register" className="w-full md:w-auto flex justify-center">
            <Button className="bg-green-600/60 hover:bg-green-700 cursor-pointer text-white px-4 py-2 md:px-6 md:py-5 2xl:py-6 2xl:px-8 rounded-lg text-lg md:text-2xl lg:text-3xl font-normal whitespace-nowrap">
              ¡Regístrate ya!
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
