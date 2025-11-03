'use client';

import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';
import type { ALBFormData } from '../alb-create-form';

interface PoolSectionProps {
  formData: ALBFormData;
  updateFormData: (section: string, data: any) => void;
  isSection?: boolean;
  isEditMode?: boolean;
  loadBalancerType?: 'ALB' | 'NLB';
}

interface Pool {
  id: string;
  name: string;
  protocol: string;
  algorithm: string;
  targetGroup: string;
}

export function PoolSection({
  formData,
  updateFormData,
  isSection = false,
  isEditMode = false,
  loadBalancerType = 'ALB',
}: PoolSectionProps) {
  const [pools, setPools] = useState<Pool[]>(formData.pools);

  // Sync props to local state when they change
  useEffect(() => {
    setPools(formData.pools);
  }, [formData.pools]);

  const protocolOptions =
    loadBalancerType === 'NLB'
      ? [
          { value: 'HTTP', label: 'HTTP' },
          { value: 'TCP', label: 'TCP' },
        ]
      : [{ value: 'HTTP', label: 'HTTP' }];

  const algorithmOptions = [
    {
      value: 'round-robin',
      label: 'Round Robin',
      description:
        'Requests are distributed equally across all healthy targets',
    },
    {
      value: 'least-connections',
      label: 'Least Connections',
      description: 'Routes to the target with the fewest active connections',
    },
    {
      value: 'source-ip',
      label: 'Source IP',
      description: 'Routes based on a hash of the client IP address',
    },
  ];

  const targetGroupOptions = [
    {
      value: 'production-web-targets',
      label: 'production-web-targets',
      type: 'instance',
      protocol: 'HTTP',
      targets: 4,
      status: 'healthy',
    },
    {
      value: 'production-api-targets',
      label: 'production-api-targets',
      type: 'instance',
      protocol: 'HTTPS',
      targets: 2,
      status: 'healthy',
    },
    {
      value: 'api-gateway-targets',
      label: 'api-gateway-targets',
      type: 'instance',
      protocol: 'HTTP',
      targets: 2,
      status: 'healthy',
    },
    {
      value: 'staging-app-targets',
      label: 'staging-app-targets',
      type: 'instance',
      protocol: 'HTTP',
      targets: 2,
      status: 'healthy',
    },
    {
      value: 'database-targets',
      label: 'database-targets',
      type: 'instance',
      protocol: 'TCP',
      targets: 2,
      status: 'healthy',
    },
    {
      value: 'cache-targets',
      label: 'cache-targets',
      type: 'instance',
      protocol: 'TCP',
      targets: 2,
      status: 'healthy',
    },
  ];

  const updatePool = (id: string, field: string, value: string) => {
    setPools(
      pools.map(pool => (pool.id === id ? { ...pool, [field]: value } : pool))
    );
  };

  const getTargetGroupInfo = (targetGroupValue: string) => {
    return targetGroupOptions.find(tg => tg.value === targetGroupValue);
  };

  const isFormValid = () => {
    return pools.every(
      pool =>
        pool.name.trim().length > 0 &&
        pool.protocol.length > 0 &&
        pool.algorithm.length > 0 &&
        pool.targetGroup.length > 0
    );
  };

  useEffect(() => {
    updateFormData('pools', { pools });
  }, [pools]);

  return (
    <div className='space-y-6'>
      {pools.map((pool, index) => {
        const targetGroupInfo = getTargetGroupInfo(pool.targetGroup);

        return (
          <div key={pool.id} className='relative'>
            <div className='grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20'>
              {/* Pool Name */}
              <div>
                <Label className='block mb-2 font-medium'>
                  Pool Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  placeholder='e.g., web-pool, api-pool, backend-pool'
                  value={pool.name}
                  onChange={e => updatePool(pool.id, 'name', e.target.value)}
                  className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>

              {/* Protocol */}
              <div>
                <Label className='block mb-2 font-medium'>
                  Protocol <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={pool.protocol}
                  onValueChange={value =>
                    updatePool(pool.id, 'protocol', value)
                  }
                  disabled={isEditMode}
                >
                  <SelectTrigger
                    className={
                      isEditMode ? 'bg-muted text-muted-foreground' : ''
                    }
                  >
                    <SelectValue placeholder='Select protocol' />
                  </SelectTrigger>
                  <SelectContent>
                    {protocolOptions.map(protocol => (
                      <SelectItem key={protocol.value} value={protocol.value}>
                        {protocol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Load Balancer Algorithm */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='font-medium'>
                    Load Balancer Algorithm{' '}
                    <span className='text-destructive'>*</span>
                  </Label>
                  <TooltipWrapper
                    content='The algorithm determines how requests are distributed among healthy targets in the target group.'
                    side='top'
                  >
                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                  </TooltipWrapper>
                </div>
                <Select
                  value={pool.algorithm}
                  onValueChange={value =>
                    updatePool(pool.id, 'algorithm', value)
                  }
                >
                  <SelectTrigger className='text-left'>
                    <SelectValue placeholder='Select load balancing algorithm' />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithmOptions.map(algorithm => (
                      <SelectItem key={algorithm.value} value={algorithm.value}>
                        <div>
                          <div className='font-medium'>{algorithm.label}</div>
                          <div className='text-xs text-muted-foreground'>
                            {algorithm.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Group */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='font-medium'>
                    Target Group <span className='text-destructive'>*</span>
                  </Label>
                  <TooltipWrapper
                    content='Select the target group that contains the targets that will receive traffic from this pool.'
                    side='top'
                  >
                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                  </TooltipWrapper>
                </div>
                <Select
                  value={pool.targetGroup}
                  onValueChange={value =>
                    updatePool(pool.id, 'targetGroup', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select target group' />
                  </SelectTrigger>
                  <SelectContent>
                    {targetGroupOptions.map(targetGroup => (
                      <SelectItem
                        key={targetGroup.value}
                        value={targetGroup.value}
                      >
                        <div className='flex items-center justify-between w-full'>
                          <div>
                            <div className='font-medium'>
                              {targetGroup.label}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {targetGroup.type} • {targetGroup.protocol} •{' '}
                              {targetGroup.targets} targets
                            </div>
                          </div>
                          <div
                            className={`ml-2 h-2 w-2 rounded-full ${
                              targetGroup.status === 'healthy'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Target Group Info */}
                {targetGroupInfo && (
                  <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <div className='text-sm'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-medium'>
                          Target Group Details
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground space-y-1'>
                        <div>Type: {targetGroupInfo.type}</div>
                        <div>Protocol: {targetGroupInfo.protocol}</div>
                        <div>Targets: {targetGroupInfo.targets} targets</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Configuration Note */}
      <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
        <p className='text-sm text-green-700'>
          <strong>Best Practice:</strong> Existence of a Target Group is
          mandatory for creation of LB. A target group must consist of active
          VMs. You can have multiple listeners, each mapped to 1 target group
          each.
        </p>
      </div>
    </div>
  );
}
