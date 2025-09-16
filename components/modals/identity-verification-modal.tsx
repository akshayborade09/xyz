'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Shield, Zap, Globe, X } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

// Modal-optimized DigiLocker verification content
function IdentityVerificationModalContent({
  userData,
  onComplete,
  onCancel,
}: {
  userData: UserData;
  onComplete: () => void;
  onCancel: () => void;
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
    <div className='text-center py-8 space-y-6'>
      <Shield className='mx-auto h-20 w-20 text-blue-600' />
      <div className='space-y-3'>
        <h3 className='text-xl font-semibold'>Connect your DigiLocker</h3>
        <p className='text-gray-600 max-w-md mx-auto'>
          We'll securely verify your PAN and Aadhaar details through DigiLocker
          to complete your identity verification instantly.
        </p>
      </div>

      {error && (
        <div className='flex items-center justify-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg'>
          <X className='h-4 w-4' />
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
  );
}

interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  mobile: string;
  accountType: 'individual' | 'organization';
  companyName?: string;
}

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userData: UserData;
}

export function IdentityVerificationModal({
  isOpen,
  onClose,
  onComplete,
  userData,
}: IdentityVerificationModalProps) {
  const { updateProfileStatus } = useAuth();

  const handleIdentityVerificationComplete = () => {
    // Update profile status to mark identity as verified
    updateProfileStatus({
      basicInfoComplete: true,
      identityVerified: true,
    });

    // Close modal
    onClose();

    // Complete the verification
    onComplete();
  };

  const handleIdentityVerificationCancel = () => {
    // Close modal without completing verification
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='p-0 bg-white max-w-[60vw] max-h-[70vh] w-[60vw] h-auto overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex-shrink-0 p-6 border-b'>
          <DialogHeader>
            <DialogTitle>Identity Verification</DialogTitle>
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
            <IdentityVerificationModalContent
              userData={userData}
              onComplete={handleIdentityVerificationComplete}
              onCancel={handleIdentityVerificationCancel}
            />
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
                    <Zap className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>Quick Verification</p>
                    <p className='text-xs'>
                      DigiLocker verification is instant
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <Globe className='h-4 w-4 text-purple-600' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>Full Access</p>
                    <p className='text-xs'>
                      Unlock all cloud services and features
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='text-xs text-gray-500 space-y-1'>
                  <p>• Your documents are processed securely</p>
                  <p>• No documents are stored on our servers</p>
                  <p>• Verification completes in seconds</p>
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
            <Button
              variant='outline'
              onClick={handleIdentityVerificationCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
