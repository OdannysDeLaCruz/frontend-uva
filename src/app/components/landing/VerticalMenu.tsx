"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import UvaButton from "../UvaButton"

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
    { href: "/fidelizacion", label: "Fidelización" },
    // { href: "/soporte", label: "Soporte" }
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
        <div className="mt-16">
          <UvaButton />
        </div>
      </nav>
    </div>
  )
}
