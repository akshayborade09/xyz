'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { CreateButton } from '@/components/create-button';

// Import the section components
import LoadBalancerSection from './components/load-balancer-section';
import TargetGroupsSection from './components/target-groups-section';

const tabs = [
  { id: 'load-balancer', label: 'Load Balancers' },
  { id: 'target-groups', label: 'Target Groups' },
];

export default function LoadBalancingPage() {
  const pathname = usePathname();

  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/balancer')) {
      return 'load-balancer';
    }
    if (pathname.includes('/target-groups')) {
      return 'target-groups';
    }
    return 'load-balancer'; // default to load-balancer
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Don't navigate - just change the local state
  };

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [pathname]);

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case 'load-balancer':
        return {
          title: 'Load Balancers',
          description:
            'Distribute incoming traffic across multiple targets to ensure high availability and fault tolerance for your applications.',
        };
      case 'target-groups':
        return {
          title: 'Target Groups',
          description:
            'Define health check settings and routing rules for your load balancers to ensure traffic is directed to healthy targets.',
        };
      default:
        return {
          title: 'Load Balancers',
          description: 'Manage your load balancing resources',
        };
    }
  };

  // Get dynamic button info based on active tab
  const getHeaderActions = () => {
    switch (activeTab) {
      case 'load-balancer':
        return (
          <CreateButton
            href='/networking/load-balancing/balancer/create'
            label='Create Load Balancer'
          />
        );
      case 'target-groups':
        return (
          <CreateButton
            href='/networking/load-balancing/target-groups/create'
            label='Create Target Group'
          />
        );
      default:
        return null;
    }
  };

  const { title, description } = getPageInfo();

  return (
    <PageLayout
      title={title}
      description={description}
      headerActions={getHeaderActions()}
    >
      <div className='space-y-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {activeTab === 'load-balancer' && <LoadBalancerSection />}
        {activeTab === 'target-groups' && <TargetGroupsSection />}
      </div>
    </PageLayout>
  );
}
