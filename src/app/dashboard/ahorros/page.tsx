'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const AhorrosPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA AHORROS" />

        <UnderConstruction
          title="¡Tu futuro financiero comienza aquí!"
          message="Estamos desarrollando una plataforma de ahorro inteligente donde podrás gestionar tus finanzas, establecer metas de ahorro y ver crecer tu patrimonio. Prepárate para tomar control de tu futuro económico."
        />
      </div>
    </Layout>
  )
}

export default AhorrosPage
