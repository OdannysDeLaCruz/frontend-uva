"use client"

import { useEffect, useState, useCallback } from 'react'
import {
  Plus,
  Search,
  Store,
  Power,
  Pencil,
  Gift,
  X,
  Check,
  UploadCloud
} from 'lucide-react'
import { ServerAlert } from '@/app/core/ui/alert-dialog'
import {
  adminGetComercios,
  adminCreateComercio,
  adminUpdateComercio,
  adminToggleComercioStatus,
  adminGetBenefits,
  adminAssignBenefit,
  adminRemoveBenefit,
  type AdminComercio,
  type AdminBenefit,
  type CreateComercioData
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'

type FilterStatus = 'all' | 'active' | 'inactive'

// ─── Modal de formulario de comercio ───────────────────────────────────────

function ComercioFormModal({
  comercio,
  onClose,
  onSave
}: {
  comercio: AdminComercio | null
  onClose: () => void
  onSave: (data: CreateComercioData, file?: File) => Promise<void>
}) {
  const isEdit = !!comercio
  const [form, setForm] = useState<CreateComercioData>({
    name: comercio?.name || '',
    representativeName: comercio?.representativeName || '',
    legalName: comercio?.legalName || '',
    docNumber: comercio?.docNumber || '',
    address: comercio?.address || '',
    email: comercio?.email || '',
    phone: comercio?.phone || '',
    description: comercio?.description || '',
    isActive: comercio?.isActive ?? true,
    password: ''
  })
  const [saving, setSaving] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(comercio?.photo || null)
  const [errors, setErrors] = useState<string[] | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setErrors(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setErrors(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors(null)
    try {
      const dataToSend = { ...form }
      if (isEdit && !dataToSend.password) {
        delete dataToSend.password
      }
      await onSave(dataToSend, pendingFile || undefined)
    } catch (err: ApiError | unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as ApiError).message
        : 'Error al guardar'
      setErrors(Array.isArray(msg) ? msg : [msg as string])
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <ServerAlert
      open={!!errors}
      onOpenChange={() => setErrors(null)}
      title="Error al guardar"
      messages={errors || []}
      variant="error"
      confirmText="Revisar"
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-base font-semibold text-white">
              {isEdit ? 'Editar comercio' : 'Nuevo comercio'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Nombre del comercio <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Panadería El Trigal"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Representante</label>
              <input
                name="representativeName"
                value={form.representativeName}
                onChange={handleChange}
                placeholder="Nombre del representante"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Razón social</label>
              <input
                name="legalName"
                value={form.legalName}
                onChange={handleChange}
                placeholder="Nombre legal"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">NIT / Documento</label>
              <input
                name="docNumber"
                value={form.docNumber}
                onChange={handleChange}
                placeholder="900.123.456-7"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Teléfono</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+57 300 000 0000"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="comercio@ejemplo.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Contraseña {isEdit && <span className="text-white/30 text-xs">(dejar vacío para no cambiar)</span>}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Dirección</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle 1 # 2-3, Ciudad"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Foto</label>
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
                      <p className="text-white text-xs font-medium">Cambiar foto</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <UploadCloud className="h-6 w-6 text-purple-400/50" />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Haz clic para subir una foto</p>
                  </div>
                )}
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Descripción breve del comercio"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
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
              <span className="text-sm text-white/70">Comercio activo</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
                  {isEdit ? 'Guardar cambios' : 'Crear comercio'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

// ─── Modal de gestión de beneficios de un comercio ─────────────────────────

function ComerciosBenefitsModal({
  comercio,
  allBenefits,
  onClose,
  onRefresh
}: {
  comercio: AdminComercio
  allBenefits: AdminBenefit[]
  onClose: () => void
  onRefresh: () => void
}) {
  const [assigning, setAssigning] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const assignedIds = new Set(comercio.benefits?.map(b => b.id) || [])

  const availableBenefits = allBenefits.filter(b =>
    !assignedIds.has(b.id) &&
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleAssign = async (benefitId: number) => {
    setAssigning(benefitId)
    try {
      await adminAssignBenefit(comercio.id, benefitId)
      onRefresh()
      showToast('Beneficio asignado', 'ok')
    } catch {
      showToast('Error al asignar beneficio', 'err')
    } finally {
      setAssigning(null)
    }
  }

  const handleRemove = async (benefitId: number) => {
    setRemoving(benefitId)
    try {
      await adminRemoveBenefit(comercio.id, benefitId)
      onRefresh()
      showToast('Beneficio removido', 'ok')
    } catch {
      showToast('Error al remover beneficio', 'err')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all ${
          toast.type === 'ok' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {toast.msg}
        </div>
      )}

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-400" />
              Beneficios · {comercio.name}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {comercio.benefits?.length || 0} beneficio(s) asignado(s)
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Asignados */}
          <div className="px-6 pt-5 pb-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Beneficios asignados
            </p>
            {!comercio.benefits?.length ? (
              <div className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                <Gift className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin beneficios asignados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {comercio.benefits.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Gift className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{b.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {b.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(b.id)}
                      disabled={removing === b.id}
                      className="ml-3 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                    >
                      {removing === b.id ? (
                        <span className="h-4 w-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t mx-6" style={{ borderColor: 'var(--border)' }} />

          {/* Disponibles */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Agregar beneficio
            </p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar beneficio..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
              />
            </div>

            {availableBenefits.length === 0 ? (
              <p className="text-center text-sm py-4" style={{ color: 'var(--text-muted)' }}>
                {search ? 'Sin resultados' : 'Todos los beneficios están asignados'}
              </p>
            ) : (
              <div className="space-y-2">
                {availableBenefits.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Gift className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{b.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {b.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssign(b.id)}
                      disabled={assigning === b.id}
                      className="ml-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white gradient-bg hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5"
                    >
                      {assigning === b.id ? (
                        <span className="h-3 w-3 border border-white/30 border-t-white rounded-full animate-spin block" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      Asignar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function AdminComerciosPage() {
  const [comercios, setComercios] = useState<AdminComercio[]>([])
  const [allBenefits, setAllBenefits] = useState<AdminBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingComercio, setEditingComercio] = useState<AdminComercio | null>(null)
  const [benefitsComercio, setBenefitsComercio] = useState<AdminComercio | null>(null)

  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [c, b] = await Promise.all([adminGetComercios(), adminGetBenefits()])
      setComercios(c)
      setAllBenefits(b)
    } catch {
      showToast('Error al cargar datos', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredComercios = comercios.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.docNumber?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.isActive) ||
      (filterStatus === 'inactive' && !c.isActive)
    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = async (c: AdminComercio) => {
    setTogglingId(c.id)
    try {
      const res = await adminToggleComercioStatus(c.id)
      setComercios(prev => prev.map(x => x.id === c.id ? { ...x, isActive: res.isActive } : x))
      showToast(res.message, 'ok')
    } catch {
      showToast('Error al cambiar estado', 'err')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSaveComercio = async (data: CreateComercioData, file?: File) => {
    if (editingComercio) {
      const updated = await adminUpdateComercio(editingComercio.id, data, file)
      setComercios(prev => prev.map(c => c.id === editingComercio.id ? { ...c, ...updated } : c))
      showToast('Comercio actualizado', 'ok')
    } else {
      const created = await adminCreateComercio(data, file)
      setComercios(prev => [created, ...prev])
      showToast('Comercio creado exitosamente', 'ok')
    }
    setShowForm(false)
    setEditingComercio(null)
  }

  const openEdit = (c: AdminComercio) => {
    setEditingComercio(c)
    setShowForm(true)
  }

  const openBenefits = (c: AdminComercio) => {
    setBenefitsComercio(c)
  }

  const handleBenefitsRefresh = async () => {
    const updated = await adminGetComercios()
    setComercios(updated)
    if (benefitsComercio) {
      const fresh = updated.find(c => c.id === benefitsComercio.id)
      if (fresh) setBenefitsComercio(fresh)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === 'ok' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Comercios</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {comercios.length} comercio(s) registrado(s) · {comercios.filter(c => c.isActive).length} activo(s)
          </p>
        </div>
        <button
          onClick={() => { setEditingComercio(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Nuevo comercio
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o documento..."
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

      {/* Tabla / lista */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filteredComercios.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <Store className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Sin resultados</p>
            <p className="text-xs mt-1">Intenta cambiar los filtros o crea un nuevo comercio</p>
          </div>
        ) : (
          <>
            {/* Cabecera tabla - solo desktop */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span>Comercio</span>
              <span>Contacto</span>
              <span>Estado</span>
              <span>Beneficios</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredComercios.map((c) => (
                <div
                  key={c.id}
                  className="px-4 md:px-6 py-4 hover:bg-white/2 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="flex items-start gap-3 md:hidden">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${c.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          {c.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {c.email || 'Sin correo'} · {c.phone || 'Sin teléfono'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {c.benefits?.length || 0} beneficio(s)
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => openEdit(c)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border text-white/60 hover:text-white border-white/10 hover:bg-white/5 transition-all">
                          <Pencil className="h-3 w-3" />Editar
                        </button>
                        <button onClick={() => openBenefits(c)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-all">
                          <Gift className="h-3 w-3" />Beneficios
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={togglingId === c.id}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                            c.isActive
                              ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                              : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                          }`}
                        >
                          <Power className="h-3 w-3" />
                          {c.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {c.docNumber || 'Sin documento'}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-white/80 truncate">{c.email || '—'}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {c.phone || 'Sin teléfono'}
                      </p>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {c.isActive ? 'Activo' : 'Inactivo'}
                    </span>

                    <span className="text-sm text-white/60 text-center">
                      {c.benefits?.length || 0}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        title="Editar"
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        title="Gestionar beneficios"
                        onClick={() => openBenefits(c)}
                        className="p-2 rounded-lg text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                      >
                        <Gift className="h-4 w-4" />
                      </button>
                      <button
                        title={c.isActive ? 'Desactivar' : 'Activar'}
                        onClick={() => handleToggleStatus(c)}
                        disabled={togglingId === c.id}
                        className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                          c.isActive
                            ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-green-400/60 hover:text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {togglingId === c.id ? (
                          <span className="h-4 w-4 border border-current/30 border-t-current rounded-full animate-spin block" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ComercioFormModal
          comercio={editingComercio}
          onClose={() => { setShowForm(false); setEditingComercio(null) }}
          onSave={handleSaveComercio}
        />
      )}

      {benefitsComercio && (
        <ComerciosBenefitsModal
          comercio={benefitsComercio}
          allBenefits={allBenefits}
          onClose={() => setBenefitsComercio(null)}
          onRefresh={handleBenefitsRefresh}
        />
      )}
    </div>
  )
}
