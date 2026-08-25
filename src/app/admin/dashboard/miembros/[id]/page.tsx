"use client"

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  UserCircle,
  Check,
  Power,
  Users,
  GitBranch,
  UserPlus,
  Network,
  ShieldQuestion
} from 'lucide-react'
import { ServerAlert } from '@/app/core/ui/alert-dialog'
import {
  adminGetMember,
  adminUpdateMember,
  adminToggleMemberStatus,
  type AdminMember,
  type UpdateAdminMemberData,
  type DocType
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' }
]

// ─── Sección: jerarquía (padre / reclutador) ──────────────────────────────────

function HierarchyPersonCard({
  label,
  person,
  emptyLabel
}: {
  label: string
  person: { id: number; name: string; lastname: string; email: string; isActive: boolean } | null
  emptyLabel: string
}) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      {!person ? (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--surface-light)' }}>
            <ShieldQuestion className="h-4 w-4 text-white/30" />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{emptyLabel}</p>
        </div>
      ) : (
        <button
          onClick={() => router.push(`/admin/dashboard/miembros/${person.id}`)}
          className="flex items-center gap-3 w-full text-left group"
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: 'var(--gradient-primary)' }}>
            {person.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
              {person.name} {person.lastname}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{person.email}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${person.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
            {person.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </button>
      )}
    </div>
  )
}

// ─── Sección: información del miembro ─────────────────────────────────────────

function InfoSection({
  member,
  onSaved
}: {
  member: AdminMember
  onSaved: (updated: AdminMember) => void
}) {
  const [form, setForm] = useState<UpdateAdminMemberData>({
    name: member.name,
    lastname: member.lastname,
    doc_number: member.doc_number,
    doc_type: member.doc_type,
    email: member.email,
    phone: member.phone,
    password: '',
    isActive: member.isActive
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[] | null>(null)

  // El botón "Activar/Desactivar" del header actualiza `member.isActive` fuera de este
  // formulario — sin este efecto, guardar cambios luego de alternar el estado
  // reenviaría el valor de isActive obsoleto y revertiría el toggle silenciosamente.
  useEffect(() => {
    setForm(prev => ({ ...prev, isActive: member.isActive }))
  }, [member.isActive])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors(null)
    try {
      const dataToSend = { ...form }
      if (!dataToSend.password) delete dataToSend.password
      const updated = await adminUpdateMember(member.id, dataToSend)
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
  const readOnlyBoxClass = "px-4 py-2.5 rounded-lg text-sm text-white/70 border"
  const readOnlyBoxStyle = { background: 'var(--surface-light)', borderColor: 'var(--border)', opacity: 0.7 }

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
              <UserCircle className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-white">Información del miembro</h2>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Nombre */}
            <div>
              <label className={labelClass}>Nombre <span className="text-red-400">*</span></label>
              <input name="name" required value={form.name} onChange={handleChange}
                placeholder="Nombre" className={inputClass} style={inputStyle} />
            </div>

            {/* Apellido */}
            <div>
              <label className={labelClass}>Apellido <span className="text-red-400">*</span></label>
              <input name="lastname" required value={form.lastname} onChange={handleChange}
                placeholder="Apellido" className={inputClass} style={inputStyle} />
            </div>

            {/* Tipo doc */}
            <div>
              <label className={labelClass}>Tipo de documento <span className="text-red-400">*</span></label>
              <select name="doc_type" required value={form.doc_type} onChange={handleChange}
                className={inputClass} style={inputStyle}>
                {DOC_TYPES.map(dt => (
                  <option key={dt.value} value={dt.value}>{dt.label}</option>
                ))}
              </select>
            </div>

            {/* Núm doc */}
            <div>
              <label className={labelClass}>Número de documento <span className="text-red-400">*</span></label>
              <input name="doc_number" required value={form.doc_number} onChange={handleChange}
                placeholder="0000000000" className={inputClass} style={inputStyle} />
            </div>

            {/* Correo */}
            <div>
              <label className={labelClass}>Correo electrónico <span className="text-red-400">*</span></label>
              <input name="email" required type="email" value={form.email} onChange={handleChange}
                placeholder="miembro@ejemplo.com" className={inputClass} style={inputStyle} />
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelClass}>Teléfono <span className="text-red-400">*</span></label>
              <input name="phone" required value={form.phone} onChange={handleChange}
                placeholder="+57 300 000 0000" className={inputClass} style={inputStyle} />
            </div>

            {/* Contraseña */}
            <div>
              <label className={labelClass}>
                Contraseña <span className="text-white/30 text-xs">(dejar vacío para no cambiar)</span>
              </label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" minLength={6} className={inputClass} style={inputStyle} />
            </div>

            {/* Toggle activo */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
              <span className="text-sm text-white/70">Miembro activo</span>
            </div>

            {/* Separador de solo lectura */}
            <div className="sm:col-span-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-3" style={{ color: 'var(--text-muted)' }}>
                Datos de solo lectura
              </p>
            </div>

            {/* Rol */}
            <div>
              <label className={labelClass}>Rol</label>
              <p className={readOnlyBoxClass} style={readOnlyBoxStyle}>{member.role?.name || 'Sin rol'}</p>
            </div>

            {/* Membresía */}
            <div>
              <label className={labelClass}>Membresía</label>
              <p className={readOnlyBoxClass} style={readOnlyBoxStyle}>{member.membership?.name || 'Sin membresía'}</p>
            </div>

            {/* Código de referido */}
            <div>
              <label className={labelClass}>Código de referido</label>
              <p className={readOnlyBoxClass} style={readOnlyBoxStyle}>{member.referralCode}</p>
            </div>

            {/* Número de rifa */}
            <div>
              <label className={labelClass}>
                Número de rifa <span className="text-white/30 text-xs">(se recalcula al cambiar el documento)</span>
              </label>
              <p className={readOnlyBoxClass} style={readOnlyBoxStyle}>{member.raffleNumber}</p>
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

// ─── Página principal ──────────────────────────────────────────────────────────

export default function MiembroDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [member, setMember] = useState<AdminMember | null>(null)
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
      const m = await adminGetMember(Number(id))
      setMember(m)
    } catch {
      router.push('/admin/dashboard/miembros')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSaved = (updated: AdminMember) => {
    setMember(updated)
    showToast('Cambios guardados', 'ok')
  }

  const handleToggleStatus = async () => {
    if (!member) return
    setToggling(true)
    try {
      const res = await adminToggleMemberStatus(member.id)
      setMember(prev => prev ? { ...prev, isActive: res.isActive } : prev)
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

  if (!member) return null

  const fullName = `${member.name} ${member.lastname}`

  return (
    <div className="space-y-6">
      <ServerAlert
        open={confirmToggle}
        onOpenChange={setConfirmToggle}
        title={member.isActive ? 'Desactivar miembro' : 'Activar miembro'}
        messages={[
          member.isActive
            ? `¿Seguro que deseas desactivar a "${fullName}"? No podrá acceder a la plataforma.`
            : `¿Seguro que deseas activar a "${fullName}"? Podrá volver a acceder a la plataforma.`
        ]}
        variant={member.isActive ? 'error' : 'success'}
        confirmText={member.isActive ? 'Sí, desactivar' : 'Sí, activar'}
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
            onClick={() => router.push('/admin/dashboard/miembros')}
            className="p-2 rounded-xl border text-white/40 hover:text-white hover:bg-white/5 transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                member.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {member.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {member.email} · {member.phone}
            </p>
          </div>
        </div>

        <button
          onClick={() => setConfirmToggle(true)}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${
            member.isActive
              ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
              : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
          }`}
        >
          {toggling
            ? <span className="h-4 w-4 border border-current/30 border-t-current rounded-full animate-spin" />
            : <Power className="h-4 w-4" />
          }
          {member.isActive ? 'Desactivar' : 'Activar'}
        </button>
      </div>

      {/* Tarjetas resumen: red del miembro */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Hijos directos', value: member.hierarchy.directChildren, icon: Users, color: 'text-blue-400' },
          { label: 'Hijos indirectos', value: member.hierarchy.indirectChildren, icon: GitBranch, color: 'text-purple-400' },
          { label: 'Personales', value: member.hierarchy.personalRecruits, icon: UserPlus, color: 'text-amber-400' },
          { label: 'Estructura total', value: member.hierarchy.totalStructure, icon: Network, color: 'text-emerald-400' },
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

      {/* Jerarquía: padre y reclutador */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <HierarchyPersonCard
          label="Padre en la estructura"
          person={member.hierarchy.parent}
          emptyLabel="Sin padre asignado (raíz de su árbol)"
        />
        <HierarchyPersonCard
          label="Reclutador"
          person={member.hierarchy.recruiter}
          emptyLabel="Sin reclutador registrado"
        />
      </div>

      {/* Información editable (key por id: resetea el formulario al navegar entre miembros) */}
      <InfoSection key={member.id} member={member} onSaved={handleSaved} />
    </div>
  )
}
