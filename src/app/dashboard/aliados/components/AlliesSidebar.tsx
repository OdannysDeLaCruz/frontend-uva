'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { PartnerCategory } from '@/app/core/types/partner-category'

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
            w-full flex items-center justify-between px-4 py-3 text-left transition-colors
            ${level === 0 ? 'font-semibold text-white hover:bg-purple-600' : 'text-gray-300 hover:bg-purple-700'}
            ${isSelected ? 'bg-purple-600' : ''}
            ${level > 0 ? 'pl-' + (4 + level * 4) : ''}
          `}
        >
          <span className="uppercase text-sm">{category.name}</span>
          {hasSubcategories && (
            <span>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>

        {hasSubcategories && isExpanded && (
          <div className="bg-purple-800">
            {category.subcategories!.map((subcat) => renderCategory(subcat, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 bg-purple-900 min-h-screen flex flex-col">
      <div className="p-4 border-b border-purple-700">
        <h2 className="text-xl font-bold text-white uppercase">Categorías</h2>
      </div>

      <button
        onClick={() => onCategorySelect(null)}
        className={`
          w-full px-4 py-3 text-left text-sm font-semibold uppercase transition-colors
          ${selectedCategoryId === null ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-purple-600'}
        `}
      >
        Todos los aliados
      </button>

      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => renderCategory(category))}
      </div>
    </aside>
  )
}

export default AlliesSidebar
