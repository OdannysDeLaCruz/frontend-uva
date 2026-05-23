"use client"

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Gift, Power, Pencil, X, Check, AlertCircle, Store, UploadCloud } from 'lucide-react'
import {
  adminGetBenefits,
  adminCreateBenefit,
  adminUpdateBenefit,
  adminToggleBenefitStatus,
  adminGetComercios,
  adminAssignBenefit,
  adminRemoveBenefit,
  type AdminBenefit,
  type AdminComercio,
  type CreateBenefitData
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'

type FilterStatus = 'all' | 'active' | 'inactive'

// ─── Modal de formulario ────────────────────────────────────────────────────

function BenefitFormModal({
  benefit,
  allComercios,
  assignedComercioIds,
  onClose,
  onSave
}: {
  benefit: AdminBenefit | null
  allComercios: AdminComercio[]
  assignedComercioIds: number[]
  onClose: () => void
  onSave: (data: CreateBenefitData, comercioIds: number[], file?: File) => Promise<void>
}) {
  const isEdit = !!benefit
  const [form, setForm] = useState<CreateBenefitData>({
    name: benefit?.name || '',
    description: benefit?.description || '',
    image: benefit?.image || '',
    dateStart: benefit?.dateStart ? benefit.dateStart.slice(0, 10) : '',
    dateEnd: benefit?.dateEnd ? benefit.dateEnd.slice(0, 10) : '',
    isActive: benefit?.isActive ?? true
  })
  const [selectedComercioIds, setSelectedComercioIds] = useState<number[]>(assignedComercioIds)
  const [comercioSearch, setComercioSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(benefit?.image || null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setError(null)
  }

  const toggleComercio = (id: number) => {
    setSelectedComercioIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedComercioIds.length === 0) {
      setError('Debes asignar al menos un comercio al beneficio.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(
        {
          ...form,
          dateStart: form.dateStart || undefined,
          dateEnd: form.dateEnd || undefined
        },
        selectedComercioIds,
        pendingFile || undefined
      )
    } catch (err: ApiError | unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as ApiError).message : 'Error al guardar'
      setError(Array.isArray(msg) ? msg[0] : (msg as string))
    } finally {
      setSaving(false)
    }
  }

  const filteredComercios = allComercios.filter(c =>
    c.name.toLowerCase().includes(comercioSearch.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-base font-semibold text-white">
              {isEdit ? 'Editar beneficio' : 'Nuevo beneficio'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ─── Datos del beneficio ─── */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. 20% de descuento en compras"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Describe el beneficio para los miembros UVA"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Imagen</label>
            <label
              className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-purple-500/50 hover:bg-white/3"
              style={{ borderColor: 'var(--border)' }}
            >
              <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              {localPreview ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={localPreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">Cambiar imagen</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <UploadCloud className="h-6 w-6 text-purple-400/50" />
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Haz clic para subir una imagen</p>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha inicio</label>
              <input
                name="dateStart"
                type="date"
                value={form.dateStart}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha fin</label>
              <input
                name="dateEnd"
                type="date"
                value={form.dateEnd}
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
            <span className="text-sm text-white/70">Beneficio activo</span>
          </div>

          {/* ─── Comercios ─── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/70">
                Comercios asignados <span className="text-red-400">*</span>
                <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                  (mínimo 1)
                </span>
              </label>
              {selectedComercioIds.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {selectedComercioIds.length} seleccionado(s)
                </span>
              )}
            </div>

            {/* Búsqueda */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
              <input
                value={comercioSearch}
                onChange={e => setComercioSearch(e.target.value)}
                placeholder="Buscar comercio..."
                className="w-full pl-8 pr-4 py-2 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            {/* Lista de comercios con checkbox */}
            <div
              className="rounded-xl border overflow-hidden max-h-48 overflow-y-auto scrollbar-thin"
              style={{ borderColor: 'var(--border)' }}
            >
              {filteredComercios.length === 0 ? (
                <p className="text-center text-xs py-4" style={{ color: 'var(--text-muted)' }}>
                  Sin comercios disponibles
                </p>
              ) : (
                filteredComercios.map((c, idx) => {
                  const checked = selectedComercioIds.includes(c.id)
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        checked ? 'bg-purple-500/10' : 'hover:bg-white/3'
                      } ${idx !== 0 ? 'border-t' : ''}`}
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {/* Checkbox personalizado */}
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                          checked
                            ? 'bg-purple-600 border-purple-600'
                            : 'bg-transparent border-white/20'
                        }`}
                        onClick={() => toggleComercio(c.id)}
                      >
                        {checked && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <div className="flex items-center gap-2 min-w-0 flex-1" onClick={() => toggleComercio(c.id)}>
                        <div
                          className="h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'var(--gradient-primary)' }}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-white truncate">{c.name}</span>
                        {!c.isActive && (
                          <span className="text-xs text-red-400/70 shrink-0">(inactivo)</span>
                        )}
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          {/* Acciones */}
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
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEdit ? 'Guardar cambios' : 'Crear beneficio'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function AdminBeneficiosPage() {
  const [benefits, setBenefits] = useState<AdminBenefit[]>([])
  const [comercios, setComercios] = useState<AdminComercio[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState<AdminBenefit | null>(null)

  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [b, c] = await Promise.all([adminGetBenefits(), adminGetComercios()])
      setBenefits(b)
      setComercios(c)
    } catch {
      showToast('Error al cargar datos', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Derivar los comercios que tienen un beneficio dado
  const getAssignedComercioIds = (benefitId: number) =>
    comercios
      .filter(c => c.benefits?.some(b => b.id === benefitId))
      .map(c => c.id)

  const filtered = benefits.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && b.isActive) ||
      (filterStatus === 'inactive' && !b.isActive)
    return matchesSearch && matchesStatus
  })

  const handleToggle = async (b: AdminBenefit) => {
    setTogglingId(b.id)
    try {
      const res = await adminToggleBenefitStatus(b.id)
      setBenefits(prev => prev.map(x => x.id === b.id ? { ...x, isActive: res.isActive } : x))
      showToast(res.message, 'ok')
    } catch {
      showToast('Error al cambiar estado', 'err')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSave = async (data: CreateBenefitData, newComercioIds: number[], file?: File) => {
    if (editingBenefit) {
      // Actualizar datos del beneficio
      const updated = await adminUpdateBenefit(editingBenefit.id, data, file)
      setBenefits(prev => prev.map(b => b.id === editingBenefit.id ? { ...b, ...updated } : b))

      // Sincronizar asignaciones: quitar los que ya no están, agregar los nuevos
      const currentIds = getAssignedComercioIds(editingBenefit.id)
      const toRemove = currentIds.filter(id => !newComercioIds.includes(id))
      const toAdd = newComercioIds.filter(id => !currentIds.includes(id))

      await Promise.all([
        ...toRemove.map(cId => adminRemoveBenefit(cId, editingBenefit.id)),
        ...toAdd.map(cId => adminAssignBenefit(cId, editingBenefit.id))
      ])

      showToast('Beneficio actualizado', 'ok')
    } else {
      // Crear beneficio y luego asignar comercios
      const created = await adminCreateBenefit(data, file)
      setBenefits(prev => [created, ...prev])

      await Promise.all(newComercioIds.map(cId => adminAssignBenefit(cId, created.id)))

      showToast('Beneficio creado y asignado', 'ok')
    }

    // Refrescar comercios para que los datos derivados estén actualizados
    const updatedComercios = await adminGetComercios()
    setComercios(updatedComercios)

    setShowForm(false)
    setEditingBenefit(null)
  }

  const openEdit = (b: AdminBenefit) => {
    setEditingBenefit(b)
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
          <h1 className="text-2xl font-bold text-white">Beneficios</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {benefits.length} beneficio(s) · {benefits.filter(b => b.isActive).length} activo(s)
          </p>
        </div>
        <button
          onClick={() => { setEditingBenefit(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Nuevo beneficio
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
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
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl border text-center py-16"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Gift className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">Sin resultados</p>
          <p className="text-xs mt-1">Crea el primer beneficio para los comercios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const assignedComercios = comercios.filter(c =>
              c.benefits?.some(ben => ben.id === b.id)
            )
            return (
              <div
                key={b.id}
                className="rounded-2xl border overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 flex flex-col"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b flex items-start gap-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block ${
                      b.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {b.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex-1 space-y-3">
                  <p className="text-sm text-white/60 line-clamp-2">{b.description}</p>

                  {/* Comercios asignados */}
                  <div>
                    <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <Store className="h-3 w-3" />
                      {assignedComercios.length === 0
                        ? 'Sin comercios asignados'
                        : `${assignedComercios.length} comercio(s)`}
                    </p>
                    {assignedComercios.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {assignedComercios.slice(0, 3).map(c => (
                          <span
                            key={c.id}
                            className="text-xs px-2 py-0.5 rounded-md truncate max-w-[120px]"
                            style={{ background: 'var(--surface-light)', color: 'var(--text-muted)' }}
                          >
                            {c.name}
                          </span>
                        ))}
                        {assignedComercios.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--surface-light)', color: 'var(--text-muted)' }}>
                            +{assignedComercios.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {(b.dateStart || b.dateEnd) && (
                    <div className="flex flex-wrap gap-2">
                      {b.dateStart && (
                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface-light)', color: 'var(--text-muted)' }}>
                          Desde: {new Date(b.dateStart).toLocaleDateString('es-CO')}
                        </span>
                      )}
                      {b.dateEnd && (
                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface-light)', color: 'var(--text-muted)' }}>
                          Hasta: {new Date(b.dateEnd).toLocaleDateString('es-CO')}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 pb-4 flex gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-white/60 border border-white/10 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggle(b)}
                    disabled={togglingId === b.id}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                      b.isActive
                        ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                        : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                    }`}
                  >
                    {togglingId === b.id ? (
                      <span className="h-3 w-3 border border-current/30 border-t-current rounded-full animate-spin block" />
                    ) : (
                      <Power className="h-3.5 w-3.5" />
                    )}
                    {b.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <BenefitFormModal
          benefit={editingBenefit}
          allComercios={comercios}
          assignedComercioIds={
            editingBenefit ? getAssignedComercioIds(editingBenefit.id) : []
          }
          onClose={() => { setShowForm(false); setEditingBenefit(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
