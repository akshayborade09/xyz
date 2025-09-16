'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { VercelTabs } from '@/components/ui/vercel-tabs';

// Tab content components
function GpuClustersSection() {
  return (
    <div className='rounded-lg border border-dashed p-10 text-center'>
      <h3 className='text-lg font-medium'>GPU Clusters</h3>
      <p className='text-sm text-muted-foreground mt-1'>
        Manage your GPU-accelerated HPC clusters and resources
      </p>
    </div>
  );
}

function CpuClustersSection() {
  return (
    <div className='rounded-lg border border-dashed p-10 text-center'>
      <h3 className='text-lg font-medium'>CPU Clusters</h3>
      <p className='text-sm text-muted-foreground mt-1'>
        Manage your CPU-based HPC clusters and resources
      </p>
    </div>
  );
}

function MyClustersSection() {
  return (
    <div className='rounded-lg border border-dashed p-10 text-center'>
      <h3 className='text-lg font-medium'>My Clusters</h3>
      <p className='text-sm text-muted-foreground mt-1'>
        View and manage all your HPC clusters in one place
      </p>
    </div>
  );
}

const tabs = [
  { id: 'gpu-clusters', label: 'GPU Clusters' },
  { id: 'cpu-clusters', label: 'CPU Clusters' },
  { id: 'my-clusters', label: 'My Clusters' },
];

export default function HPCPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/gpu-clusters')) {
      return 'gpu-clusters';
    }
    if (pathname.includes('/cpu-clusters')) {
      return 'cpu-clusters';
    }
    if (pathname.includes('/my-clusters')) {
      return 'my-clusters';
    }
    return 'gpu-clusters'; // default to gpu-clusters
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
      case 'gpu-clusters':
        return {
          title: 'GPU Clusters',
          description: 'Manage your GPU-accelerated HPC clusters',
        };
      case 'cpu-clusters':
        return {
          title: 'CPU Clusters',
          description: 'Manage your CPU-based HPC clusters',
        };
      case 'my-clusters':
        return {
          title: 'My Clusters',
          description: 'View and manage your HPC clusters',
        };
      default:
        return {
          title: 'High Performance Computing',
          description: 'Manage your HPC clusters and resources',
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <PageLayout title={title} description={description}>
      <div className='space-y-6'>
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size='lg'
        />

        {activeTab === 'gpu-clusters' && <GpuClustersSection />}
        {activeTab === 'cpu-clusters' && <CpuClustersSection />}
        {activeTab === 'my-clusters' && <MyClustersSection />}
      </div>
    </PageLayout>
  );
}
