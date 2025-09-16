'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';

interface KYCVerificationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function KYCVerificationScreen({
  onNext,
  onBack,
}: KYCVerificationScreenProps) {
  const [stage, setStage] = useState<'connecting' | 'verifying' | 'completed'>(
    'connecting'
  );
  const [isVerifying, setIsVerifying] = useState(false);

  // Simulate the DigiLocker connection and verification process
  useState(() => {
    const connectToDigiLocker = async () => {
      // Simulate connecting to DigiLocker
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStage('verifying');
      setIsVerifying(true);

      // Simulate verifying documents
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStage('completed');
      setIsVerifying(false);
    };

    connectToDigiLocker();
  });

  const handleVerify = () => {
    onNext();
  };

  return (
    <div className='p-8 text-center'>
      {/* Add Krutrim Logo */}
      <div className='flex justify-center mb-6'>
        <KrutrimLogo className='h-12' />
      </div>

      <h2 className='text-2xl font-bold mb-6'>KYC Verification</h2>

      <div className='max-w-md mx-auto'>
        {stage === 'connecting' && (
          <div className='space-y-4'>
            <div className='flex justify-center mb-4'>
              <Loader2 className='h-12 w-12 text-blue-600 animate-spin' />
            </div>
            <h3 className='text-lg font-medium'>Connecting to DigiLocker</h3>
            <p className='text-gray-600'>
              Please wait while we establish a secure connection to your
              DigiLocker account...
            </p>
          </div>
        )}

        {stage === 'verifying' && (
          <div className='space-y-4'>
            <div className='flex justify-center mb-4'>
              <Loader2 className='h-12 w-12 text-blue-600 animate-spin' />
            </div>
            <h3 className='text-lg font-medium'>Verifying Your Documents</h3>
            <p className='text-gray-600'>
              We're securely retrieving and verifying your documents from
              DigiLocker...
            </p>

            <div className='w-full bg-gray-200 rounded-full h-2.5 mt-4'>
              <div className='bg-blue-600 h-2.5 rounded-full w-2/3 animate-pulse'></div>
            </div>
          </div>
        )}

        {stage === 'completed' && (
          <div className='space-y-6'>
            <div className='flex justify-center mb-4'>
              <div className='bg-green-100 p-4 rounded-full'>
                <svg
                  className='h-12 w-12 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            <h3 className='text-lg font-medium'>Verification Successful!</h3>
            <p className='text-gray-600'>
              Your identity has been successfully verified through DigiLocker.
            </p>

            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-left'>
              <h4 className='font-medium mb-2'>Verified Documents:</h4>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center'>
                  <svg
                    className='h-4 w-4 text-green-600 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Aadhaar Card
                </li>
                <li className='flex items-center'>
                  <svg
                    className='h-4 w-4 text-green-600 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  PAN Card
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-between mt-4'>
        <Button
          variant='outline'
          onClick={onBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>

        <Button onClick={handleVerify} variant='default' disabled={isVerifying}>
          {isVerifying ? 'Verifying...' : 'Complete Verification'}
        </Button>
      </div>
    </div>
  );
}
