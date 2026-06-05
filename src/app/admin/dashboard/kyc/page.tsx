"use client"

import { useEffect, useState, useCallback } from 'react'
import {
  ScanFace,
  Search,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldOff,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import {
  adminGetKycSubmissions,
  adminApproveKycDocument,
  adminRejectKycDocument,
  adminSetKycVerified,
  type KycUserSubmission,
  type KycDocument,
  type KycStatus,
  type KycDocumentType
} from '@/app/core/services/admin-service'
import { ApiError } from '@/app/core/utils/error-handler'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOC_LABELS: Record<KycDocumentType, string> = {
  NATIONAL_IDENTITY_CARD_FRONT: 'Cédula — Frente',
  NATIONAL_IDENTITY_CARD_BACK: 'Cédula — Reverso',
  NATIONAL_IDENTITY_CARD_SELFIE: 'Selfie'
}

const STATUS_CONFIG: Record<KycStatus, { label: string; cls: string }> = {
  PENDING: { label: 'Pendiente', cls: 'bg-yellow-500/15 text-yellow-400' },
  IN_REVIEW: { label: 'En revisión', cls: 'bg-blue-500/15 text-blue-400' },
  APPROVED: { label: 'Aprobado', cls: 'bg-green-500/15 text-green-400' },
  REJECTED: { label: 'Rechazado', cls: 'bg-red-500/15 text-red-400' },
  EXPIRED: { label: 'Expirado', cls: 'bg-white/10 text-white/40' }
}

function hasPending(user: KycUserSubmission) {
  return user.kycVerifications.some(d => d.status === 'IN_REVIEW' || d.status === 'PENDING')
}

function overallStatus(user: KycUserSubmission): 'pending' | 'approved' | 'partial' | 'rejected' {
  const docs = user.kycVerifications
  if (docs.length === 0) return 'pending'
  if (docs.every(d => d.status === 'APPROVED')) return 'approved'
  if (docs.some(d => d.status === 'REJECTED')) return 'rejected'
  if (docs.some(d => d.status === 'IN_REVIEW' || d.status === 'PENDING')) return 'pending'
  return 'partial'
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  onApprove,
  onReject
}: {
  doc: KycDocument
  onApprove: (id: number) => Promise<void>
  onReject: (id: number, reason: string) => Promise<void>
}) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState('')

  const handleApprove = async () => {
    setLoading('approve')
    try { await onApprove(doc.id) } finally { setLoading(null) }
  }

  const handleReject = async () => {
    if (!reason.trim()) return
    setLoading('reject')
    try {
      await onReject(doc.id, reason.trim())
      setShowRejectForm(false)
      setReason('')
    } finally { setLoading(null) }
  }

  const cfg = STATUS_CONFIG[doc.status]
  const canAct = doc.status === 'IN_REVIEW' || doc.status === 'PENDING'

  return (
    <div
      className="rounded-xl border flex flex-col gap-3 p-4"
      style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white/70">{DOC_LABELS[doc.document_type]}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>
      </div>

      {/* Image */}
      <a
        href={doc.document_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-lg overflow-hidden border aspect-video"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={doc.document_url}
          alt={DOC_LABELS[doc.document_type]}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <ExternalLink className="h-5 w-5 text-white" />
        </div>
      </a>

      {/* Rejection reason if rejected */}
      {doc.status === 'REJECTED' && doc.rejection_reason && (
        <p className="text-xs text-red-400/80 bg-red-500/10 rounded-lg px-3 py-2">
          {doc.rejection_reason}
        </p>
      )}

      {/* Actions */}
      {canAct && !showRejectForm && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-green-600/80 hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {loading === 'approve'
              ? <span className="h-3 w-3 border border-white/40 border-t-white rounded-full animate-spin" />
              : <Check className="h-3 w-3" />}
            Aprobar
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={loading !== null}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-red-600/70 hover:bg-red-600/90 transition-all disabled:opacity-50"
          >
            <X className="h-3 w-3" />
            Rechazar
          </button>
        </div>
      )}

      {/* Reject form */}
      {canAct && showRejectForm && (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Motivo del rechazo..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-white/30 border resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowRejectForm(false); setReason('') }}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleReject}
              disabled={!reason.trim() || loading !== null}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600/70 hover:bg-red-600/90 transition-all disabled:opacity-50"
            >
              {loading === 'reject'
                ? <span className="h-3 w-3 border border-white/40 border-t-white rounded-full animate-spin" />
                : <X className="h-3 w-3" />}
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── User Row / Accordion ─────────────────────────────────────────────────────

function UserKycRow({
  user,
  onUpdate
}: {
  user: KycUserSubmission
  onUpdate: (userId: number, updatedDoc?: KycDocument, newKycVerified?: boolean) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [togglingKyc, setTogglingKyc] = useState(false)

  const handleApprove = async (docId: number) => {
    const updated = await adminApproveKycDocument(docId)
    onUpdate(user.id, updated)
  }

  const handleReject = async (docId: number, reason: string) => {
    const updated = await adminRejectKycDocument(docId, reason)
    onUpdate(user.id, updated)
  }

  const handleToggleKycVerified = async () => {
    setTogglingKyc(true)
    try {
      const result = await adminSetKycVerified(user.id, !user.kycVerified)
      onUpdate(user.id, undefined, result.kycVerified)
    } finally {
      setTogglingKyc(false)
    }
  }

  const overall = overallStatus(user)
  const overallCfg = {
    pending: { label: 'Pendiente', cls: 'bg-yellow-500/15 text-yellow-400', icon: Clock },
    approved: { label: 'Todo aprobado', cls: 'bg-green-500/15 text-green-400', icon: Check },
    partial: { label: 'Parcial', cls: 'bg-blue-500/15 text-blue-400', icon: AlertCircle },
    rejected: { label: 'Con rechazos', cls: 'bg-red-500/15 text-red-400', icon: X }
  }[overall]
  const OverallIcon = overallCfg.icon

  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 md:px-6 py-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user.name} {user.lastname}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {user.email} · {user.doc_number}
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${overallCfg.cls}`}>
            <OverallIcon className="h-3 w-3" />
            {overallCfg.label}
          </span>
          {user.kycVerified && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-500/15 text-purple-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              KYC OK
            </span>
          )}
        </div>

        {/* Expand icon */}
        <div className="shrink-0 ml-1 text-white/30">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 md:px-6 pb-5 pt-1 space-y-4">
          {/* Documents grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {user.kycVerifications.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>

          {/* KYC Verified toggle */}
          <div
            className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border"
            style={{ background: 'var(--surface-light)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              {user.kycVerified
                ? <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
                : <ShieldOff className="h-4 w-4 text-white/30 shrink-0" />}
              <div>
                <p className="text-sm font-medium text-white">KYC Verificado</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {user.kycVerified ? 'El miembro está marcado como verificado' : 'El miembro no está verificado aún'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleKycVerified}
              disabled={togglingKyc}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                user.kycVerified ? 'bg-purple-600' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user.kycVerified ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

type FilterTab = 'all' | 'pending' | 'verified'

export default function AdminKycPage() {
  const [users, setUsers] = useState<KycUserSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('pending')
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetKycSubmissions()
      setUsers(data)
    } catch {
      showToast('Error al cargar solicitudes KYC', 'err')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpdate = (userId: number, updatedDoc?: KycDocument, newKycVerified?: boolean) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u
      const next = { ...u }
      if (updatedDoc) {
        next.kycVerifications = u.kycVerifications.map(d =>
          d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d
        )
      }
      if (newKycVerified !== undefined) {
        next.kycVerified = newKycVerified
        showToast(newKycVerified ? 'KYC verificado' : 'KYC removido', 'ok')
      }
      return next
    }))
  }

  const filtered = users.filter(u => {
    const matchSearch =
      `${u.name} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.doc_number.toLowerCase().includes(search.toLowerCase())

    const matchTab =
      tab === 'all' ||
      (tab === 'pending' && hasPending(u)) ||
      (tab === 'verified' && u.kycVerified)

    return matchSearch && matchTab
  })

  const pendingCount = users.filter(hasPending).length

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
      <div>
        <h1 className="text-2xl font-bold text-white">Verificación KYC</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {users.length} miembro(s) con documentos enviados
          {pendingCount > 0 && (
            <span className="ml-2 text-yellow-400">· {pendingCount} pendiente(s)</span>
          )}
        </p>
      </div>

      {/* Filters */}
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
          {([
            { key: 'pending', label: 'Pendientes' },
            { key: 'all', label: 'Todos' },
            { key: 'verified', label: 'Verificados' }
          ] as { key: FilterTab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.key ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              style={tab === t.key ? { background: 'var(--gradient-primary)' } : {}}
            >
              {t.label}
              {t.key === 'pending' && pendingCount > 0 && (
                <span className="ml-1 bg-yellow-500 text-black text-[10px] font-bold px-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <ScanFace className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Sin resultados</p>
            <p className="text-xs mt-1">
              {tab === 'pending'
                ? 'No hay documentos pendientes de revisión'
                : 'Cambia los filtros para ver más resultados'}
            </p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div
              className="hidden md:grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            >
              <span className="w-9" />
              <span>Miembro</span>
              <span>Estado</span>
            </div>

            {filtered.map(user => (
              <UserKycRow key={user.id} user={user} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
