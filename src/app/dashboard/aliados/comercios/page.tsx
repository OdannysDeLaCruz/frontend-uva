'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Image from 'next/image'
import AlliesLayout from '../components/AlliesLayout'
import AlliesSidebar from '../components/AlliesSidebar'
import CategoryCard from '../components/CategoryCard'
import { getParentCategories } from '@/app/core/services/partner-categories-service'
import { getAllies, getAlliesByCategory, searchAllies } from '@/app/core/services/allies-service'
import { PartnerCategory } from '@/app/core/types/partner-category'
import { Ally } from '@/app/core/types/ally'

type View = 'categories' | 'allies' | 'subcategories'

const ComerciosPage: React.FC = () => {
  const router = useRouter()
  const [view, setView] = useState<View>('categories')
  const [categories, setCategories] = useState<PartnerCategory[]>([])
  const [subcategories, setSubcategories] = useState<PartnerCategory[]>([])
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
  }, [selectedCategoryId, view, searchQuery])

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId)
    setSearchQuery('')

    if (categoryId === null) {
      setView('categories')
      return
    }

    // Verificar si categoria tiene hijos
    const category = categories.find(c => c.id === categoryId)
    if (category && category.subcategories && category.subcategories.length > 0) {
      setView('subcategories')
      setSubcategories(category.subcategories)
    } else {
      setView('allies')
    }
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
      <div className="max-w-[1500px] mx-auto p-6 md:p-16 overflow-x-hidden">
        {
          view === 'categories' && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={handleCategorySelect}
                />
              ))}
            </div>
          )
        }

        {
          view === 'subcategories' && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
              {subcategories.map((subcategory) => (
                <CategoryCard
                  key={subcategory.id}
                  category={subcategory}
                  onClick={handleCategorySelect}
                />
              ))}
            </div>
          )
        }

        {
          view === 'allies' && (
            <>
              {/* Search Bar */}
              <div className="flex items-center justify-center mb-16">
                <div className="relative w-full max-w-2xl">
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
                <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
                  {allies.map((ally) => (
                    <div
                      key={ally.id}
                      onClick={() => handleAllyClick(ally.id)}
                      className="cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex sm:flex-col bg-white w-full"
                    >
                      {/* Imagen: izquierda en mobile, arriba en tablet/desktop */}
                      <div className="relative w-28 h-24 shrink-0 bg-gray-200 sm:w-full sm:h-48">
                        {ally.photo && ally.photo !== '' && (
                          <Image
                            src={ally.photo}
                            alt={ally.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      {/* Texto: derecha en mobile, abajo en desktop */}
                      <div className="p-4 flex flex-col justify-center min-w-0 flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800 truncate">{ally.name}</h3>
                        {ally.categories && ally.categories.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {ally.categories.map((cat) => cat.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        }
      </div>
    </AlliesLayout>
  )
}

export default ComerciosPage
