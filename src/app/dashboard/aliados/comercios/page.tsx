'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Image from 'next/image'
import AlliesLayout from '../components/AlliesLayout'
import AlliesSidebar from '../components/AlliesSidebar'
import { getParentCategories } from '@/app/core/services/partner-categories-service'
import { getAllies, getAlliesByCategory, searchAllies } from '@/app/core/services/allies-service'
import { PartnerCategory } from '@/app/core/types/partner-category'
import { Ally } from '@/app/core/types/ally'

const ComerciosPage: React.FC = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<PartnerCategory[]>([])
  const [allies, setAllies] = useState<Ally[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getParentCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Load allies when category or search changes
  useEffect(() => {
    const loadAllies = async () => {
      try {
        setLoading(true)
        let data: Ally[]

        if (searchQuery.trim()) {
          data = await searchAllies(searchQuery.trim())
        } else if (selectedCategoryId) {
          data = await getAlliesByCategory(selectedCategoryId)
        } else {
          data = await getAllies()
        }

        setAllies(data)
      } catch (error) {
        console.error('Error loading allies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllies()
  }, [selectedCategoryId])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for search
    const timeout = setTimeout(async () => {
      try {
        setLoading(true)
        if (query.trim()) {
          const data = await searchAllies(query.trim())
          setAllies(data)
        } else if (selectedCategoryId) {
          const data = await getAlliesByCategory(selectedCategoryId)
          setAllies(data)
        } else {
          const data = await getAllies()
          setAllies(data)
        }
      } catch (error) {
        console.error('Error searching allies:', error)
      } finally {
        setLoading(false)
      }
    }, 500)

    setSearchTimeout(timeout)
  }

  const handleAllyClick = (allyId: number) => {
    router.push(`/dashboard/aliados/comercios/${allyId}`)
  }

  return (
    <AlliesLayout
      sidebar={
        <AlliesSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
      }
    >
      <div className="p-6">
        {/* Search Bar */}
        <div className="flex items-center justify-center  mb-16 mt-6">
          <div className="relative w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar comercios..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Allies Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : allies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No se encontraron comercios con esa búsqueda' : 'No hay comercios disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
            {allies.map((ally) => (
              <div
                key={ally.id}
                onClick={() => handleAllyClick(ally.id)}
                className="cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  {ally.photo && ally.photo !== '' && (
                    <Image
                      src={ally.photo}
                      alt={ally.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{ally.name}</h3>
                  {ally.categories && ally.categories.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {ally.categories.map((cat) => cat.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AlliesLayout>
  )
}

export default ComerciosPage
