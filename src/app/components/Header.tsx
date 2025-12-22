"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/app/core/ui/button"
import { Globe, Menu, X } from "lucide-react"
import HorizontalMenu from "./HorizontalMenu"

type HeaderProps = {
  showNavigation?: boolean
  showAuthButtons?: boolean
  showHorizontalMenu?: boolean
}

export default function Header({
  showNavigation = true,
  showAuthButtons = true,
  showHorizontalMenu = false
}: HeaderProps) {
  const [currentLanguage, setCurrentLanguage] = useState("Es")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: "/nosotros", label: "Nosotros" },
    { href: "/ofrecemos", label: "Ofrecemos" },
    { href: "/activacion-mensual", label: "Activación" },
    { href: "/aprendizaje", label: "Aprendizaje" },
    { href: "/incentivos", label: "Incentivos" },
    { href: "/referidos", label: "Referidos" },
    // { href: "/soporte", label: "Soporte" }
  ]

  return (
    <>
      {/* Header fijo - Mobile First */}
      <div 
        className={`px-4 py-2 flex w-full fixed top-0 left-0 z-50 justify-between items-center ${isMenuOpen ? "bg-white" : ""}`}
        style={{
          backgroundImage: "radial-gradient(circle at center, transparent, #ffffff 100%, #ffffff)"
        }}
      >
        {/* Logo UVA - izquierda */}
        <Link href="/" className="flex items-center md:ml-14">
          <Image
            src="/images/logo.png"
            alt="UVA Logo"
            width={80}
            height={80}
            className="cursor-pointer transition-transform md:w-[100px]"
          />
        </Link>

        {/* Menú horizontal - solo si showHorizontalMenu es true */}
        {showHorizontalMenu && <HorizontalMenu />}

        {/* Botones desktop y hamburger mobile */}
        <div className="flex items-center gap-2">
          {/* Botones - solo desktop */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center gap-2">
            {/* Botón de idioma */}
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 px-3"
              onClick={() => setCurrentLanguage(currentLanguage === "Es" ? "En" : "Es")}
            >
              <Globe className="h-4 w-4" />
              {currentLanguage}
            </Button>

            {/* Botón acceder */}
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 text-base"
              >
                Entrar
              </Button>
            </Link>

            {/* Botón registrarse */}
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-principal hover:bg-principal/90 text-white px-4 lg:px-6 text-base"
              >
                ¡Regístrate ya!
              </Button>
            </Link>
            </div>
          )}

          {/* Hamburger menu - solo mobile */}
          {showNavigation && (
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="size-8 text-gray-600" /> : <Menu className="size-9 text-gray-600" />}
            </button>
          )}
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {showNavigation && isMenuOpen && (
        <div className="md:hidden fixed top-[55px] left-0 right-0 bottom-0 bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {/* Navegación */}
            <nav className="flex flex-col gap-2 mb-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Separador */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Botones de acción */}
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
              onClick={() => setCurrentLanguage(currentLanguage === "Es" ? "En" : "Es")}
            >
              <Globe className="h-4 w-4" />
              {currentLanguage}
            </Button>
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-principal hover:bg-principal/90 text-white w-full">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
