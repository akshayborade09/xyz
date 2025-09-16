'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { LoadBalancerConfigurationModal } from './components/load-balancer-configuration-modal';
import { ALBCreateForm } from './components/alb-create-form';
import { NLBCreateForm } from './components/nlb-create-form';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export type LoadBalancerConfiguration = {
  loadBalancerType: 'ALB' | 'NLB' | '';
};

export default function CreateLoadBalancerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState<LoadBalancerConfiguration>({
    loadBalancerType: '',
  });

  // Show modal on page load if no configuration is set
  useEffect(() => {
    if (!config.loadBalancerType) {
      setShowModal(true);
    }
  }, []);

  const handleConfigurationComplete = (
    configuration: LoadBalancerConfiguration
  ) => {
    setConfig(configuration);
    setShowModal(false);
  };

  const handleModalClose = () => {
    // If modal is closed without selection, go back to list
    router.push('/networking/load-balancing/balancer');
  };

  const handleBack = () => {
    // Reset configuration and show modal again
    setConfig({ loadBalancerType: '' });
    setShowModal(true);
  };

  // Show modal if configuration is not complete
  if (showModal || !config.loadBalancerType) {
    return (
      <PageLayout
        title='Create Load Balancer'
        description='Choose your load balancer configuration to get started'
      >
        <LoadBalancerConfigurationModal
          isOpen={showModal}
          onComplete={handleConfigurationComplete}
          onClose={handleModalClose}
        />
      </PageLayout>
    );
  }

  // Show appropriate form based on configuration
  if (config.loadBalancerType === 'ALB') {
    return (
      <ALBCreateForm
        config={config}
        onBack={handleBack}
        onCancel={() => router.push('/networking/load-balancing/balancer')}
      />
    );
  }

  // Show NLB form
  if (config.loadBalancerType === 'NLB') {
    return (
      <NLBCreateForm
        config={config}
        onBack={handleBack}
        onCancel={() => router.push('/networking/load-balancing/balancer')}
      />
    );
  }

  // Default fallback
  return (
    <PageLayout
      title='Create Load Balancer'
      description='Please select a load balancer type to continue'
    >
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Button onClick={handleBack}>Select Load Balancer Type</Button>
        </div>
      </div>
    </PageLayout>
  );
}
