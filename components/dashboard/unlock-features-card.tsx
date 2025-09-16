'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Identity Verification Modal Component
function IdentityVerificationModal({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDigiLockerVerification = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate DigiLocker connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the completion handler
      onComplete();
    } catch (error) {
      console.error('Error with DigiLocker verification:', error);
      setError('DigiLocker verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='p-0 bg-white max-w-[80vw] max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex-shrink-0 p-6 border-b'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold'>
              Identity Verification
            </DialogTitle>
            <DialogDescription>
              Verify your identity to unlock full access to Krutrim Cloud
              services
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex gap-6 min-h-0 p-6'>
          {/* Main Content */}
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center py-8 space-y-6'>
              <Shield className='mx-auto h-20 w-20 text-blue-600' />
              <div className='space-y-3'>
                <h3 className='text-xl font-semibold'>
                  Connect your DigiLocker
                </h3>
                <p className='text-gray-600 max-w-md mx-auto'>
                  We'll securely verify your PAN and Aadhaar details through
                  DigiLocker to complete your identity verification instantly.
                </p>
              </div>

              {error && (
                <div className='flex items-center justify-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg'>
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handleDigiLockerVerification}
                disabled={isLoading}
                className='bg-black hover:bg-gray-800 text-white px-8 py-3 text-base'
                size='lg'
              >
                {isLoading ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Connecting to DigiLocker...
                  </>
                ) : (
                  'Connect DigiLocker'
                )}
              </Button>
            </div>
          </div>

          {/* Side Panel - Verification Tips */}
          <div className='w-80 flex-shrink-0'>
            <div
              style={{
                borderRadius: '16px',
                border: '4px solid #FFF',
                background:
                  'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                padding: '1.5rem',
              }}
            >
              <div className='pb-4'>
                <h3 className='text-base font-semibold'>Verification Tips:</h3>
              </div>
              <div className='space-y-4 text-sm text-gray-600'>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <Shield className='h-4 w-4 text-green-600' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>Secure Process</p>
                    <p className='text-xs'>
                      Your documents are encrypted and processed securely
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <Star className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>Quick Verification</p>
                    <p className='text-xs'>
                      DigiLocker verification is instant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex-shrink-0 p-6 border-t bg-gray-50'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Need help? Contact our support team for assistance.
            </p>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UnlockFeaturesCard() {
  const { user, accessLevel, getUserType, updateProfileStatus } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Show for all users who are not fully verified
  if (
    !user ||
    (accessLevel === 'full' && user?.profileStatus?.identityVerified)
  ) {
    return null;
  }

  const userType = getUserType();
  const isNewUser = userType === 'new';
  const isExistingUser = userType === 'existing';

  const handleCTAClick = () => {
    if (isNewUser) {
      // New users go directly to identity verification modal
      setShowIdentityModal(true);
    } else {
      // Existing users go to profile completion page
      router.push('/dashboard/profile-completion');
    }
  };

  const handleIdentityVerificationComplete = () => {
    // Update profile status to mark identity as verified
    updateProfileStatus({
      basicInfoComplete: true,
      identityVerified: true,
    });

    // Close modal
    setShowIdentityModal(false);
  };

  const handleIdentityVerificationCancel = () => {
    // Close modal without completing verification
    setShowIdentityModal(false);
  };

  const getCardTitle = () => {
    return 'Unlock all features and get full access to Krutrim Cloud';
  };

  const getCTAText = () => {
    if (isNewUser) {
      return 'Verify your identity';
    }
    return 'Complete Profile';
  };

  return (
    <>
      <Card
        className='border-0 hover:opacity-90 transition-all duration-200 cursor-pointer'
        style={{
          boxShadow: 'rgba(255, 109, 107, 0.1) 0px 0px 0px 1px inset',
          background:
            'linear-gradient(263deg, rgba(255, 109, 107, 0.08) 6.86%, rgba(255, 109, 107, 0.02) 96.69%)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCTAClick}
      >
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div
                className='flex items-center justify-center w-8 h-8 rounded-full'
                style={{ backgroundColor: 'rgba(255, 109, 107, 0.1)' }}
              >
                <Star
                  className='h-4 w-4'
                  style={{ color: 'rgb(165, 47, 46)' }}
                />
              </div>
              <div>
                <CardTitle
                  className='text-lg'
                  style={{ color: 'rgb(165, 47, 46)' }}
                >
                  {getCardTitle()}
                </CardTitle>
                <CardDescription
                  className='text-sm'
                  style={{ color: 'rgb(165, 47, 46)', opacity: 0.8 }}
                >
                  {isNewUser
                    ? 'Verify your identity to unlock all cloud services and features.'
                    : 'Complete your profile to unlock all cloud services and features.'}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant='outline'
              className='text-xs font-medium border-0'
              style={{
                backgroundColor: 'rgba(255, 109, 107, 0.1)',
                color: 'rgb(165, 47, 46)',
              }}
            >
              {isNewUser ? 'New User' : 'Existing User'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* CTA Button */}
          <Button
            variant='outline'
            className='w-full mt-4 border-0 hover:opacity-90'
            style={{
              backgroundColor: 'rgba(255, 109, 107, 0.1)',
              color: 'rgb(165, 47, 46)',
              border: '1px solid rgba(255, 109, 107, 0.3)',
            }}
            onClick={handleCTAClick}
          >
            <span>{getCTAText()}</span>
            <ArrowRight
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`}
            />
          </Button>

          {/* Benefits Preview */}
          <div
            className='mt-4 pt-4'
            style={{ borderTop: '1px solid rgba(255, 109, 107, 0.2)' }}
          >
            <p
              className='text-xs mb-2'
              style={{ color: 'rgba(165, 47, 46, 0.7)' }}
            >
              Unlock with verification:
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge
                variant='outline'
                className='text-xs border-0'
                style={{
                  backgroundColor: 'rgba(255, 109, 107, 0.08)',
                  color: 'rgb(165, 47, 46)',
                }}
              >
                Compute Resources
              </Badge>
              <Badge
                variant='outline'
                className='text-xs border-0'
                style={{
                  backgroundColor: 'rgba(255, 109, 107, 0.08)',
                  color: 'rgb(165, 47, 46)',
                }}
              >
                Storage Solutions
              </Badge>
              <Badge
                variant='outline'
                className='text-xs border-0'
                style={{
                  backgroundColor: 'rgba(255, 109, 107, 0.08)',
                  color: 'rgb(165, 47, 46)',
                }}
              >
                Advanced AI
              </Badge>
              <Badge
                variant='outline'
                className='text-xs border-0'
                style={{
                  backgroundColor: 'rgba(255, 109, 107, 0.08)',
                  color: 'rgb(165, 47, 46)',
                }}
              >
                Priority Support
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={showIdentityModal}
        onClose={handleIdentityVerificationCancel}
        onComplete={handleIdentityVerificationComplete}
      />
    </>
  );
}
