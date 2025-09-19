"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/app/core/ui/button"
import {
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Shield,
  Zap,
  DollarSign,
  Smartphone,
  ChevronDown,
  Star,
  CreditCard
} from "lucide-react"
import { useAuth } from "@/app/core/contexts/auth-context"
import { redirect } from "next/navigation"

export default function Home() {
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (user) {
    redirect("/dashboard")
  }

  const faqs = [
    {
      question: "¿Qué es UVA y cómo funciona?",
      answer: "UVA es una plataforma digital innovadora que combina lo mejor de las fintech modernas con un sistema de afiliación multinivel. Te permite generar ingresos mientras construyes tu red de referidos."
    },
    {
      question: "¿Cómo puedo comenzar a ganar dinero?",
      answer: "Una vez registrado, puedes empezar a invitar personas a unirse usando tu código de referido único. Ganas comisiones por cada persona que se registre y active su cuenta a través de tu enlace."
    },
    {
      question: "¿Es segura la plataforma?",
      answer: "Absolutamente. Utilizamos las mejores prácticas de seguridad, incluyendo encriptación de datos, autenticación de dos factores y almacenamiento seguro de toda la información financiera."
    },
    {
      question: "¿Cuánto puedo ganar?",
      answer: "Tus ganancias dependen del tamaño y actividad de tu red. Nuestro sistema multinivel te permite generar ingresos tanto por referidos directos como por la actividad de varios niveles en tu red."
    },
    {
      question: "¿Hay costos para unirse?",
      answer: "El registro en UVA es completamente gratuito. Solo necesitas completar el proceso de verificación para comenzar a usar todas las funcionalidades de la plataforma."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-600/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full surface-bg border border-yellow-500/30 mb-6">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-yellow-500 font-medium">Plataforma #1 en Crecimiento</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                El futuro de las <span className="gradient-text">finanzas digitales</span> está aquí
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Únete a la revolución financiera con UVA. Una plataforma que combina tecnología de vanguardia
                con oportunidades de crecimiento ilimitado.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/register">
                  <Button className="gradient-bg hover:scale-105 transition-all duration-300 text-white font-bold px-8 py-4 rounded-full border border-white/20 shadow-xl hover:shadow-purple-500/25 text-lg group">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg"
                >
                  Ver Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-white/80">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  Seguro y Confiable
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  Pagos Instantáneos
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                  +10K Usuarios
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl glass p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 gradient-bg rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-xl">Dashboard Móvil</h3>
                    <p className="text-white/70 text-sm">Controla todo desde tu teléfono</p>
                  </div>

                  <div className="space-y-4">
                    <div className="surface-light-bg rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">Balance Total</span>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">$12,345.67</div>
                    </div>

                    <div className="surface-light-bg rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">Red Activa</span>
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-xl font-bold text-white">847 personas</div>
                    </div>

                    <div className="surface-light-bg rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">Ganancias del Mes</span>
                        <DollarSign className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-xl font-bold text-white">$2,890.50</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 glow-gold rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 slide-in-up">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              ¿Por qué elegir <span className="gradient-text">UVA</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Descubre las ventajas que nos convierten en la plataforma líder para el crecimiento financiero digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Ganancias Exponenciales",
                description: "Sistema multinivel que maximiza tus ingresos con cada referido y su actividad posterior.",
                badge: "Más rentable"
              },
              {
                icon: Shield,
                title: "Seguridad Absoluta",
                description: "Protección bancaria con encriptación de grado militar y seguros para tus fondos.",
                badge: "100% Seguro"
              },
              {
                icon: Smartphone,
                title: "Totalmente Digital",
                description: "Maneja tu negocio desde cualquier lugar con nuestra app móvil y dashboard web.",
                badge: "24/7 Disponible"
              },
              {
                icon: Zap,
                title: "Pagos Instantáneos",
                description: "Recibe tus comisiones al instante sin esperas ni complicaciones bancarias.",
                badge: "Inmediato"
              },
              {
                icon: Users,
                title: "Comunidad Global",
                description: "Conecta con emprendedores de todo el mundo y comparte estrategias de éxito.",
                badge: "Red Mundial"
              },
              {
                icon: Award,
                title: "Sistema de Recompensas",
                description: "Gana badges especiales, bonos y reconocimientos por tus logros y metas alcanzadas.",
                badge: "Exclusivo"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group glass rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    {benefit.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/80 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="py-24 surface-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 slide-in-up">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Preguntas <span className="gradient-text">Frecuentes</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Resolvemos las dudas más comunes sobre nuestra plataforma
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left glass rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-white/70 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFaq === index && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <Image src="/images/logo-uva-1x.webp" alt="UVA Logo" width={150} height={0} className="h-12 w-auto" />
              </div>
              <p className="text-white/80 mb-6 max-w-md">
                La plataforma financiera digital que está revolucionando la forma en que las personas generan ingresos y construyen su futuro económico.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 surface-bg rounded-full flex items-center justify-center border border-white/10 hover:border-purple-400/50 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 surface-bg rounded-full flex items-center justify-center border border-white/10 hover:border-purple-400/50 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 surface-bg rounded-full flex items-center justify-center border border-white/10 hover:border-purple-400/50 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">© 2024 UVA. Todos los derechos reservados.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-white/60 text-sm">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                Plataforma Segura
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                Pagos Protegidos
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
