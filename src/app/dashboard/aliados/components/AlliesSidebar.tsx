'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: PartnerCategory, level = 0) => {
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const hasSubcategories = category.subcategories && category.subcategories.length > 0

    return (
      <div key={category.id} className="w-full">
        <button
          onClick={() => {
            if (hasSubcategories) {
              toggleCategory(category.id)
            }
            onCategorySelect(category.id)
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
    <aside className="w-64 bg-white min-h-screen flex flex-col">
      {/* Logo de UVA */}
      <div className='flex items-center justify-center p-4'>
        <Image src="/images/logo.png" alt="Logo UVA" width={300} height={300} className='w-50' />
      </div>
      <div className="p-4 border-b border-purple-700">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard/aliados')}
          className="flex items-center gap-2 p-0 py-3 text-left font-semibold uppercase transition-colors text-purple-700 hover:text-purple-900 cursor-pointer"
        >
          <ChevronLeft size={16} /> Volver
        </button>
      </div>

      <button
        onClick={() => onCategorySelect(null)}
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
  )
}

export default AlliesSidebar
