'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { PartnerCategory } from '@/app/core/types/partner-category'
import Image from 'next/image'

interface AlliesSidebarProps {
  categories: PartnerCategory[]
  selectedCategoryId: number | null
  onCategorySelect: (categoryId: number | null) => void
}

const AlliesSidebar: React.FC<AlliesSidebarProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  const router = useRouter()
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleSelect = (categoryId: number | null) => {
    onCategorySelect(categoryId)
    setIsOpen(false)
  }

  const renderCategory = (category: PartnerCategory, level = 0) => {
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const hasSubcategories = category.subcategories && category.subcategories.length > 0

    return (
      <div key={category.id} className="w-full">
        <button
          onClick={() => {
            if (hasSubcategories) toggleCategory(category.id)
            handleSelect(category.id)
          }}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer
            ${level === 0
              ? 'font-semibold hover:bg-purple-400 hover:text-white'
              : 'pl-8 hover:bg-purple-100'
            }
            ${isSelected
              ? 'bg-purple-600 text-white'
              : level === 0
                ? 'text-gray-700'
                : 'text-gray-600 bg-gray-50'
            }
          `}
        >
          <span className="text-sm">{category.name}</span>
          {hasSubcategories && (
            <span>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {hasSubcategories && isExpanded && (
          <div className="bg-white">
            {category.subcategories!.map((subcat) => renderCategory(subcat, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Botón hamburguesa — solo mobile */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 text-purple-700"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú de categorías"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop — solo mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 md:static md:z-auto
          w-64 bg-white min-h-screen flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo + botón cerrar */}
        <div className="relative flex items-center justify-center p-4">
          <Image src="/images/logo.png" alt="Logo UVA" width={300} height={300} className="w-50" />
          <button
            className="absolute right-3 md:hidden text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-purple-700">
          <button
            onClick={() => router.push('/dashboard/aliados')}
            className="flex items-center gap-2 p-0 py-3 text-left font-semibold uppercase transition-colors text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            <ChevronLeft size={16} /> Volver
          </button>
        </div>

        <button
          onClick={() => handleSelect(null)}
          className={`
            w-full px-4 py-3 text-left text-sm font-semibold uppercase transition-colors
            ${selectedCategoryId === null ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-purple-600'}
          `}
        >
          Todas
        </button>

        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => renderCategory(category))}
        </div>
      </aside>
    </>
  )
}

export default AlliesSidebar
