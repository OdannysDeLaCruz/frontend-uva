"use client"

import { useEffect, useState } from 'react'
import { Store, Gift, TrendingUp, Activity } from 'lucide-react'
import { adminGetComercios, adminGetBenefits, type AdminComercio, type AdminBenefit } from '@/app/core/services/admin-service'
import { useAdminAuth } from '../context/admin-auth-context'

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth()
  const [comercios, setComercios] = useState<AdminComercio[]>([])
  const [benefits, setBenefits] = useState<AdminBenefit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminGetComercios(), adminGetBenefits()])
      .then(([c, b]) => {
        setComercios(c)
        setBenefits(b)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const activeComerciosCount = comercios.filter(c => c.isActive).length
  const inactiveComerciosCount = comercios.filter(c => !c.isActive).length
  const activeBenefitsCount = benefits.filter(b => b.isActive).length

  const stats = [
    {
      label: 'Total Comercios',
      value: loading ? '—' : comercios.length,
      sub: `${activeComerciosCount} activos`,
      icon: Store,
      color: 'from-purple-500 to-purple-700'
    },
    {
      label: 'Comercios Activos',
      value: loading ? '—' : activeComerciosCount,
      sub: `${inactiveComerciosCount} inactivos`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-700'
    },
    {
      label: 'Total Beneficios',
      value: loading ? '—' : benefits.length,
      sub: `${activeBenefitsCount} activos`,
      icon: Gift,
      color: 'from-amber-500 to-amber-700'
    },
    {
      label: 'Estado del Sistema',
      value: 'Operativo',
      sub: 'Sin incidencias',
      icon: Activity,
      color: 'from-cyan-500 to-cyan-700'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Bienvenido, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Panel de administración UVA · Visión general del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 flex items-start gap-4 border transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm font-medium text-white/80 mt-0.5">{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent comercios */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold text-white">Comercios recientes</h2>
          <a
            href="/admin/dashboard/comercios"
            className="text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            Ver todos →
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : comercios.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <Store className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay comercios registrados</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {comercios.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {c.email || 'Sin correo'} · {c.benefits?.length ?? 0} beneficio(s)
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    c.isActive
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {c.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
