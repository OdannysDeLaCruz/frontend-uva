"use client"
import Image from "next/image";
import Link from "next/link";

export default function UvaButton() {
  return (
    <div className="flex justify-center">
      <Link href="/login">    
        <div className="relative group cursor-pointer">
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
  )
}