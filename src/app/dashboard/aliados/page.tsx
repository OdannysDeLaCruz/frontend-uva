"use client"

import React from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'

const AliadosPage: React.FC = () => {
  return (
    <Layout>
      <div
        className="space-y-6 p-1 md:p-4 h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/aliados/aliados-fondo.png)' }}
      >
        <Title title="UVA ALIADOS" />
      </div>
    </Layout>
  )
}

export default AliadosPage