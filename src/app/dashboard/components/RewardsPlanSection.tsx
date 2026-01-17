import React, { useEffect, useState } from 'react';
import CircleMetric from './CircleMetric';
import { getRewardsCount } from '@/app/core/services/user-service'
import { useAuth } from '@/app/core/contexts/auth-context';
import { RewardsCount } from '@/app/core/types/user';

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
      const rewards: RewardsCount = await getRewardsCount(user?.id || 0)
      console.log(rewards)
      setRewardsAvailable(rewards.rewardsAvailable)
      setAccumulatedRewards(rewards.accumulatedRewards)
      setRewardsDelivered(rewards.rewardsDelivered)
    }

    init()
  })

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 flex items-center">
        <span className='mr-3 sm:mr-6 md:mr-8 flex text-nowrap'>PLAN DE RECOMPENSAS</span>
        <div className='w-full h-[1px] bg-blue-200'></div>
      </h3>

      <div className="flex flex-wrap gap-4 sm:gap-8 md:gap-12 lg:gap-16 justify-center items-end">
        <CircleMetric
          label="Recompensas DISPONIBLES"
          value={formatCurrency(rewardsAvailable)}
        />
        <CircleMetric
          label="ACUMULADO"
          value={formatCurrency(accumulatedRewards)}
        />
        <CircleMetric
          label="RETIRADO"
          value={formatCurrency(rewardsDelivered)}
        />
      </div>
    </div>
  );
};

export default RewardsPlanSection;
