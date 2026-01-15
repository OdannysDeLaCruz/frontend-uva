'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const KYCPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="KYC (Verificación)" />

        <UnderConstruction
          title="¡No temas, todos en UVA estarán 100% verificados!"
          message="Estamos trabajando en la implementación de nuevas medidas de seguridad para proteger tus datos y tus transacciones."
        />
      </div>
    </Layout>
  )
}

export default KYCPage
