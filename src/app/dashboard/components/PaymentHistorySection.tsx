import React from 'react';
import { CreditCard } from 'lucide-react';

interface Payment {
  id: number;
  date: string;
  amount: number;
  status: string;
  type: string;
}


const PaymentHistorySection = () => {
  const recentPayments: Payment[] = [
    { id: 1, date: '2025-01-15', amount: 150000, status: 'Completado', type: 'Activación Mensual' },
    { id: 2, date: '2024-12-15', amount: 150000, status: 'Completado', type: 'Activación Mensual' },
    { id: 3, date: '2024-11-15', amount: 150000, status: 'Completado', type: 'Activación Mensual' },
    { id: 4, date: '2024-10-15', amount: 150000, status: 'Completado', type: 'Activación Mensual' },
    { id: 5, date: '2024-09-15', amount: 150000, status: 'Completado', type: 'Activación Mensual' },
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
          {recentPayments.map((payment: Payment) => (
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
  );
};

export default PaymentHistorySection;
