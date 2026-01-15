"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type HorizontalMenuProps = {
  textColor?: string
  activeTextColor?: string
}

export default function HorizontalMenu({
  textColor = "text-gray-900",
  activeTextColor = "text-[#772783]"
}: HorizontalMenuProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/nosotros", label: "Nosotros" },
    { href: "/ofrecemos", label: "Ofrecemos" },
    { href: "/activacion-mensual", label: "Activación" },
    { href: "/aprendizaje", label: "Aprendizaje" },
    { href: "/incentivos", label: "Incentivos" },
    { href: "/referidos", label: "Referidos" },
    // { href: "/soporte", label: "Soporte" }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="hidden py-1 md:flex items-center justify-center principal-nav w-fit px-4">
      {menuItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 text-sm xl:text-base font-medium transition-colors text-black duration-200 leading-4 ${
            index !== menuItems.length - 1 ? 'border-r-2 border-black' : ''
          } ${
            isActive(item.href)
              ? `${activeTextColor} font-bold`
              : `${textColor} hover:text-[#772783]`
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
