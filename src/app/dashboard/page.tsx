"use client"

import React from 'react';
import Layout from './components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import { useAuth } from '@/app/core/contexts/auth-context';
import WelcomeSection from '@/app/dashboard/components/WelcomeSection';
// import MembershipSection from '@/app/dashboard/components/MembershipSection';
import RewardsPlanSection from '@/app/dashboard/components/RewardsPlanSection';
import ReferralMarketingSection from '@/app/dashboard/components/ReferralMarketingSection';
// import PaymentHistorySection from '../PaymentHistorySection';

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      <Layout>
        <div className="px-2 sm:px-0">
          <div className='mb-8 sm:mb-12 md:mb-16'>
            <WelcomeSection userName={user?.name} />
          </div>

          {/* <MembershipSection
            monthlyContribution={65900}
            nextContributionDate="2025-11-27"
            isActive={user?.isActive}
          /> */}

          {/* Métricas principales */}
          <div className="mb-6 sm:mb-8 md:mb-10 mt-3 sm:mt-4 md:mt-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-sky-200 flex items-center mb-3 sm:mb-4">
              TABLERO
            </h2>

            <div className='mb-6 sm:mb-8 md:mb-10'>
              <RewardsPlanSection />
            </div>

            <div className='mb-6 sm:mb-8 md:mb-10'>
              <ReferralMarketingSection />
            </div>
          </div>

          {/* <PaymentHistorySection /> */}
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;