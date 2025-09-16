'use client';

import { Button } from '@/components/ui/button';
import { FileText, UserCheck, ShieldCheck } from 'lucide-react';

interface CustomerValidationScreenProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function CustomerValidationScreen({
  onBack,
  onNext,
  onSkip,
}: CustomerValidationScreenProps) {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-2'>Customer Validation</h2>
      <p className='text-gray-600 mb-8'>
        To comply with regulatory requirements, we need to verify your identity.
        Please choose one of the following options:
      </p>

      <div className='space-y-4 mb-8'>
        <div
          className='border rounded-lg p-6 hover:border-black hover:bg-gray-50 cursor-pointer transition-all'
          onClick={onNext}
        >
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 p-3 rounded-full'>
              <FileText className='h-6 w-6 text-black' />
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-1'>
                DigiLocker Verification
              </h3>
              <p className='text-gray-600'>
                Connect your DigiLocker account to verify your identity using
                your Aadhaar and PAN card. This is the fastest method.
              </p>
            </div>
          </div>
        </div>

        <div className='border rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all opacity-60'>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 p-3 rounded-full'>
              <UserCheck className='h-6 w-6 text-gray-600' />
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-1'>
                Manual KYC Verification
              </h3>
              <p className='text-gray-600'>
                Upload your identity documents manually. This method may take
                1-2 business days for verification.
              </p>
              <div className='mt-2 text-sm text-blue-600'>(Coming soon)</div>
            </div>
          </div>
        </div>

        <div className='border rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all opacity-60'>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 p-3 rounded-full'>
              <ShieldCheck className='h-6 w-6 text-gray-600' />
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-1'>Video KYC</h3>
              <p className='text-gray-600'>
                Complete verification through a video call with our
                representative. Available during business hours.
              </p>
              <div className='mt-2 text-sm text-blue-600'>(Coming soon)</div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8'>
        <p className='text-sm text-yellow-800'>
          <strong>Note:</strong> You can skip this step for now, but some
          features may be limited until verification is complete.
        </p>
      </div>

      <div className='flex justify-end'>
        <div className='space-x-4'>
          <Button variant='outline' onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={onNext} variant='default'>
            Continue with DigiLocker
          </Button>
        </div>
      </div>
    </div>
  );
}
