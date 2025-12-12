'use client'

import React from 'react'

interface AlliesLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

const AlliesLayout: React.FC<AlliesLayoutProps> = ({ sidebar, children }) => {
  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/aliados/comercios.png)' }}
    >
      {sidebar}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default AlliesLayout
