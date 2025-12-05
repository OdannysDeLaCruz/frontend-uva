import React from 'react';
import { useAuth } from '@/app/core/contexts/auth-context';
import WelcomeSection from '../WelcomeSection';
import MembershipSection from '../MembershipSection';
import RewardsPlanSection from '../RewardsPlanSection';
import ReferralMarketingSection from '../ReferralMarketingSection';
// import PaymentHistorySection from '../PaymentHistorySection';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="">
      <div className='mb-3'>
        <WelcomeSection userName={user?.name} />
      </div>

      <MembershipSection
        monthlyContribution={60000}
        nextContributionDate="2025-11-27"
        membershipStatus="Activa"
      />

      {/* Métricas principales */}
      <div className="mb-10 mt-5">
        <h2 className="text-4xl font-semibold text-sky-200 b-6 flex items-center mb-4">
          TABLERO
        </h2>

        <div className='mb-10'>
          <RewardsPlanSection />
        </div>

        <div className='mb-10'>
          <ReferralMarketingSection />
        </div>
      </div>

      {/* <PaymentHistorySection /> */}
    </div>
  );
};

export default Dashboard;