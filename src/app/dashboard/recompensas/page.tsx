'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const RecompensasPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA RECOMPENSAS" />

        <UnderConstruction
          title="¡Tus recompensas están por llegar!"
          message="Estamos creando un sistema de recompensas increíble donde podrás canjear puntos, obtener beneficios exclusivos y disfrutar de premios por tu participación activa en la comunidad UVA."
        />
      </div>
    </Layout>
  )
}

export default RecompensasPage
