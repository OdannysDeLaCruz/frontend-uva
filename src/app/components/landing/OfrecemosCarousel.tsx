"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type OfrecemosItem = {
  id: number
  image: string
  description: string
}

const items: OfrecemosItem[] = [
  {
    id: 1,
    image: "/images/ofrecemos/backoffice.png",
    description: "Es tu Oficina Virtual donde podrás ver la estructura de tus Amigos UVA y podrás seguir construyéndola colocando a tus nuevos Amigos UVA. Además, es en donde encontrarás los espacios de Aprendizaje, Ahorro y otros beneficios como valor agregado. <br/> <br/> Sólo en tu Backoffice podrás ver y retirar tus Recompensas ganadas por ser parte de UVA Club Fintech."
  },
  {
    id: 2,
    image: "/images/ofrecemos/aprendizaje.png",
    description: "El Sistema de Ahorro de UVA utiliza tecnología de punta para ayudarte a alcanzar tus metas financieras. Con herramientas de análisis, proyecciones automáticas y estrategias personalizadas, podrás hacer crecer tu patrimonio de forma segura. Incluye: cuentas de ahorro con rendimientos competitivos, planes de ahorro automático, y asesoría financiera personalizada."
  },
  {
    id: 3,
    image: "/images/ofrecemos/ahorro.png",
    description: "Como miembro activo de UVA Club Fintech, tendrás acceso a una red exclusiva de beneficios: descuentos de hasta 50% en comercios afiliados, acceso preferencial a eventos y seminarios, servicios premium sin costo adicional, y programa de puntos acumulables por tus transacciones. Además, participas en sorteos mensuales y promociones especiales."
  },
  {
    id: 4,
    image: "/images/ofrecemos/descuentos.png",
    description: "Nuestro Programa de Fidelización con Marketing de Referidos te recompensa por compartir UVA con otros. Gana comisiones en 10 niveles de profundidad, con un plan de compensación transparente y justo. Cada referido activo genera ingresos recurrentes para ti. Incluye: bonos de bienvenida, comisiones mensuales, bonos de liderazgo, y recompensas por metas alcanzadas."
  },
  {
    id: 5,
    image: "/images/ofrecemos/sorteo.png",
    description: "El Sistema de Préstamos de UVA ofrece a sus miembros activos acceso a financiamiento con las mejores condiciones del mercado. Tasas de interés preferenciales, aprobación rápida, sin trámites complicados, y montos competitivos. Ya sea para proyectos personales, inversiones o emergencias, tenemos la solución financiera que necesitas."
  },
  {
    id: 6,
    image: "/images/ofrecemos/real-state.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  },
  {
    id: 7,
    image: "/images/ofrecemos/travel.png",
    description: "Uno de los objetivos de <strong>UVA</strong>, es lograr que sus miembros tengan opciones de compra dentro de una comunidad comercial que brinde Descuentos Especiales hasta del"
  },
  {
    id: 8,
    image: "/images/ofrecemos/marketplace.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  },
  {
    id: 9,
    image: "/images/ofrecemos/fidelizacion.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  },
  {
    id: 10,
    image: "/images/ofrecemos/prestamos.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  },
  {
    id: 11,
    image: "/images/ofrecemos/copy.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  },
  {
    id: 12,
    image: "/images/ofrecemos/conductor.png",
    description: "Conectamos a miembros interesados en comprar y vender propiedades dentro de nuestra comunidad. Transacciones seguras, asesoría legal incluida, opciones de financiamiento preferencial, y marketplace exclusivo para miembros. Aprovecha las oportunidades de inversión inmobiliaria con condiciones únicas que solo UVA puede ofrecer a su comunidad."
  }
]

export default function OfrecemosCarousel() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [selectedItem, setSelectedItem] = useState<OfrecemosItem | null>(null)

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Botón Anterior */}
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-principal hover:bg-principal/90 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carrusel con Swiper */}
        <div className="px-1">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            speed={800}
            onSwiper={setSwiperInstance}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="!pb-8"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-principal rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-2 border border-gray-400">
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.description}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-2">
                    <p
                      className="text-white font-light text-sm mb-4 line-clamp-3"
                      style={{ lineHeight: "1.1" }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-white hover:text-white/80 font-semibold transition-colors"
                      >
                        Leer más...
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-principal hover:bg-principal/90 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-[90px]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[calc(100vh-110px)] overflow-y-auto shadow-2xl relative scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar fijo */}
            <button
              onClick={() => setSelectedItem(null)}
              className="sticky top-4 left-full -ml-12 mr-4 z-10 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow-lg float-right"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full">
              <Image
                src={selectedItem.image}
                alt={selectedItem.description}
                fill
                className="object-cover object-top rounded-t-2xl"
              />
            </div>
            <div className="p-8">
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedItem.description }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
