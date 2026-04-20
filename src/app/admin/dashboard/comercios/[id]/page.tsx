"use client"

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Store,
  Check,
  UploadCloud,
  Gift,
  Plus,
  X,
  Power,
  Search,
  Tag
} from 'lucide-react'
import { ServerAlert } from '@/app/core/ui/alert-dialog'
import { CategoryPicker } from '@/app/admin/components/category-picker'
import {
  adminGetComercio,
  adminUpdateComercio,
  adminToggleComercioStatus,
  adminGetBenefits,
  adminGetCategories,
  adminAssignBenefit,
  adminRemoveBenefit,
  type AdminComercio,
  type AdminBenefit,
  type AdminCategory,
  type CreateComercioData
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'

// ─── Sección: Información del comercio ────────────────────────────────────────

function InfoSection({
  comercio,
  categories,
  onSaved
}: {
  comercio: AdminComercio
  categories: AdminCategory[]
  onSaved: (updated: AdminComercio) => void
}) {
  const [form, setForm] = useState<CreateComercioData>({
    name: comercio.name,
    representativeName: comercio.representativeName || '',
    legalName: comercio.legalName || '',
    docNumber: comercio.docNumber || '',
    address: comercio.address || '',
    email: comercio.email || '',
    phone: comercio.phone || '',
    description: comercio.description || '',
    isActive: comercio.isActive,
    password: '',
    categoryIds: comercio.categories?.map(c => c.id) || []
  })
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(comercio.photo || null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[] | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
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
      const dataToSend = { ...form }
      if (!dataToSend.password) delete dataToSend.password
      const updated = await adminUpdateComercio(comercio.id, dataToSend, pendingFile || undefined)
      setPendingFile(null)
      onSaved(updated)
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
  const labelClass = "block text-sm font-medium text-white/70 mb-1.5"

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
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <div className="h-8 w-8 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <Store className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-white">Información del comercio</h2>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Foto */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Foto</label>
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

            {/* Nombre */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Nombre del comercio <span className="text-red-400">*</span></label>
              <input name="name" required value={form.name} onChange={handleChange}
                placeholder="Ej. Panadería El Trigal" className={inputClass} style={inputStyle} />
            </div>

            {/* Representante */}
            <div>
              <label className={labelClass}>Representante <span className="text-red-400">*</span></label>
              <input name="representativeName" required value={form.representativeName} onChange={handleChange}
                placeholder="Nombre del representante" className={inputClass} style={inputStyle} />
            </div>

            {/* Razón social */}
            <div>
              <label className={labelClass}>Razón social <span className="text-red-400">*</span></label>
              <input name="legalName" required value={form.legalName} onChange={handleChange}
                placeholder="Nombre legal" className={inputClass} style={inputStyle} />
            </div>

            {/* NIT */}
            <div>
              <label className={labelClass}>NIT / Documento <span className="text-red-400">*</span></label>
              <input name="docNumber" required value={form.docNumber} onChange={handleChange}
                placeholder="900.123.456-7" className={inputClass} style={inputStyle} />
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelClass}>Teléfono <span className="text-red-400">*</span></label>
              <input name="phone" required value={form.phone} onChange={handleChange}
                placeholder="+57 300 000 0000" className={inputClass} style={inputStyle} />
            </div>

            {/* Correo */}
            <div>
              <label className={labelClass}>Correo electrónico <span className="text-red-400">*</span></label>
              <input name="email" required type="email" value={form.email} onChange={handleChange}
                placeholder="comercio@ejemplo.com" className={inputClass} style={inputStyle} />
            </div>

            {/* Contraseña */}
            <div>
              <label className={labelClass}>
                Contraseña <span className="text-white/30 text-xs">(dejar vacío para no cambiar)</span>
              </label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" minLength={6} className={inputClass} style={inputStyle} />
            </div>

            {/* Dirección */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Dirección <span className="text-red-400">*</span></label>
              <input name="address" required value={form.address} onChange={handleChange}
                placeholder="Calle 1 # 2-3, Ciudad" className={inputClass} style={inputStyle} />
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                placeholder="Descripción breve del comercio"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                style={inputStyle} />
            </div>

            {/* Categorías */}
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Categorías <span className="text-red-400">*</span>
              </label>
              <CategoryPicker
                categories={categories}
                selected={form.categoryIds || []}
                onChange={ids => setForm(prev => ({ ...prev, categoryIds: ids }))}
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

          <div className="px-6 pb-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

// ─── Sección: Beneficios ───────────────────────────────────────────────────────

function BenefitsSection({
  comercio,
  allBenefits,
  onRefresh
}: {
  comercio: AdminComercio
  allBenefits: AdminBenefit[]
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [assigning, setAssigning] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const assignedIds = new Set(comercio.benefits?.map(b => b.id) || [])
  const available = allBenefits.filter(b =>
    !assignedIds.has(b.id) && b.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAssign = async (benefitId: number) => {
    setAssigning(benefitId)
    try {
      await adminAssignBenefit(comercio.id, benefitId)
      onRefresh()
      showToast('Beneficio asignado', 'ok')
    } catch {
      showToast('Error al asignar', 'err')
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
      showToast('Error al remover', 'err')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === 'ok' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <div className="h-8 w-8 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
          <Gift className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Beneficios</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {comercio.benefits?.length || 0} asignado(s)
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Asignados */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Asignados
          </p>
          {!comercio.benefits?.length ? (
            <div className="text-center py-8 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <Gift className="h-8 w-8 mx-auto mb-2 opacity-20 text-white" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sin beneficios asignados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {comercio.benefits.map(b => (
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
                      {b.description && (
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(b.id)}
                    disabled={removing === b.id}
                    className="ml-3 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                  >
                    {removing === b.id
                      ? <span className="h-4 w-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                      : <X className="h-4 w-4" />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disponibles */}
        <div>
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
          {available.length === 0 ? (
            <p className="text-center text-sm py-4" style={{ color: 'var(--text-muted)' }}>
              {search ? 'Sin resultados' : 'Todos los beneficios están asignados'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {available.map(b => (
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
                      {b.description && (
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssign(b.id)}
                    disabled={assigning === b.id}
                    className="ml-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white gradient-bg hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    {assigning === b.id
                      ? <span className="h-3 w-3 border border-white/30 border-t-white rounded-full animate-spin block" />
                      : <Plus className="h-3 w-3" />
                    }
                    Asignar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function ComercioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [comercio, setComercio] = useState<AdminComercio | null>(null)
  const [allBenefits, setAllBenefits] = useState<AdminBenefit[]>([])
  const [allCategories, setAllCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [confirmToggle, setConfirmToggle] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    try {
      const [c, b, cats] = await Promise.all([
        adminGetComercio(Number(id)),
        adminGetBenefits(),
        adminGetCategories()
      ])
      setComercio(c)
      setAllBenefits(b)
      setAllCategories(cats)
    } catch {
      router.push('/admin/dashboard/comercios')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSaved = (updated: AdminComercio) => {
    setComercio(prev => prev ? { ...prev, ...updated } : updated)
    showToast('Cambios guardados', 'ok')
  }

  const handleRefreshBenefits = async () => {
    const fresh = await adminGetComercio(Number(id))
    setComercio(fresh)
  }

  const handleToggleStatus = async () => {
    if (!comercio) return
    setToggling(true)
    try {
      const res = await adminToggleComercioStatus(comercio.id)
      setComercio(prev => prev ? { ...prev, isActive: res.isActive } : prev)
      showToast(res.message, 'ok')
    } catch {
      showToast('Error al cambiar estado', 'err')
    } finally {
      setToggling(false)
      setConfirmToggle(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!comercio) return null

  return (
    <div className="space-y-6">
      <ServerAlert
        open={confirmToggle}
        onOpenChange={setConfirmToggle}
        title={comercio.isActive ? 'Desactivar comercio' : 'Activar comercio'}
        messages={[
          comercio.isActive
            ? `¿Seguro que deseas desactivar "${comercio.name}"? No estará visible para los usuarios.`
            : `¿Seguro que deseas activar "${comercio.name}"? Estará visible para los usuarios.`
        ]}
        variant={comercio.isActive ? 'error' : 'success'}
        confirmText={comercio.isActive ? 'Sí, desactivar' : 'Sí, activar'}
        onConfirm={handleToggleStatus}
      />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === 'ok' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/dashboard/comercios')}
            className="p-2 rounded-xl border text-white/40 hover:text-white hover:bg-white/5 transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{comercio.name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                comercio.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {comercio.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {comercio.email} · {comercio.phone}
            </p>
          </div>
        </div>

        <button
          onClick={() => setConfirmToggle(true)}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${
            comercio.isActive
              ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
              : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
          }`}
        >
          {toggling
            ? <span className="h-4 w-4 border border-current/30 border-t-current rounded-full animate-spin" />
            : <Power className="h-4 w-4" />
          }
          {comercio.isActive ? 'Desactivar' : 'Activar'}
        </button>
      </div>

      {/* Tabs de resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Categorías', value: comercio.categories?.length || 0, icon: Tag, color: 'text-blue-400' },
          { label: 'Beneficios', value: comercio.benefits?.length || 0, icon: Gift, color: 'text-purple-400' },
          { label: 'Estado', value: comercio.isActive ? 'Activo' : 'Inactivo', icon: Power, color: comercio.isActive ? 'text-green-400' : 'text-red-400' },
          { label: 'Documento', value: comercio.docNumber || '—', icon: Store, color: 'text-white/50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border px-4 py-3"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Secciones */}
      <InfoSection
        comercio={comercio}
        categories={allCategories}
        onSaved={handleSaved}
      />

      <BenefitsSection
        comercio={comercio}
        allBenefits={allBenefits}
        onRefresh={handleRefreshBenefits}
      />
    </div>
  )
}
