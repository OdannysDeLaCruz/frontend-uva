import React, { useEffect, useState } from 'react';
import CircleMetric from './CircleMetric';
import { getRewardsCount } from '@/app/core/services/user-service'
import { useAuth } from '@/app/core/contexts/auth-context';

const RewardsPlanSection: React.FC = () => {
  const [rewardsAvailable, setRewardsAvailable] = useState(0)
  const [accumulatedRewards, setAccumulatedRewards] = useState(0)
  const [rewardsDelivered, setRewardsDelivered] = useState(0)

  const { user } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  
  useEffect(() => {
    const init = async () => {
      const rewards = await getRewardsCount(user?.id || 0)
      console.log(rewards)
      setRewardsAvailable(rewards.rewardsAvailable)
      setAccumulatedRewards(rewards.accumulatedRewards)
      setRewardsDelivered(rewards.rewardsDelivered)
    }

    init()
  })

  return (
    <div className="w-full">
      <h3 className="text-3xl text-white mb-6 flex items-center">
        <span className='mr-8 flex text-nowrap'>PLAN DE RECOMPENSAS</span>
        <div className='w-full h-[1px] bg-blue-200'></div>
      </h3>

      <div className="flex gap-22 justify-center items-end">
        <CircleMetric
          label="Recompensas DISPONIBLES"
          value={formatCurrency(rewardsAvailable)}
        />
        <CircleMetric
          label="ACUMULADO"
          value={formatCurrency(accumulatedRewards)}
        />
        <CircleMetric
          label="ENTREGADO"
          value={formatCurrency(rewardsDelivered)}
        />
      </div>
    </div>
  );
};

export default RewardsPlanSection;
