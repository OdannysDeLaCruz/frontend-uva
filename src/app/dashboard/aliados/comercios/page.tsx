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

type View = 'categories' | 'allies'

const CARD_GRADIENTS = [
  'from-purple-500 to-purple-800',
  'from-violet-500 to-purple-800',
  'from-fuchsia-500 to-purple-800',
  'from-purple-600 to-indigo-800',
  'from-indigo-500 to-purple-800',
]

const ComerciosPage: React.FC = () => {
  const router = useRouter()
  const [view, setView] = useState<View>('categories')
  const [categories, setCategories] = useState<PartnerCategory[]>([])
  const [allies, setAllies] = useState<Ally[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

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

  // Carga aliados cuando cambia la categoría seleccionada o se activa la vista de aliados
  useEffect(() => {
    if (view !== 'allies' || searchQuery.trim()) return

    const loadAllies = async () => {
      try {
        setLoading(true)
        const data = selectedCategoryId
          ? await getAlliesByCategory(selectedCategoryId)
          : await getAllies()
        setAllies(data)
      } catch (error) {
        console.error('Error loading allies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllies()
  }, [selectedCategoryId, view])

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId)
    setSearchQuery('')
    setView(categoryId === null ? 'categories' : 'allies')
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) setView('allies')

    if (searchTimeout) clearTimeout(searchTimeout)

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        if (!selectedCategoryId) setView('categories')
        return
      }
      try {
        setLoading(true)
        const data = await searchAllies(query.trim())
        setAllies(data)
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
          onCategorySelect={handleCategorySelect}
        />
      }
    >
      <div className="p-6 mt-6">
        {view === 'categories' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="cursor-pointer rounded-xl overflow-hidden h-[150px] relative hover:shadow-xl transition-shadow duration-300 group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} group-hover:brightness-110 transition-all duration-300`}
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <span className="bg-white rounded-xl px-4 py-2 text-black text-sm font-semibold text-center">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex items-center justify-center mb-16">
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
          </>
        )}
      </div>
    </AlliesLayout>
  )
}

export default ComerciosPage
