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
      className="cursor-pointer overflow-hidden h-[150px] relative hover:shadow-xl transition-shadow duration-300 group"
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
      <div className="absolute inset-0 flex items-end justify-center">
        <p className="bg-white/80 w-full p-[1px] text-black text-[14px] font-semibold text-center mb-7">
          {category.name}
        </p>
      </div>
    </div>
  )
}

export default CategoryCard
