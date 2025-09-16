'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  certificateName: string;
  resourcesAttached: number;
}

interface DeleteCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onConfirm: () => Promise<void>;
}

export function DeleteCertificateModal({
  open,
  onClose,
  certificate,
  onConfirm,
}: DeleteCertificateModalProps) {
  const [certificateName, setCertificateName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isConfirmationValid =
    certificate && certificateName === certificate.certificateName;

  useEffect(() => {
    if (open && certificate) {
      setCertificateName('');
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, certificate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateName(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: 'Pasting is not allowed',
      description:
        'For security reasons, you must type the certificate name manually.',
      variant: 'destructive',
    });
  };

  const handleConfirm = async () => {
    if (!isConfirmationValid) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting certificate:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isConfirmationValid && !isDeleting) {
      handleConfirm();
    }
  };

  if (!certificate) {
    return null;
  }

  const isInUse = certificate.resourcesAttached > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-md'
        style={{
          boxShadow:
            'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
        }}
      >
        <DialogHeader className='space-y-3 pb-4'>
          <DialogTitle className='text-base font-semibold text-black pr-8'>
            Cannot Delete Certificate
          </DialogTitle>
          <hr className='border-border' />
        </DialogHeader>

        <div className='space-y-6 py-2'>
          {isInUse ? (
            // Show instructions for certificates in use
            <>
              <div className='space-y-4'>
                <div className='bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4'>
                  <div className='flex items-start gap-3'>
                    <div className='w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0'>
                      <svg
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <p className='text-sm text-orange-800'>
                      The certificate{' '}
                      <strong>{certificate.certificateName}</strong> cannot be
                      deleted because it's used by the following resources:
                    </p>
                  </div>
                </div>

                <p className='text-sm text-gray-700'>
                  Click on a resource below to go to its page and detach the
                  certificate.
                </p>

                {/* Associated Resources List */}
                <div>
                  <h4 className='font-semibold text-sm text-gray-900 mb-3'>
                    Associated Resources
                  </h4>
                  <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <div className='space-y-3'>
                      {/* Resource 1 */}
                      <div className='flex items-center gap-2'>
                        <a
                          href='/networking/load-balancing/balancer/prod-load-balancer'
                          className='text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium'
                        >
                          prod-load-balancer
                        </a>
                        <svg
                          className='h-3 w-3 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                        <span className='text-xs text-gray-500'>
                          Load Balancer
                        </span>
                      </div>

                      {/* Resource 2 */}
                      <div className='flex items-center gap-2'>
                        <a
                          href='/networking/api-gateway/api-gateway'
                          className='text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium'
                        >
                          api-gateway
                        </a>
                        <svg
                          className='h-3 w-3 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                        <span className='text-xs text-gray-500'>
                          API Gateway
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className='text-sm text-gray-700'>
                  Please detach the certificate from these resources to enable
                  deletion.
                </p>
              </div>
            </>
          ) : (
            // Show normal deletion flow for certificates not in use
            <>
              <div className='space-y-2'>
                <Label htmlFor='certificate-name'>
                  Type certificate name to confirm *
                </Label>
                <Input
                  id='certificate-name'
                  ref={inputRef}
                  value={certificateName}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  placeholder={`Type "${certificate.certificateName}" to confirm`}
                  className='font-mono'
                  autoComplete='off'
                />
                <p className='text-xs text-muted-foreground'>
                  Pasting is disabled. You must type the certificate name
                  manually.
                </p>
              </div>

              <Alert variant='destructive'>
                <ExclamationTriangleIcon className='h-4 w-4' />
                <AlertDescription>
                  <strong>Warning:</strong> This will permanently delete
                  certificate "{certificate.certificateName}". This action
                  cannot be undone.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <DialogFooter
          className='flex gap-3 sm:justify-end'
          style={{ paddingTop: '.5rem' }}
        >
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='min-w-20'
            disabled={isDeleting}
          >
            Close
          </Button>
          {!isInUse && (
            <Button
              type='button'
              variant='destructive'
              onClick={handleConfirm}
              className='min-w-32'
              disabled={!isConfirmationValid || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm deletion'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
