'use client';

import { CheckCircle, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignupSuccessProps {
  onNext: () => void;
  onSkipToDashboard?: () => void;
}

export function SignupSuccess({
  onNext,
  onSkipToDashboard,
}: SignupSuccessProps) {
  return (
    <div className='p-6 md:p-8'>
      <div className='w-full max-w-md mx-auto'>
        {/* Success Icon and Message */}
        <div className='text-center mb-8'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>

          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Account Created Successfully!
          </h2>

          <p className='text-gray-600'>
            Welcome to Krutrim Cloud Platform. Your account has been created and
            you can start exploring our services.
          </p>
        </div>

        {/* Access Level Information */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <h3 className='font-semibold text-blue-900 mb-2'>
            Current Access Level
          </h3>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center text-green-700'>
              <CheckCircle className='h-4 w-4 mr-2' />
              <span>Basic compute services</span>
            </div>
            <div className='flex items-center text-green-700'>
              <CheckCircle className='h-4 w-4 mr-2' />
              <span>Limited storage access</span>
            </div>
            <div className='flex items-center text-green-700'>
              <CheckCircle className='h-4 w-4 mr-2' />
              <span>Community support</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Benefits */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8'>
          <h3 className='font-semibold text-gray-900 mb-2'>
            Verify your identity to Unlock
          </h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
              <span>Full compute and storage services</span>
            </div>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
              <span>Priority technical support</span>
            </div>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
              <span>Advanced security features</span>
            </div>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
              <span>Enterprise-grade SLA</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button
            onClick={onNext}
            variant='secondary'
            className='w-full flex items-center justify-center gap-2'
          >
            Verify your identity
            <ArrowRight className='h-4 w-4' />
          </Button>

          {onSkipToDashboard && (
            <Button
              variant='outline'
              onClick={onSkipToDashboard}
              className='w-full flex items-center justify-center gap-2'
            >
              <Eye className='h-4 w-4' />
              Explore Dashboard
            </Button>
          )}
        </div>

        {/* Additional Information */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500'>
            You can verify your identity later from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
