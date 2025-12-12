'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const UvaSuenosPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA SUEÑOS" />

        <UnderConstruction
          title="¡Convierte tus sueños en realidad!"
          message="Pronto podrás establecer metas, planificar tus objetivos financieros y hacer realidad esos sueños que tanto deseas. Estamos preparando herramientas para ayudarte a alcanzar tus metas paso a paso."
        />
      </div>
    </Layout>
  )
}

export default UvaSuenosPage
