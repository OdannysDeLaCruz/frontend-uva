"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type VerticalMenuProps = {
  textColor?: string
  activeTextColor?: string
  activeGradientFrom?: string
  activeGradientTo?: string
  inactiveGradientFrom?: string
  inactiveGradientTo?: string
}

export default function VerticalMenu({
  textColor = "text-white",
  activeTextColor = "text-white",
  activeGradientFrom = "#772783",
  activeGradientTo = "transparent",
  inactiveGradientFrom = "rgb(229 231 235 / 0.5)",
  inactiveGradientTo = "transparent"
}: VerticalMenuProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/nosotros", label: "Nosotros" },
    { href: "/ofrecemos", label: "Ofrecemos" },
    { href: "/membresia", label: "Membresía" },
    { href: "/aprendizaje", label: "Aprendizaje" },
    { href: "/ahorro", label: "Ahorro" },
    { href: "/programa", label: "Fidelización" },
    { href: "/soporte", label: "Soporte" }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="hidden md:flex w-38 bg-white/5 backdrop-blur-md flex-col fixed right-0 top-0 h-screen pt-16 shadow-lg z-40">
      {/* Menú de navegación */}
      <nav className="flex-1 p-4 pt-12">
        <ul className="space-y-5 text-lg flex flex-col align-left">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-2 backdrop-blur-sm rounded transition-all duration-200 ${
                  isActive(item.href)
                    ? `${activeTextColor} font-bold scale-105`
                    : `${textColor} hover:scale-105`
                }`}
                style={{
                  backgroundImage: isActive(item.href)
                    ? `linear-gradient(to right, ${activeGradientFrom}, ${activeGradientTo})`
                    : `linear-gradient(to right, ${inactiveGradientFrom}, ${inactiveGradientTo})`
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón 3D de Acceder */}
        <div className="mt-16 flex justify-center">
          <Link href="/auth/login">
            <div className="relative group cursor-pointer">
              {/* Botón 3D redondo para presionar */}
              <div className="flex items-center justify-center relative">
                {/* Texto "Entrar" arriba */}
                <span className="absolute top-2 left-4 top-9 text-white z-20 text-2xl mb-2 group-hover:text-green-600 transition-colors duration-200">
                  Entrar
                </span>

                {/* Botón suave */}
                <div className="relative">
                  {/* Botón principal con bordes suaves */}
                  <div className="w-25 h-25 bg-[#782784] from-purple-100 via-purple-50 to-white rounded-full relative shadow-lg group-hover:shadow-xl group-active:scale-95 transition-all duration-200 border border-purple-200">
                    {/* Logo de la uva centrado */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Image
                        src="/images/uva.png"
                        alt="UVA Logo"
                        width={90}
                        height={90}
                        className="group-hover:scale-101 transition-transform duration-200 mb-7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
