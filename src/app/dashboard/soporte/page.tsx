'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const SoportePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA SOPORTE" />

        <UnderConstruction
          title="¡Estamos aquí para ayudarte!"
          message="Nuestro equipo está configurando un centro de soporte completo con chat en vivo, preguntas frecuentes, tutoriales y asistencia personalizada para resolver todas tus dudas y acompañarte en tu camino."
        />
      </div>
    </Layout>
  )
}

export default SoportePage
