'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MaintenanceBannerProps {
  className?: string;
}

export function MaintenanceBanner({ className }: MaintenanceBannerProps) {
  return (
    <Alert
      className={`mb-4 border-0 ${className}`}
      style={{
        boxShadow: 'rgba(255, 171, 0, 0.1) 0px 0px 0px 1px inset',
        background:
          'linear-gradient(263deg, rgba(255, 171, 0, 0.08) 6.86%, rgba(255, 171, 0, 0.02) 96.69%)',
      }}
    >
      <div className='flex items-start space-x-3'>
        <AlertTriangle
          className='h-5 w-5 mt-0.5 flex-shrink-0'
          style={{ color: 'rgb(217, 119, 6)' }}
        />
        <div>
          <AlertDescription style={{ color: 'rgb(217, 119, 6)' }}>
            <p className='text-sm font-medium mb-1'>
              <strong>Scheduled Maintenance Notice:</strong>
            </p>
            <p className='text-sm'>
              Our platform will undergo planned maintenance on{' '}
              <span className='font-semibold'>
                Friday, August 22, 2025, from 6:00 AM IST to 8:00 AM IST
              </span>
              , during which services may be temporarily unavailable.
            </p>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
