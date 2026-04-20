"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { type AdminCategory } from '@/app/core/services/admin-service'

interface CheckRowProps {
  id: number
  label: string
  checked: boolean
  indent?: boolean
  onToggle: (id: number) => void
}

function CheckRow({ id, label, checked, indent = false, onToggle }: CheckRowProps) {
  return (
    <label
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5 ${indent ? 'ml-5' : ''}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="sr-only"
      />
      <div className={`h-4 w-4 rounded flex items-center justify-center shrink-0 border transition-all ${
        checked ? 'bg-purple-600 border-purple-600' : 'border-white/20 bg-transparent'
      }`}>
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-white' : 'text-white/60'}`}>
        {label}
      </span>
    </label>
  )
}

interface CategoryPickerProps {
  categories: AdminCategory[]
  selected: number[]
  onChange: (ids: number[]) => void
}

export function CategoryPicker({ categories, selected, onChange }: CategoryPickerProps) {
  const [search, setSearch] = useState('')

  const toggle = (id: number) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }

  const q = search.toLowerCase().trim()

  const visibleParents = categories
    .filter(p => !p.parentId)
    .map(parent => {
      const children = parent.subcategories || []
      if (!q) return { parent, children }
      const parentMatches = parent.name.toLowerCase().includes(q)
      const matchingChildren = children.filter(c => c.name.toLowerCase().includes(q))
      if (!parentMatches && matchingChildren.length === 0) return null
      return { parent, children: parentMatches ? children : matchingChildren }
    })
    .filter(Boolean) as { parent: AdminCategory; children: AdminCategory[] }[]

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      {/* Buscador */}
      <div className="relative border-b" style={{ borderColor: 'var(--border)' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar categoría..."
          className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 bg-transparent focus:outline-none"
        />
      </div>

      {/* Lista */}
      <div style={{ background: 'var(--surface-light)' }}>
        {visibleParents.length === 0 ? (
          <p className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            {q ? 'Sin resultados' : 'No hay categorías disponibles'}
          </p>
        ) : (
          <div className="py-1">
            {visibleParents.map(({ parent, children }) => (
              <div key={parent.id}>
                <CheckRow
                  id={parent.id}
                  label={parent.name}
                  checked={selected.includes(parent.id)}
                  onToggle={toggle}
                />
                {children.map(child => (
                  <CheckRow
                    key={child.id}
                    id={child.id}
                    label={child.name}
                    checked={selected.includes(child.id)}
                    indent
                    onToggle={toggle}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
