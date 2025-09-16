'use client';

import { Badge } from '@/components/ui/badge';
import { type MKSCluster } from '@/lib/mks-data';

interface AddOnsSectionProps {
  cluster: MKSCluster;
  onUpdate?: (updatedCluster: MKSCluster) => void;
}

export function AddOnsSection({ cluster, onUpdate }: AddOnsSectionProps) {
  return (
    <div className='bg-card text-card-foreground border-border border rounded-lg'>
      <div className='p-6 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h3 className='text-lg font-semibold'>Add-ons</h3>
            <div className='bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center'>
              {cluster.addOns.filter(addon => addon.isEnabled).length}
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 pb-6 space-y-6'>
        {/* Add-ons */}
        <div className='grid grid-cols-2 gap-4'>
          {cluster.addOns.map(addon => (
            <div key={addon.id} className='p-4 border rounded-lg relative'>
              <Badge
                variant='outline'
                className='absolute top-3 right-3 text-xs font-medium'
              >
                {addon.version}
              </Badge>
              <div className='space-y-1 pr-16'>
                <div className='text-sm font-medium leading-none'>
                  {addon.displayName}
                </div>
                <p className='text-sm text-muted-foreground'>
                  {addon.description}
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <Badge
                    variant={addon.isEnabled ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {addon.isEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cluster.addOns.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>
            <p>No add-ons available for this cluster.</p>
          </div>
        )}
      </div>
    </div>
  );
}
