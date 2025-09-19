"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/app/core/ui/button"
import { useAuth } from "@/app/core/contexts/auth-context"
import { useTheme } from "next-themes";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { 
    user, 
  } = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {!user &&
        <header className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/images/logo-uva-1x.webp"
                alt="UVA Logo"
                width={120}
                height={0}
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:scale-105 relative group">
              <span>Inicio</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#beneficios" className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:scale-105 relative group">
              <span>Beneficios</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#preguntas" className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:scale-105 relative group">
              <span>FAQ</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>

            <Link href="/auth/login">
              <Button className="gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold px-6 py-2 rounded-full border border-white/20 shadow-lg hover:shadow-purple-500/25">
                Ingresar
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg surface-bg border border-white/10 transition-all duration-200 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10 py-4 px-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="#beneficios"
                className="text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Beneficios
              </Link>
              <Link
                href="#preguntas"
                className="text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="gradient-bg text-white w-full font-semibold py-3 rounded-lg border border-white/20 shadow-lg">
                  Ingresar
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
      }
    </>
  )
}
