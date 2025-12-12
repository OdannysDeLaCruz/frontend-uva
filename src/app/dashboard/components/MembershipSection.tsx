import React from 'react';

interface MembershipSectionProps {
  monthlyContribution?: number;
  nextContributionDate?: string;
  isActive?: boolean;
}

const MembershipSection: React.FC<MembershipSectionProps> = ({
  monthlyContribution = 60000,
  nextContributionDate = '2025-11-27',
  isActive = true,
}) => {
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
      day: 'numeric',
    });
  };

  const statusColor = isActive ? 'bg-green-600' : 'bg-red-600';
  const statusIcon = isActive ? '😎' : '😞'

  return (
    <div className="flex gap-3 justify-end">
      {/* Aporte Mensual */}
      <div className="flex flex-col justify-between">
        <p className="text-white text-xl font-bold leading-none">Aporte Mensual</p>
        <p className="text-white text-3xl font-bold leading-none">
          {formatCurrency(monthlyContribution)}
        </p>
      </div>

      {/* Próximo Aporte */}
      <div className="flex flex-col justify-between">
        <p className="text-white text-xl font-bold leading-none">Próximo Aporte</p>
        <p className="text-white text-3xl font-bold leading-none">
          {formatDate(nextContributionDate)}
        </p>
      </div>

      {/* Estado de Membresía */}
      <div className="flex flex-row items-end">
        <p className="text-white text-3xl font-bold mr-2 leading-none">{statusIcon}</p>
        <div className={`items-center px-3 py-1 leading-none border border-white uppercase text-white rounded-md ${statusColor}`}>
          {isActive ? 'Activa' : 'Inactiva'}
        </div>
      </div>
    </div>
  );
};

export default MembershipSection;
