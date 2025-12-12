'use client'

import React from 'react'

interface AlliesLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

const AlliesLayout: React.FC<AlliesLayoutProps> = ({ sidebar, children }) => {
  return (
    <div
      className="flex min-h-screen"

    >
      {sidebar}
      <main className="flex-1 bg-cover bg-no-repeat relative"
        style={{
          backgroundImage: 'url(/images/aliados/comercios.png)',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Backdrop blanco transparente */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        {/* Contenido */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AlliesLayout
