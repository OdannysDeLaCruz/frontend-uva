"use client"

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Tag, Power, Pencil, Trash2, X, Check, AlertCircle, UploadCloud } from 'lucide-react'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminToggleCategoryStatus,
  adminDeleteCategory,
  type AdminCategory,
  type CreateCategoryData
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'
import Image from 'next/image'

type FilterStatus = 'all' | 'active' | 'inactive'

// ─── Modal de formulario ────────────────────────────────────────────────────

function CategoryFormModal({
  category,
  allCategories,
  onClose,
  onSave
}: {
  category: AdminCategory | null
  allCategories: AdminCategory[]
  onClose: () => void
  onSave: (data: CreateCategoryData, file?: File) => Promise<void>
}) {
  const isEdit = !!category
  const [form, setForm] = useState<CreateCategoryData>({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    parentId: category?.parentId ?? undefined,
    order: category?.order ?? 0,
    isActive: category?.isActive ?? true
  })
  const [saving, setSaving] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setError(null)
  }

  const clearImage = () => {
    setPendingFile(null)
    setLocalPreview(null)
    setForm(prev => ({ ...prev, image: '' }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'order'
          ? Number(value)
          : name === 'parentId'
            ? (value === '' ? undefined : Number(value))
            : value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(
        { ...form, description: form.description || undefined },
        pendingFile || undefined
      )
    } catch (err: ApiError | unknown) {
      const msg = err instanceof Error
        ? err.message
        : err && typeof err === 'object' && 'message' in err
          ? (err as ApiError).message
          : 'Error al guardar'
      setError(Array.isArray(msg) ? msg[0] : (msg as string))
    } finally {
      setSaving(false)
    }
  }

  // Excluir la categoría que se está editando y sus subcategorías para evitar ciclos
  const parentOptions = allCategories.filter(c =>
    c.parentId === null || c.parentId === undefined
  ).filter(c => c.id !== category?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center">
              <Tag className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-base font-semibold text-white">
              {isEdit ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Restaurantes"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción breve de la categoría"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Imagen</label>
            <label
              className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-purple-500/50 hover:bg-white/3"
              style={{ borderColor: 'var(--border)' }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              {localPreview || form.image ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={localPreview || form.image} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">Cambiar imagen</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="h-7 w-7 text-purple-400/50" />
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="text-xs text-white/20">PNG, JPG, WEBP</p>
                </div>
              )}
            </label>
            {(localPreview || form.image) && (
              <button
                type="button"
                onClick={clearImage}
                className="mt-1.5 flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
                Quitar imagen
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Categoría padre</label>
              <select
                name="parentId"
                value={form.parentId ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              >
                <option value="">Sin padre</option>
                {parentOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Orden</label>
              <input
                name="order"
                type="number"
                min={0}
                value={form.order}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="text-sm text-white/70">Categoría activa</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {pendingFile ? 'Subiendo imagen...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEdit ? 'Guardar cambios' : 'Crear categoría'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal de confirmación de eliminación ────────────────────────────────────

function DeleteConfirmModal({
  category,
  onClose,
  onConfirm
}: {
  category: AdminCategory
  onClose: () => void
  onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border shadow-2xl p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Eliminar categoría</h2>
        </div>
        <p className="text-sm text-white/60 mb-6">
          ¿Estás seguro de que deseas eliminar <span className="text-white font-medium">{category.name}</span>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null)

  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetCategories()
      setCategories(data)
    } catch {
      showToast('Error al cargar categorías', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.isActive) ||
      (filterStatus === 'inactive' && !c.isActive)
    return matchesSearch && matchesStatus
  })

  const handleToggle = async (c: AdminCategory) => {
    setTogglingId(c.id)
    try {
      const res = await adminToggleCategoryStatus(c.id)
      setCategories(prev => prev.map(x => x.id === c.id ? { ...x, isActive: res.isActive } : x))
      showToast(res.message, 'ok')
    } catch {
      showToast('Error al cambiar estado', 'err')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSave = async (data: CreateCategoryData, file?: File) => {
    if (editingCategory) {
      const updated = await adminUpdateCategory(editingCategory.id, data, file)
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...updated } : c))
      showToast('Categoría actualizada', 'ok')
    } else {
      const created = await adminCreateCategory(data, file)
      setCategories(prev => [created, ...prev])
      showToast('Categoría creada', 'ok')
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    try {
      await adminDeleteCategory(deletingCategory.id)
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id))
      showToast('Categoría eliminada', 'ok')
    } catch {
      showToast('Error al eliminar categoría', 'err')
    } finally {
      setDeletingCategory(null)
    }
  }

  const openEdit = (c: AdminCategory) => {
    setEditingCategory(c)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === 'ok'
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {categories.length} categoría(s) · {categories.filter(c => c.isActive).length} activa(s)
          </p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {(['all', 'active', 'inactive'] as FilterStatus[]).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === f ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              style={filterStatus === f ? { background: 'var(--gradient-primary)' } : {}}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Inactivas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl border text-center py-16"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">Sin resultados</p>
          <p className="text-xs mt-1">Crea la primera categoría para los comercios</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {filtered.map((c, idx) => (
            <div
              key={c.id}
              className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/3 ${
                idx !== 0 ? 'border-t' : ''
              }`}
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {/* Imagen o placeholder */}
              <div className="relative h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-500/20 to-purple-800/20 flex items-center justify-center">
                {c.image ? (
                  <Image src={c.image} alt={c.name} fill className="object-cover" />
                ) : (
                  <Tag className="h-5 w-5 text-purple-400/40" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                  {c.parentId && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 shrink-0">Sub</span>
                  )}
                  {c.subcategories && c.subcategories.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md shrink-0" style={{ background: 'var(--surface-light)', color: 'var(--text-muted)' }}>
                      {c.subcategories.length} sub
                    </span>
                  )}
                </div>
                {c.description && (
                  <p className="text-xs text-white/40 truncate mt-0.5">{c.description}</p>
                )}
              </div>

              {/* Orden */}
              <span className="text-xs shrink-0 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                Orden: {c.order}
              </span>

              {/* Badge estado */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                c.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {c.isActive ? 'Activa' : 'Inactiva'}
              </span>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => openEdit(c)}
                  title="Editar"
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggle(c)}
                  disabled={togglingId === c.id}
                  title={c.isActive ? 'Desactivar' : 'Activar'}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                    c.isActive
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {togglingId === c.id ? (
                    <span className="h-4 w-4 border border-current/30 border-t-current rounded-full animate-spin block" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setDeletingCategory(c)}
                  title="Eliminar"
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryFormModal
          category={editingCategory}
          allCategories={categories}
          onClose={() => { setShowForm(false); setEditingCategory(null) }}
          onSave={handleSave}
        />
      )}

      {deletingCategory && (
        <DeleteConfirmModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
