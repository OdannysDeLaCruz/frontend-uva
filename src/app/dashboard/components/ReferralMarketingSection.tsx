import React from 'react';
import CircleMetric from './CircleMetric';


const ReferralMarketingSection: React.FC = () => {
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
        <span className='mr-8 flex text-nowrap'>MARKETING DE REFERIDOS</span>
        <div className='w-full h-[1px] bg-blue-200'></div>
      </h3>

      <div className="flex gap-22 justify-center items-end">
        <CircleMetric
          label="DIRECTOS"
          value={formatCurrency(17)}
        />
        <CircleMetric
          label="ESTRUCTURA"
          value={formatCurrency(140)}
        />
        <CircleMetric
          label="TANQUE"
          value={formatCurrency(3)}
        />
      </div>
    </div>
  );
};

export default ReferralMarketingSection;
