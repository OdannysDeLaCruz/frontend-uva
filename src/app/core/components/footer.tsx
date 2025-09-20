"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Globe
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: "Cómo funciona", href: "#como-funciona" },
      { name: "Beneficios", href: "#beneficios" },
      { name: "Precios", href: "/pricing" },
      { name: "Seguridad", href: "/security" },
      { name: "API", href: "/api" }
    ],
    company: [
      { name: "Sobre nosotros", href: "/about" },
      { name: "Equipo", href: "/team" },
      { name: "Carreras", href: "/careers" },
      { name: "Prensa", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Centro de ayuda", href: "/help" },
      { name: "Contacto", href: "/contact" },
      { name: "Estado del sistema", href: "/status" },
      { name: "Términos", href: "/terms" },
      { name: "Privacidad", href: "/privacy" }
    ],
    legal: [
      { name: "Términos de servicio", href: "/terms" },
      { name: "Política de privacidad", href: "/privacy" },
      { name: "Política de cookies", href: "/cookies" },
      { name: "Aviso legal", href: "/legal" }
    ]
  }

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/uva", color: "hover:text-blue-400" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/uva", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/uva", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/uva", color: "hover:text-blue-500" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/uva", color: "hover:text-red-500" }
  ]

  return (
    <footer className="relative mt-auto">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          {/* Main footer content */}
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8 mb-12">
            {/* Company info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/images/logo-blanco.png"
                  alt="UVA Logo"
                  width={180}
                  height={0}
                  className="h-14 w-auto transition-transform hover:scale-105"
                />
              </div>
              <p className="text-white/80 mb-6 max-w-md leading-relaxed">
                La plataforma financiera digital que está revolucionando la forma en que las personas
                generan ingresos y construyen su futuro económico a través de la tecnología blockchain
                y sistemas de afiliación inteligentes.
              </p>

              {/* Contact info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-white/70 hover:text-white transition-colors group">
                  <Mail className="h-4 w-4 mr-3 text-purple-400 group-hover:scale-110 transition-transform" />
                  <a href="mailto:contacto@uva.com" className="text-sm">contacto@uva.com</a>
                </div>
                <div className="flex items-center text-white/70 hover:text-white transition-colors group">
                  <Phone className="h-4 w-4 mr-3 text-purple-400 group-hover:scale-110 transition-transform" />
                  <a href="tel:+1234567890" className="text-sm">+1 (234) 567-8900</a>
                </div>
                <div className="flex items-center text-white/70 group">
                  <MapPin className="h-4 w-4 mr-3 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Santo Domingo, República Dominicana</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 surface-bg rounded-full flex items-center justify-center border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:scale-110 group ${social.color}`}
                  >
                    <social.icon className="h-4 w-4 text-white/60 group-hover:text-current transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Plataforma
              </h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 transform flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Empresa
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 transform flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Soporte
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 transform flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter subscription */}
          {/* <div className="mb-12">
            <div className="glass rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Star className="h-6 w-6 text-yellow-400 glow-gold" />
              </div>
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Mantente actualizado
                </h3>
                <p className="text-white/80 mb-6">
                  Recibe las últimas noticias sobre nuevas funcionalidades, estrategias de crecimiento y oportunidades exclusivas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  <button className="gradient-bg hover:scale-105 transition-all duration-200 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center group">
                    Suscribirse
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white/60">
                <p>© {currentYear} UVA. Todos los derechos reservados.</p>
                <div className="flex items-center gap-4">
                  {footerLinks.legal.map((link, index) => (
                    <span key={link.name} className="flex items-center">
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                      {index < footerLinks.legal.length - 1 && <span className="ml-4 text-white/30">•</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center text-white/60 text-sm group">
                  <Shield className="h-4 w-4 mr-2 text-green-400 group-hover:scale-110 transition-transform" />
                  Plataforma Segura
                </div>
                <div className="flex items-center text-white/60 text-sm group">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-400 group-hover:scale-110 transition-transform" />
                  Pagos Protegidos
                </div>
                <div className="flex items-center text-white/60 text-sm group">
                  <Globe className="h-4 w-4 mr-2 text-purple-400 group-hover:scale-110 transition-transform" />
                  Global
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}