import React, { useState } from 'react';

import ContributionsTab from '@/app/dashboard/membership/components/ContributionsTab';
import LinkReferralTab from '@/app/dashboard/membership/components/LinkReferralTab';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

const MembershipTabs: React.FC = () => {
  const tabs: Tab[] = [
    {
      id: 'contributions',
      label: 'APORTE',
      content: <ContributionsTab />
    },
    {
      id: 'history',
      label: 'HISTORIAL',
      content: <div></div>
    },
    {
      id: 'referral',
      label: 'ENLACES DE REFERIDO',
      content: <LinkReferralTab />
    }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-sky-400 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-1 transition-colors ${
              activeTab === tab.id
                ? 'text-sky-400 border border-sky-400 rounded-t-lg'
                : 'text-gray-300 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTabContent && (
          <div className="animate-fade-in">
            {activeTabContent.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipTabs;
