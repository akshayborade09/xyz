'use client';

import { Server } from 'lucide-react';
import { type MKSCluster, availableNodeFlavors } from '@/lib/mks-data';

interface CostEstimationProps {
  cluster: MKSCluster;
}

export function CostEstimation({ cluster }: CostEstimationProps) {
  // Mock pricing data in Indian Rupees (in a real implementation, this would come from pricing API)
  const pricing = {
    controlPlane: {
      perHour: 41.5, // ₹41.50 per hour
      perMonth: 41.5 * 24 * 30, // ₹29,880 per month
    },
    nodePools: {
      't3.medium': { perHour: 3.45, perMonth: 2490.0 },
      't3.large': { perHour: 6.91, perMonth: 4980.0 },
      'm5.large': { perHour: 7.97, perMonth: 5738.88 },
      'm5.xlarge': { perHour: 15.94, perMonth: 11477.92 },
      'c5.large': { perHour: 7.06, perMonth: 5079.6 },
      'c5.xlarge': { perHour: 14.11, perMonth: 10159.2 },
      'r5.large': { perHour: 10.46, perMonth: 7529.76 },
      'r5.xlarge': { perHour: 20.92, perMonth: 15059.52 },
    },
  };

  const calculateNodePoolCosts = () => {
    return cluster.nodePools.map(pool => {
      const flavorPricing =
        pricing.nodePools[pool.flavor as keyof typeof pricing.nodePools];
      if (!flavorPricing) {
        return { pool, cost: 0, monthlyCost: 0 };
      }

      const hourlyCost = flavorPricing.perHour * pool.desiredCount;
      const monthlyCost = flavorPricing.perMonth * pool.desiredCount;

      return {
        pool,
        cost: hourlyCost,
        monthlyCost,
      };
    });
  };

  const nodePoolCosts = calculateNodePoolCosts();
  const totalNodePoolCost = nodePoolCosts.reduce(
    (sum, item) => sum + item.cost,
    0
  );
  const totalNodePoolMonthlyCost = nodePoolCosts.reduce(
    (sum, item) => sum + item.monthlyCost,
    0
  );

  const totalHourlyCost = pricing.controlPlane.perHour + totalNodePoolCost;
  const totalMonthlyCost =
    pricing.controlPlane.perMonth + totalNodePoolMonthlyCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId);
  };

  return (
    <div className='bg-card text-card-foreground border-border border rounded-lg'>
      <div className='p-6 pb-4'>
        <h3 className='text-lg font-semibold'>Cost Estimation</h3>
      </div>
      <div className='px-6 pb-6 space-y-4'>
        {/* Total Cost Display */}
        <div className='text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200'>
          <div className='text-2xl font-bold text-blue-600'>
            {formatCurrency(totalMonthlyCost)}
          </div>
          <div className='text-sm text-muted-foreground'>per month</div>
          <div className='text-lg font-semibold text-gray-700 mt-1'>
            {formatCurrency(totalHourlyCost)}/hr
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className='space-y-3'>
          <h4 className='font-medium text-sm'>Cost Breakdown</h4>

          {/* Control Plane */}
          <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
            <div className='flex items-center gap-2'>
              <Server className='h-4 w-4 text-blue-600' />
              <span className='text-sm font-medium'>Control Plane</span>
            </div>
            <div className='text-right'>
              <div className='text-sm font-medium'>
                {formatCurrency(pricing.controlPlane.perMonth)}/mo
              </div>
              <div className='text-xs text-muted-foreground'>
                {formatCurrency(pricing.controlPlane.perHour)}/hr
              </div>
            </div>
          </div>

          {/* Node Pools */}
          {nodePoolCosts.map(item => {
            const flavorDetails = getFlavorDetails(item.pool.flavor);
            return (
              <div
                key={item.pool.id}
                className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
              >
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <div>
                    <span className='text-sm font-medium'>
                      {item.pool.name}
                    </span>
                    <div className='text-xs text-muted-foreground'>
                      {item.pool.desiredCount} × {item.pool.flavor}
                      {flavorDetails && (
                        <span className='ml-1'>
                          ({flavorDetails.vcpus}vCPU, {flavorDetails.memory}GB)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>
                    {formatCurrency(item.monthlyCost)}/mo
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {formatCurrency(item.cost)}/hr
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
