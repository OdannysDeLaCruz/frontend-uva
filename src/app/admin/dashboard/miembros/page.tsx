"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users } from 'lucide-react'
import {
  adminGetMembers,
  type AdminMemberListItem
} from '@/app/core/services/admin-service'

type FilterStatus = 'all' | 'active' | 'inactive'

export default function AdminMiembrosPage() {
  const router = useRouter()
  const [members, setMembers] = useState<AdminMemberListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetMembers()
      setMembers(data)
    } catch {
      showToast('Error al cargar miembros', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredMembers = members.filter(m => {
    const query = search.toLowerCase()
    const matchesSearch =
      m.name.toLowerCase().includes(query) ||
      m.lastname.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.doc_number.toLowerCase().includes(query) ||
      m.referralCode.toLowerCase().includes(query)
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && m.isActive) ||
      (filterStatus === 'inactive' && !m.isActive)
    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-2xl font-bold text-white">Miembros</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {members.length} miembro(s) registrado(s) · {members.filter(m => m.isActive).length} activo(s)
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo, documento o código de referido..."
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
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Sin resultados</p>
            <p className="text-xs mt-1">Intenta cambiar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Cabecera - solo desktop */}
            <div className="hidden md:grid grid-cols-[1.3fr_1fr_1fr_1fr_auto_auto] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span>Miembro</span>
              <span>Documento</span>
              <span>Contacto</span>
              <span>Membresía</span>
              <span>Estado</span>
              <span />
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredMembers.map(m => {
                const fullName = `${m.name} ${m.lastname}`
                return (
                  <div key={m.id} className="px-4 md:px-6 py-4 hover:bg-white/2 transition-colors">

                    {/* Mobile */}
                    <div className="flex items-center gap-3 md:hidden">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => router.push(`/admin/dashboard/miembros/${m.id}`)}
                            className="text-sm font-semibold text-white truncate hover:text-purple-300 transition-colors text-left"
                          >
                            {fullName}
                          </button>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${m.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                            {m.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {m.email} · {m.doc_type} {m.doc_number}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/admin/dashboard/miembros/${m.id}`)}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-all"
                      >
                        Ver detalle
                      </button>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[1.3fr_1fr_1fr_1fr_auto_auto] gap-4 items-center">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: 'var(--gradient-primary)' }}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => router.push(`/admin/dashboard/miembros/${m.id}`)}
                            className="text-sm font-semibold text-white hover:text-purple-300 transition-colors text-left block max-w-full truncate"
                          >
                            {fullName}
                          </button>
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                            @{m.username}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-white/80 truncate">{m.doc_type} {m.doc_number}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-white/80 truncate">{m.email}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{m.phone}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-white/80 truncate">{m.membership?.name || 'Sin membresía'}</p>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        m.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {m.isActive ? 'Activo' : 'Inactivo'}
                      </span>

                      <button
                        onClick={() => router.push(`/admin/dashboard/miembros/${m.id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-all"
                      >
                        Ver detalle
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
