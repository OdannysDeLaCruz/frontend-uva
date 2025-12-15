'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const SeguridadPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="CENTRO DE SEGURIDAD" />

        <UnderConstruction
          title="¡Tu centro de seguridad está en camino!"
          message="Estamos trabajando en la implementación de nuevas medidas de seguridad para proteger tus datos y tus transacciones."
        />
      </div>
    </Layout>
  )
}

export default SeguridadPage
