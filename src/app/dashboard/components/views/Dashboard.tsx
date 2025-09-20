import React from 'react';
import { DollarSign, PiggyBank, Users, UserPlus, Clock, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/app/core/contexts/auth-context';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - En producción esto vendría de una API
  const metrics = {
    commissions: 2450000,
    savings: 8750000,
    directAffiliates: 12,
    totalAffiliates: 156,
    tankAffiliates: 8,
  };

  const recentPayments = [
    { id: 1, date: '2025-01-15', amount: 150000, status: 'Completado', type: 'Membresía Mensual' },
    { id: 2, date: '2024-12-15', amount: 150000, status: 'Completado', type: 'Membresía Mensual' },
    { id: 3, date: '2024-11-15', amount: 150000, status: 'Completado', type: 'Membresía Mensual' },
    { id: 4, date: '2024-10-15', amount: 150000, status: 'Completado', type: 'Membresía Mensual' },
    { id: 5, date: '2024-09-15', amount: 150000, status: 'Completado', type: 'Membresía Mensual' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Mensaje de bienvenida */}
      <div className="glass p-6 rounded-xl border border-white/10 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ¡Hola, {user?.name}! 👋
            </h1>
            <p className="text-purple-200 text-lg">
              Bienvenido de vuelta a tu dashboard de UVA. Aquí tienes un resumen de tu actividad.
            </p>
          </div>
          <div className="text-sm text-purple-200">
            Última actualización: <span className="font-medium text-white">Hoy, {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-yellow-400" />
          Métricas Financieras
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Comisiones */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Comisiones Totales</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(metrics.commissions)}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% este mes
              </p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Ahorros */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Ahorros en UVA</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(metrics.savings)}</p>
              <p className="text-blue-400 text-sm mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% este mes
              </p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <PiggyBank className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Afiliados Directos */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Afiliados Directos</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.directAffiliates}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <UserPlus className="h-4 w-4 mr-1" />
                +2 este mes
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Segunda fila de métricas */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2 text-purple-400" />
          Red de Afiliados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Afiliados */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Total Afiliados</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.totalAffiliates}</p>
              <p className="text-purple-400 text-sm mt-2">En toda tu red</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Afiliados en Tanque */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">En Tanque</p>
              <p className="text-2xl font-bold text-white mt-1">{metrics.tankAffiliates}</p>
              <p className="text-orange-400 text-sm mt-2">Esperando asignación</p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Próximo pago */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Próximo Pago</p>
              <p className="text-2xl font-bold text-white mt-1">15 Feb</p>
              <p className="text-yellow-400 text-sm mt-2">{formatCurrency(150000)}</p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="mb-10">
        <div className="glass p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Historial de Pagos de Membresía
          </h3>
          <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors">
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CreditCard className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{payment.type}</p>
                  <p className="text-purple-200 text-sm">{formatDate(payment.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{formatCurrency(payment.amount)}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;