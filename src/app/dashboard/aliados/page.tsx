"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'

const AliadosPage: React.FC = () => {
  const router = useRouter()

  const handleIngresar = () => {
    router.push('/dashboard/aliados/comercios')
  }

  return (
    <Layout>
      <div
        className="space-y-6 p-1 md:p-4 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/aliados/aliados-fondo.png)',
          height: '87vh',
        }}
      >
        <Title title="UVA ALIADOS" />

        {/* Boton de ingreso */}
        <div className="flex items-center justify-center h-[70vh] right-0 top-0 left-14 w-full">
          <button
            onClick={handleIngresar}
            className="bg-green-500 hover:bg-green-600 text-white rounded-md uppercase border border-blue-300 px-4 mb-10 2xl:mb-0 2xl:px-8 2xl:py-1 ml-5 2xl:ml-7 cursor-pointer transition-colors"
          >
            Ingresar
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default AliadosPage