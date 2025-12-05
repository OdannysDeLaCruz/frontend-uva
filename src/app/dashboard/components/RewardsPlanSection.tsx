import React from 'react';
import CircleMetric from './CircleMetric';

const RewardsPlanSection: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full">
      <h3 className="text-3xl text-white mb-6 flex items-center">
        <span className='mr-8 flex text-nowrap'>PLAN DE RECOMPENSAS</span>
        <div className='w-full h-[1px] bg-blue-200'></div>
      </h3>

      <div className="flex gap-22 justify-center items-end">
        <CircleMetric
          label="Recompensas DISPONIBLES"
          value={formatCurrency(430000)}
        />
        <CircleMetric
          label="ACUMULADO"
          value={formatCurrency(570000)}
        />
        <CircleMetric
          label="ENTREGADO"
          value={formatCurrency(290000)}
        />
      </div>
    </div>
  );
};

export default RewardsPlanSection;
