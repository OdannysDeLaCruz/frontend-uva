import React, { useEffect, useState } from 'react';
import CircleMetric from './CircleMetric';
import { useAuth } from '@/app/core/contexts/auth-context';
import { getReferralMarketingCount } from '@/app/core/services/user-service';


const ReferralMarketingSection: React.FC = () => {
  const [directs, setDirects] = useState(0)
  const [structure, setStructure] = useState(0)
  const [tank, setTank] = useState(0)

  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      const referralMarketing = await getReferralMarketingCount(user?.id || 0)
      console.log(referralMarketing)
      setDirects(referralMarketing.direct)
      setStructure(referralMarketing.structure)
      setTank(referralMarketing.tanque)
    }
    init()
  })

  

  return (
    <div className="w-full">
      <h3 className="text-3xl text-white mb-6 flex items-center">
        <span className='mr-8 flex text-nowrap'>MARKETING DE REFERIDOS</span>
        <div className='w-full h-[1px] bg-blue-200'></div>
      </h3>

      <div className="flex gap-22 justify-center items-end">
        <CircleMetric
          label="DIRECTOS"
          value={directs}
        />
        <CircleMetric
          label="ESTRUCTURA"
          value={structure}
        />
        <CircleMetric
          label="TANQUE"
          value={tank}
        />
      </div>
    </div>
  );
};

export default ReferralMarketingSection;
