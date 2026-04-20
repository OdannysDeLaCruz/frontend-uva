"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Store,
  X,
  Check,
  UploadCloud
} from 'lucide-react'
import { ServerAlert } from '@/app/core/ui/alert-dialog'
import {
  adminGetComercios,
  adminCreateComercio,
  adminGetCategories,
  type AdminComercio,
  type AdminCategory,
  type CreateComercioData
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'
import { CategoryPicker } from '@/app/admin/components/category-picker'

type FilterStatus = 'all' | 'active' | 'inactive'

// ─── Modal de formulario de comercio (solo crear) ─────────────────────────────

function ComercioFormModal({
  categories,
  onClose,
  onSave
}: {
  categories: AdminCategory[]
  onClose: () => void
  onSave: (data: CreateComercioData, file?: File) => Promise<void>
}) {
  const [form, setForm] = useState<CreateComercioData>({
    name: '',
    representativeName: '',
    legalName: '',
    docNumber: '',
    address: '',
    email: '',
    phone: '',
    description: '',
    isActive: true,
    password: '',
    categoryIds: []
  })
  const [saving, setSaving] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[] | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setErrors(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setErrors(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryIds?.length) {
      setErrors(['Debes seleccionar al menos una categoría'])
      return
    }
    setSaving(true)
    setErrors(null)
    try {
      await onSave(form, pendingFile || undefined)
    } catch (err: ApiError | unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as ApiError).message
        : 'Error al guardar'
      setErrors(Array.isArray(msg) ? msg : [msg as string])
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
  const inputStyle = { background: 'var(--surface-light)', borderColor: 'var(--border)' }

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
              <h2 className="text-base font-semibold text-white">Nuevo comercio</h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Foto */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Foto <span className="text-red-400">*</span>
                </label>
                <label
                  className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-purple-500/50"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  {localPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={localPreview} alt="preview" className="h-16 w-16 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="h-16 w-16 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--surface-light)' }}>
                      <UploadCloud className="h-6 w-6 text-purple-400/50" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white/70">{localPreview ? 'Cambiar foto' : 'Subir foto'}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>PNG, JPG — recomendado 400×400px</p>
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Nombre del comercio <span className="text-red-400">*</span>
                </label>
                <input name="name" required value={form.name} onChange={handleChange}
                  placeholder="Ej. Panadería El Trigal" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Representante <span className="text-red-400">*</span>
                </label>
                <input name="representativeName" required value={form.representativeName} onChange={handleChange}
                  placeholder="Nombre del representante" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Razón social <span className="text-red-400">*</span>
                </label>
                <input name="legalName" required value={form.legalName} onChange={handleChange}
                  placeholder="Nombre legal" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  NIT / Documento <span className="text-red-400">*</span>
                </label>
                <input name="docNumber" required value={form.docNumber} onChange={handleChange}
                  placeholder="900.123.456-7" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Teléfono <span className="text-red-400">*</span>
                </label>
                <input name="phone" required value={form.phone} onChange={handleChange}
                  placeholder="+57 300 000 0000" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <input name="email" required type="email" value={form.email} onChange={handleChange}
                  placeholder="comercio@ejemplo.com" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Contraseña <span className="text-red-400">*</span>
                </label>
                <input name="password" required type="password" value={form.password} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres" minLength={6} className={inputClass} style={inputStyle} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Dirección <span className="text-red-400">*</span>
                </label>
                <input name="address" required value={form.address} onChange={handleChange}
                  placeholder="Calle 1 # 2-3, Ciudad" className={inputClass} style={inputStyle} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                  placeholder="Descripción breve del comercio"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  style={inputStyle} />
              </div>

              {/* Categorías */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Categorías <span className="text-red-400">*</span>
                </label>
                <CategoryPicker
                  categories={categories}
                  selected={form.categoryIds || []}
                  onChange={ids => { setForm(prev => ({ ...prev, categoryIds: ids })); setErrors(null) }}
                />
              </div>

              {/* Toggle activo */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-white/70">Comercio activo</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? 'Creando...' : 'Crear comercio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminComerciosPage() {
  const router = useRouter()
  const [comercios, setComercios] = useState<AdminComercio[]>([])
  const [allCategories, setAllCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [c, cats] = await Promise.all([adminGetComercios(), adminGetCategories()])
      setComercios(c)
      setAllCategories(cats)
    } catch {
      showToast('Error al cargar datos', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredComercios = comercios.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.docNumber?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.isActive) ||
      (filterStatus === 'inactive' && !c.isActive)
    return matchesSearch && matchesStatus
  })

  const handleCreate = async (data: CreateComercioData, file?: File) => {
    const created = await adminCreateComercio(data, file)
    setComercios(prev => [created, ...prev])
    showToast('Comercio creado exitosamente', 'ok')
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
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
          onClick={() => setShowForm(true)}
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

      {/* Tabla */}
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
            {/* Cabecera - solo desktop */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span>Comercio</span>
              <span>Contacto</span>
              <span>Estado</span>
              <span />
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredComercios.map(c => (
                <div key={c.id} className="px-4 md:px-6 py-4 hover:bg-white/2 transition-colors">

                  {/* Mobile */}
                  <div className="flex items-center gap-3 md:hidden">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'var(--gradient-primary)' }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => router.push(`/admin/dashboard/comercios/${c.id}`)}
                          className="text-sm font-semibold text-white truncate hover:text-purple-300 transition-colors text-left"
                        >
                          {c.name}
                        </button>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${c.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          {c.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {c.email || 'Sin correo'} · {c.phone || 'Sin teléfono'}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/dashboard/comercios/${c.id}`)}
                      className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-all"
                    >
                      Ver detalle
                    </button>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => router.push(`/admin/dashboard/comercios/${c.id}`)}
                          className="text-sm font-semibold text-white hover:text-purple-300 transition-colors text-left block max-w-full truncate"
                        >
                          {c.name}
                        </button>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {c.docNumber || 'Sin documento'}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-white/80 truncate">{c.email || '—'}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.phone || 'Sin teléfono'}</p>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {c.isActive ? 'Activo' : 'Inactivo'}
                    </span>

                    <button
                      onClick={() => router.push(`/admin/dashboard/comercios/${c.id}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-all"
                    >
                      Ver detalle
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <ComercioFormModal
          categories={allCategories}
          onClose={() => setShowForm(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  )
}
