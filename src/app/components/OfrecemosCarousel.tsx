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
    image: "/images/ofrecemos/backoffice.webp",
    description: "Es tu Oficina Virtual donde podrás ver la estructura de tus Amigos UVA y podrás seguir construyéndola colocando a tus nuevos Amigos UVA. Además, es en donde encontrarás los espacios de Aprendizaje, Ahorro y otros beneficios como valor agregado.Sólo en tu Backoffice podrás ver y retirar tus Recompensas ganadas por ser parte de UVA Club Fintech."
  },
  {
    id: 2,
    image: "/images/ofrecemos/aprendizaje.webp",
    description: "En UVA facilita por medio de Membresías Activas, un Programa de Aprendizaje, que contiene información educativa de temas referentes a Tecnología, Marketing, Bolsa de Valores, Salud y Cryptos, entre otros. Siempre estaremos llevando Aprendizaje como punto objetivo de nosotros como UVA, pues tenemos como pensamientos fundamentales que el Conocimiento es lo más importante y valioso que se le puede dar a una persona."
  },
  {
    id: 3,
    image: "/images/ofrecemos/ahorro.webp",
    description: "Uno de los objetivos primordiales de UVA es el Ahorro. Por eso, todo miembro del Club Fintech debe tener un Ahorro con una de nuestras entidades financieras aliadas a nuestro sistema de UVA. El Ahorro le permite al miembro de UVA tener unos beneficios que no tienen los demás sistemas de ahorro existentes. Todo miembro con Ahorro, cuenta con la posibilidad de beneficiarse de los servicios de Vivienda que tendrá directamente UVA."
  },
  {
    id: 4,
    image: "/images/ofrecemos/descuentos.webp",
    description: "Una de los objetivos de UVA es lograr que sus miembros tengan opciones de compra dentro de una comunidad comercial que brinda Descuentos Especiales hasta del 50% de descuento real en productos y servicios de salud, entretenimiento, arte y educativos, entre muchos de los servicios entregados por los aliados de UVA. Estos descuentos son entregados al miembro con su Activación, ayudando a que nuestro miembro pueda ahorrar mucho dinero en sus compras cotidianas o en sus momentos de entretenimiento en familia o amistades."
  },
  {
    id: 5,
    image: "/images/ofrecemos/incentivos-mensuales.png",
    description: "UVA en agradecimiento a la Puntualidad del Aporte Mensual para Sostenimiento Administrativo y Logístico de UVA, premia a sus miembros con Bonos de Compra,  Productos o Servicios. Estos premios se entregan por medio de un Sorteo que se realizarán entre los días 25 al 31 de cada mes, mediante una Lotería propuesta por UVA, dar transparencia al sorteo."
  },
  {
    id: 6,
    image: "/images/ofrecemos/real-state.webp",
    description: "UVA da la posibilidad de que los UVA Amigos puedan participar en la Compra y Venta de Propiedades.  Por eso, UVA integra un Sistema Mutual Real State, donde UVA comunica a los UVA Amigos, para que participen en la compra y venta de una propiedad por medio de una Fiducia que se toma con el banco aliado a UVA.   Al venderse la propiedad, se reparten los dividendos de esa venta de manera proporcional a la participación económica que hizo cada UVA Amigo y todo mediante los términos establecidos en la Fiducia. Además, dentro de nuestro Real Estate Mutual, se implementa una forma para comprar casa a su alcance y hasta con el 5% de Descuento por ser un UVA AMIGO ACTIVO."
  },
  {
    id: 7,
    image: "/images/ofrecemos/travel.webp",
    description: "Una de los objetivos de UVA, es lograr que sus miembros tengan opciones de compra dentro de una comunidad comercial que brinda Descuentos Especiales hasta del 50% de descuento real en Productos y servicios de salud, entretenimiento, arte y educativos entre muchos de los servicios entregados por los aliados de UVA. Estos descuentos son entregados al miembro con su Membresia Activa. Ayudando a que nuestro miembro pueda ahorrar mucho dinero en sus compras cotidianas o en sus momentos de entretenimiento en familia o amistades."
  },
  {
    id: 8,
    image: "/images/ofrecemos/marketplace.webp",
    description: "Será un Marketplace beneficiando a los miembros de nuestro sistema. El cual tendrá precios especiales para todas las Membresias Activas. Donde tendremos productos de Alta calidad con precios muy económicos. Además, tendremos un espacio para los miembros que tengan productos de MLM y quieran publicar dentro del Marketplace de UVA."
  },
  {
    id: 9,
    image: "/images/ofrecemos/referidos.png",
    description: "UVA Club Fintech es una Startup innovadora, por ofrece un Programa de Referidos con un Plan de Recompensas que premia a los UVA Amigos Activos en 10 niveles. Los UVA Amigos ganan Recompensas gracias a estar Activo con su Paquete UVA Mensual. Y como Plan de Recompensas es de una Matriz Forzada de 10x10, los UVA Amigos ganan recompensas por el “Derrame de Miembros Activos” que el Sistema genera ."
  },
  {
    id: 10,
    image: "/images/ofrecemos/incentivos.png",
    description: "UVA incentiva el Sentido de Pertenencia de los UVA Amigos, por medio de un premio, que es dar la posibilidad de que tengan un estudio de Crédito Personal y se le puedan aprobar Quinientos Mil Pesos Colombianos ($500.000) M/L.  El estudio y posible crédito, es realizado por la entidad Financiera aliada a UVA. Este incentivo, se gana por Lograr 30 Referidos Directos del Programa de Referidos de UVA."
  },
  {
    id: 11,
    image: "/images/ofrecemos/copy.webp",
    description: "La intensión de UVA es poder ayudar a nuestros miembros mediante opciones de herramientas que les permitan generar de una u otra forma ingresos. Por tal razón, tenemos vínculos comerciales con brokers regulados y con años de funcionamiento que ahora están al servicio de usted como miembro. El CopyTrade te permite seguir y copiar automaticamente las inversiones de traders expertos. Así aprende Trading el miembro de UVA, mientras participa en los mercados financieros, protegiendo su dinero de la depreciación y manteniendo su valor en el tiempo."
  },
  {
    id: 12,
    image: "/images/ofrecemos/conductor.webp",
    description: "Las personas cada día buscan tranquilidad al tomar un transporte, y más para estos tiempos, donde hay muchos conductores que no son amables ni confiables, por eso es que hemos pensado en un sistema donde los mismos Amig@s UVA sean los que hagan los servicios de Acompañamiento en temas de translado en vehiculo particular, ya sea carro o moto. Nuetra intención con este concepto de Acompañamiento, no es competir con las apps de transporte, es simplemente facilitar un poco el tema de la movilidad y tranquilidad entre la misma comunidad de UVA."
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
            speed={3000}
            autoplay={{
              delay: 100,
              disableOnInteraction: false,
              waitForTransition: true,
            }}
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
                <div
                  onClick={() => setSelectedItem(item)}
                  className="bg-principal rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-2 border border-gray-400 cursor-pointer"
                >
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
                      className="text-white font-light text-md mb-4 line-clamp-3"
                      style={{ lineHeight: "1.1" }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItem(item)
                        }}
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

            <div className="relative h-[200px] md:h-[500px] w-full">
              <Image
                src={selectedItem.image}
                alt={selectedItem.description}
                fill
                className="object-cover object-top rounded-t-2xl"
              />
            </div>
            <div className="p-8">
              <p
                className="text-gray-700 leading-6 text-xl text-justify"
                dangerouslySetInnerHTML={{ __html: selectedItem.description }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
