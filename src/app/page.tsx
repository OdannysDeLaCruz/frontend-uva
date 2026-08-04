"use client"

import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"
import Header from "@/app/components/Header"
import VerticalMenu from "@/app/components/VerticalMenu"
import HeroSection from "@/app/components/sections/HeroSection"

export default function Home() {
  const { user } = useAuth()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Container principal con menú lateral */}
      <div className="flex min-h-screen">
        {/* Contenido principal - Secciones */}
        <div className="flex-1 w-full">
          {/* Sección Hero */}
          <HeroSection />
        </div>

        {/* Menú vertical derecho - Solo desktop */}
        <VerticalMenu
          textColor="text-white"
        />
      </div>
    </div>
  )
}
