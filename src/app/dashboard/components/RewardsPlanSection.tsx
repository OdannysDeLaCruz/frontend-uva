import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CircleMetric from './CircleMetric';
import { getRewardsCount } from '@/app/core/services/user-service'
import { useAuth } from '@/app/core/contexts/auth-context';
import { RewardsCount } from '@/app/core/types/user';
import { Button } from '@/app/core/ui/button';

const RewardsPlanSection: React.FC = () => {
  const [rewardsAvailable, setRewardsAvailable] = useState(0)
  const [accumulatedRewards, setAccumulatedRewards] = useState(0)
  const [rewardsDelivered, setRewardsDelivered] = useState(0)

  const { user } = useAuth();
  const router = useRouter();

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

      <div className='w-fit m-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-orange-700 italic bg-orange-200 p-2 px-12 rounded-xl'>
        {/* Nota */}
        Nota: Datos del corte del mes actual
      </div>

      <div className='flex flex-col gap-4 items-center'>
        <div className="flex flex-wrap gap-4 sm:gap-8 md:gap-12 lg:gap-16 justify-center items-end">
          <CircleMetric
            label="ACUMULADO"
            value={formatCurrency(accumulatedRewards)}
          />
          <CircleMetric
            label="Desembolso en PROCESO"
            value={formatCurrency(rewardsAvailable)}
          />
          <CircleMetric
            label="ENTREGADO"
            value={formatCurrency(rewardsDelivered)}
          />
        </div>
        
        {/* Boton ver historico entregado completo */}
        <Button
          className="bg-green-700 text-white mt-8 cursor-pointer"
          onClick={() => router.push('/dashboard/recompensas')}
        >
          VER HISTORICO
        </Button>
      </div>

    </div>
  );
};

export default RewardsPlanSection;
