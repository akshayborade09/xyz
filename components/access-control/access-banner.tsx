'use client';

import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import { getRequiredStepsForUpgrade } from '@/lib/access-control';
import { useRouter } from 'next/navigation';

interface AccessBannerProps {
  onCompleteProfile?: () => void;
  className?: string;
}

export function AccessBanner({
  onCompleteProfile,
  className,
}: AccessBannerProps) {
  const { user, accessLevel, getUserType } = useAuth();
  const router = useRouter();

  const userType = getUserType();
  const isNewUser = userType === 'new';
  const isExistingUser = userType === 'existing';

  const handleCompleteProfile = () => {
    if (isNewUser) {
      // New users: Open modal (current behavior)
      if (onCompleteProfile) {
        onCompleteProfile();
      } else {
        router.push('/dashboard/profile-completion');
      }
    } else {
      // Existing users: Always navigate to profile completion page
      router.push('/dashboard/profile-completion');
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!user) {
      return 0;
    }

    const { basicInfoComplete, identityVerified } = user.profileStatus;
    const completed = [basicInfoComplete, identityVerified].filter(
      Boolean
    ).length;
    return Math.round((completed / 2) * 100);
  };

  const getRequiredSteps = () => {
    if (!user) {
      return [];
    }

    const steps: string[] = [];
    if (!user.profileStatus.identityVerified) {
      steps.push('Identity verification');
    }
    return steps;
  };

  const requiredSteps = getRequiredSteps();
  const completionPercentage = getProfileCompletionPercentage();

  if (accessLevel === 'limited') {
    return (
      <Alert
        className={`mb-4 border-0 ${className}`}
        style={{
          boxShadow: 'rgba(255, 109, 107, 0.1) 0px 0px 0px 1px inset',
          background:
            'linear-gradient(263deg, rgba(255, 109, 107, 0.08) 6.86%, rgba(255, 109, 107, 0.02) 96.69%)',
        }}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-start space-x-3'>
            <AlertCircle
              className='h-5 w-5 mt-0.5 flex-shrink-0'
              style={{ color: 'rgb(165, 47, 46)' }}
            />
            <div>
              <AlertTitle
                className='mb-1'
                style={{ color: 'rgb(165, 47, 46)' }}
              >
                Unlock all features and get full access to Krutrim Cloud
              </AlertTitle>
              <AlertDescription style={{ color: 'rgb(165, 47, 46)' }}>
                <p className='text-sm opacity-90'>
                  You have access to documentation, maps AI tools. Complete{' '}
                  {requiredSteps.join(' and ').toLowerCase()} for full access to
                  compute, storage, and billing features.
                </p>
              </AlertDescription>
            </div>
          </div>

          <Button
            onClick={handleCompleteProfile}
            className='text-white flex-shrink-0 ml-4'
            style={{
              backgroundColor: 'rgb(165, 47, 46)',
              borderColor: 'rgb(165, 47, 46)',
            }}
            size='sm'
          >
            {isNewUser ? 'Verify your identity' : 'Complete your profile'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </Alert>
    );
  }

  if (accessLevel === 'none') {
    return (
      <Alert className={`mb-4 border-red-200 bg-red-50 ${className}`}>
        <AlertCircle className='h-4 w-4 text-red-600' />
        <AlertTitle className='text-red-900'>Account Setup Required</AlertTitle>
        <AlertDescription className='text-red-800'>
          <div className='mt-2'>
            <p className='mb-3'>
              Please complete your account setup to access Krutrim Cloud
              features. You'll need to verify your identity and add a payment
              method.
            </p>
            <Button onClick={handleCompleteProfile} variant='secondary'>
              Complete Setup
              <ArrowRight className='ml-2 h-3 w-3' />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

// Compact version for smaller spaces
export function AccessBannerCompact({
  onCompleteProfile,
  className,
}: AccessBannerProps) {
  const { user, accessLevel, getUserType } = useAuth();
  const router = useRouter();

  const userType = getUserType();
  const isNewUser = userType === 'new';
  const isExistingUser = userType === 'existing';

  const handleCompleteProfile = () => {
    if (isNewUser) {
      // New users: Open modal (current behavior)
      if (onCompleteProfile) {
        onCompleteProfile();
      } else {
        router.push('/dashboard/profile-completion');
      }
    } else {
      // Existing users: Always navigate to profile completion page
      router.push('/dashboard/profile-completion');
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!user) {
      return 0;
    }

    const { basicInfoComplete, identityVerified } = user.profileStatus;
    const completed = [basicInfoComplete, identityVerified].filter(
      Boolean
    ).length;
    return Math.round((completed / 2) * 100);
  };

  if (accessLevel === 'limited') {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm ${className}`}
      >
        <div className='flex items-center space-x-2'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <span className='text-amber-800 font-medium'>
            Profile {getProfileCompletionPercentage()}% complete
          </span>
        </div>
        <Button
          onClick={handleCompleteProfile}
          variant='secondary'
          size='sm'
          className='text-xs'
        >
          {isNewUser ? 'Verify' : 'Complete'}
          <ArrowRight className='ml-1 h-3 w-3' />
        </Button>
      </div>
    );
  }

  if (accessLevel === 'none') {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg text-sm ${className}`}
      >
        <div className='flex items-center space-x-2'>
          <AlertCircle className='h-4 w-4 text-red-600' />
          <span className='text-red-800 font-medium'>Setup required</span>
        </div>
        <Button
          onClick={handleCompleteProfile}
          variant='secondary'
          size='sm'
          className='text-xs'
        >
          Setup
          <ArrowRight className='ml-1 h-3 w-3' />
        </Button>
      </div>
    );
  }

  return null;
}
