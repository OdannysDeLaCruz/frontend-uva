'use client'

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import UnderConstruction from '../components/common/UnderConstruction'

const AprendizajePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 p-1 md:p-4">
        <Title title="UVA APRENDIZAJE" />

        <UnderConstruction
          title="¡Tu centro de aprendizaje está en camino!"
          message="Estamos preparando recursos educativos, cursos, tutoriales y herramientas que te ayudarán a desarrollar nuevas habilidades y alcanzar tus objetivos. Mantente atento a las actualizaciones."
        />
      </div>
    </Layout>
  )
}

export default AprendizajePage
