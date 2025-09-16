'use client';

import { useState, ReactNode, cloneElement, isValidElement } from 'react';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import {
  checkFeatureAccess,
  getAccessDeniedMessage,
  getRequiredStepsForUpgrade,
} from '@/lib/access-control';
import { useRouter } from 'next/navigation';

interface FeatureRestrictionProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  disabled?: boolean;
  showOverlay?: boolean;
  onAccessDenied?: () => void;
}

export function FeatureRestriction({
  feature,
  children,
  fallback,
  disabled = false,
  showOverlay = true,
  onAccessDenied,
}: FeatureRestrictionProps) {
  const { user, accessLevel } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const hasAccess = checkFeatureAccess(feature, accessLevel);

  const handleRestrictedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAccessDenied) {
      onAccessDenied();
    } else {
      setShowDialog(true);
    }
  };

  const handleCompleteProfile = () => {
    setShowDialog(false);
    router.push('/dashboard/profile-completion');
  };

  const getRequiredSteps = () => {
    if (!user) {
      return [];
    }

    const steps: string[] = [];
    if (!user.profileStatus.identityVerified) {
      steps.push('Complete identity verification');
    }
    if (!user.profileStatus.paymentSetupComplete) {
      steps.push('Setup payment method');
    }
    return steps;
  };

  const getCompletionPercentage = () => {
    if (!user) {
      return 0;
    }

    const { basicInfoComplete, identityVerified, paymentSetupComplete } =
      user.profileStatus;
    const completed = [
      basicInfoComplete,
      identityVerified,
      paymentSetupComplete,
    ].filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  // If user has access, render children normally
  if (hasAccess && !disabled) {
    return <>{children}</>;
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Create restricted version with overlay
  const restrictedElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onClick: handleRestrictedClick,
        onPointerDown: handleRestrictedClick,
        style: {
          cursor: 'not-allowed',
          ...((children as any).props?.style || {}),
        },
      })
    : children;

  const requiredSteps = getRequiredSteps();
  const completionPercentage = getCompletionPercentage();

  return (
    <>
      <div className='relative'>
        {showOverlay && (
          <div className='absolute inset-0 bg-gray-50/80 backdrop-blur-[2px] z-10 rounded-md border border-gray-200 border-dashed'>
            <div className='flex items-center justify-center h-full'>
              <div className='text-center p-4'>
                <Lock className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-600 mb-1'>
                  Feature Restricted
                </p>
                <p className='text-xs text-gray-500'>
                  Verify identity to unlock
                </p>
                <Button
                  size='sm'
                  onClick={handleRestrictedClick}
                  className='mt-3 h-7 text-xs'
                >
                  Unlock
                  <ArrowRight className='ml-1 h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className={showOverlay ? 'opacity-50 pointer-events-none' : ''}>
          {restrictedElement}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Lock className='h-5 w-5 text-amber-600' />
              Feature Requires Profile Completion
            </DialogTitle>
            <DialogDescription>
              {getAccessDeniedMessage(feature, accessLevel)}
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            {accessLevel === 'limited' && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                  <div className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-amber-600' />
                    <span className='text-sm font-medium text-amber-800'>
                      Profile {completionPercentage}% complete
                    </span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-amber-100 text-amber-800 border-amber-300'
                  >
                    {completionPercentage}%
                  </Badge>
                </div>

                {requiredSteps.length > 0 && (
                  <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-2'>
                      Complete these steps to unlock {feature}:
                    </h4>
                    <div className='space-y-2'>
                      {requiredSteps.map((step, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2 text-sm text-gray-600'
                        >
                          <AlertCircle className='h-4 w-4 text-amber-500' />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {accessLevel === 'none' && (
              <div className='text-center py-4'>
                <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-3' />
                <h4 className='text-sm font-medium text-gray-900 mb-2'>
                  Account Setup Required
                </h4>
                <p className='text-sm text-gray-600'>
                  Complete your account setup to access this feature and all
                  Krutrim Cloud services.
                </p>
              </div>
            )}
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              variant='outline'
              onClick={() => setShowDialog(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteProfile}
              className='flex-1 bg-primary hover:bg-primary/90'
            >
              {accessLevel === 'limited'
                ? 'Verify your identity'
                : 'Setup Account'}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Higher-order component version for wrapping existing components
export function withFeatureRestriction<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  feature: string,
  options?: {
    showOverlay?: boolean;
    fallback?: ReactNode;
  }
) {
  return function RestrictedComponent(props: T) {
    return (
      <FeatureRestriction
        feature={feature}
        showOverlay={options?.showOverlay}
        fallback={options?.fallback}
      >
        <WrappedComponent {...props} />
      </FeatureRestriction>
    );
  };
}

// Hook for checking feature access in components
export function useFeatureAccess(feature: string) {
  const { accessLevel } = useAuth();

  return {
    hasAccess: checkFeatureAccess(feature, accessLevel),
    accessLevel,
    isRestricted: !checkFeatureAccess(feature, accessLevel),
  };
}
