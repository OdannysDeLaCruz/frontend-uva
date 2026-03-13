import React from 'react'
import Image from 'next/image'
import { PartnerCategory } from '@/app/core/types/partner-category'

interface CategoryCardProps {
  category: PartnerCategory
  onClick: (categoryId: number) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category.id)}
      className="cursor-pointer rounded-xl overflow-hidden h-[150px] relative hover:shadow-xl transition-shadow duration-300 group"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:brightness-110 transition-all duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-800 group-hover:brightness-110 transition-all duration-300" />
      )}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className="bg-white rounded-xl px-4 py-2 text-black text-sm font-semibold text-center">
          {category.name}
        </span>
      </div>
    </div>
  )
}

export default CategoryCard
