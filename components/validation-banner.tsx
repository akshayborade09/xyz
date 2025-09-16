'use client';

import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ValidationBannerProps {
  daysRemaining: number;
  onValidate: () => void;
}

export function ValidationBanner({
  daysRemaining,
  onValidate,
}: ValidationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <ExclamationTriangleIcon className='h-5 w-5 text-yellow-600' />
        </div>
        <div className='ml-3 flex-1'>
          <h3 className='text-sm font-medium text-yellow-800'>
            Customer Validation Required
          </h3>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>
              Your account requires validation. You have {daysRemaining} days
              remaining to complete the validation process.
            </p>
          </div>
          <div className='mt-4'>
            <div className='-mx-2 -my-1.5 flex'>
              <Button
                variant='outline'
                className='bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                onClick={onValidate}
              >
                Complete Validation
              </Button>
              <Button
                variant='ghost'
                className='ml-3 px-2 py-1.5 text-sm text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                onClick={() => setIsVisible(false)}
              >
                Dismiss
                <XMarkIcon className='ml-1 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
