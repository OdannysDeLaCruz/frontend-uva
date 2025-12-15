'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const SorteoPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA SORTEO" />

        <UnderConstruction
          title="¡Tu centro de sorteos está en camino!"
          message="Estamos trabajando en la implementación de sorteos en UVA."
        />
      </div>
    </Layout>
  )
}

export default SorteoPage
