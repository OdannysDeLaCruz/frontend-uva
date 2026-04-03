'use client';

import React, { useEffect, useState } from 'react';
import { getPaymentHistory, PaymentHistoryItem } from '@/app/core/services/payments-service';

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  APPROVED:  { label: 'Aprobado',   className: 'text-green-400' },
  PENDING:   { label: 'Pendiente',  className: 'text-yellow-400' },
  DECLINED:  { label: 'Rechazado',  className: 'text-red-400' },
  CANCELLED: { label: 'Cancelado',  className: 'text-gray-400' },
  EXPIRED:   { label: 'Expirado',   className: 'text-gray-400' },
};

const GATEWAY_LABEL: Record<string, string> = {
  BOLD:   'Bold',
  WOMPI:  'Wompi',
  MANUAL: 'Manual',
};

const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const PaymentHistoryTab: React.FC = () => {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPaymentHistory()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Cargando historial...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="text-gray-400 text-sm">No tienes pagos registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-sky-400/30 text-sky-300 text-xs uppercase">
            <th className="py-2 pr-4">Fecha</th>
            <th className="py-2 pr-4">Membresía</th>
            <th className="py-2 pr-4">Pasarela</th>
            <th className="py-2 pr-4 text-right">Base</th>
            <th className="py-2 pr-4 text-right">IVA</th>
            <th className="py-2 pr-4 text-right">Total</th>
            <th className="py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = STATUS_LABEL[item.status] ?? { label: item.status, className: 'text-gray-400' };
            return (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4 text-gray-300 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                <td className="py-2 pr-4 text-white">{item.membershipName}</td>
                <td className="py-2 pr-4 text-gray-300">{GATEWAY_LABEL[item.gateway] ?? item.gateway}</td>
                <td className="py-2 pr-4 text-right text-gray-300">
                  {item.baseAmount != null ? formatCOP(item.baseAmount) : '—'}
                </td>
                <td className="py-2 pr-4 text-right text-gray-300">
                  {item.taxAmount != null ? formatCOP(item.taxAmount) : '—'}
                </td>
                <td className="py-2 pr-4 text-right text-white font-semibold">{formatCOP(item.amount)}</td>
                <td className={`py-2 font-medium ${status.className}`}>{status.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryTab;
