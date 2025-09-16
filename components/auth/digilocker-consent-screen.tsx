'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  FileText,
  Shield,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import { Card, CardContent } from '@/components/ui/card';
import {
  connectToDigiLocker,
  DigiLockerResponse,
} from '@/lib/validation-utils';

interface DigiLockerConsentScreenProps {
  onBack: () => void;
  onNext: (userData?: DigiLockerResponse['userData']) => void;
}

export function DigiLockerConsentScreen({
  onBack,
  onNext,
}: DigiLockerConsentScreenProps) {
  const [consents, setConsents] = useState({
    accessDocuments: false,
    shareAadhaar: false,
    sharePan: false,
    termsAndConditions: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOAuthPopup, setShowOAuthPopup] = useState(false);
  const [authStep, setAuthStep] = useState<
    'connecting' | 'authenticating' | 'retrieving' | 'success'
  >('connecting');
  const [digiLockerData, setDigiLockerData] =
    useState<DigiLockerResponse | null>(null);

  const handleConsentChange = (
    key: keyof typeof consents,
    checked: boolean
  ) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async () => {
    // Check if all consents are given
    if (!Object.values(consents).every(Boolean)) {
      setError('Please agree to all terms to proceed');
      return;
    }

    setIsLoading(true);
    setShowOAuthPopup(true);
    setAuthStep('connecting');

    try {
      // Step 1: Connecting to DigiLocker
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuthStep('authenticating');

      // Step 2: Government authentication simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAuthStep('retrieving');

      // Step 3: Retrieve documents
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Get DigiLocker data
      const response = await connectToDigiLocker();
      setDigiLockerData(response);
      setAuthStep('success');

      // Step 5: Auto-close popup and proceed
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowOAuthPopup(false);
      onNext(response.userData);
    } catch (error) {
      setError(
        'An error occurred during DigiLocker authentication. Please try again.'
      );
      setShowOAuthPopup(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOAuthPopup = () => {
    return (
      <Dialog open={showOAuthPopup} onOpenChange={() => {}}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-blue-600' />
              DigiLocker Authentication
            </DialogTitle>
            <DialogDescription>
              Secure connection to Government of India DigiLocker
            </DialogDescription>
          </DialogHeader>

          <div className='py-6'>
            {authStep === 'connecting' && (
              <div className='text-center space-y-4'>
                <Loader2 className='h-12 w-12 animate-spin text-blue-600 mx-auto' />
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Connecting to DigiLocker
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Establishing secure connection...
                  </p>
                </div>
              </div>
            )}

            {authStep === 'authenticating' && (
              <div className='text-center space-y-4'>
                <div className='relative'>
                  <div className='w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center'>
                    <Shield className='h-8 w-8 text-white' />
                  </div>
                  <div className='absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs font-bold'>IN</span>
                  </div>
                </div>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Government Authentication
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Please complete authentication on the government portal...
                  </p>
                </div>
                <div className='flex items-center justify-center space-x-2 text-xs text-gray-500'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                  <span>Redirected to govt.digilocker.gov.in</span>
                </div>
              </div>
            )}

            {authStep === 'retrieving' && (
              <div className='text-center space-y-4'>
                <CheckCircle className='h-12 w-12 text-green-600 mx-auto' />
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Authentication Successful
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Retrieving your documents securely...
                  </p>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-blue-600 h-2 rounded-full w-3/4 animate-pulse transition-all duration-1000'></div>
                </div>
              </div>
            )}

            {authStep === 'success' && digiLockerData && (
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center'>
                  <CheckCircle className='h-8 w-8 text-green-600' />
                </div>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    Verification Complete!
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Documents retrieved successfully
                  </p>
                </div>

                <Card className='text-left'>
                  <CardContent className='p-4 space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <CheckCircle className='h-4 w-4 text-green-600' />
                      <span className='text-sm'>Aadhaar Card Verified</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <CheckCircle className='h-4 w-4 text-green-600' />
                      <span className='text-sm'>PAN Card Verified</span>
                    </div>
                    <div className='text-xs text-gray-500 mt-2'>
                      Name: {digiLockerData.userData.name}
                    </div>
                  </CardContent>
                </Card>

                <p className='text-xs text-gray-500'>
                  Redirecting you back to profile setup...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className='p-8'>
        {/* Add Krutrim Logo */}
        <div className='flex justify-center mb-6'>
          <KrutrimLogo className='h-12' />
        </div>

        <h2 className='text-2xl font-bold mb-2'>DigiLocker Consent</h2>
        <p className='text-gray-600 mb-6'>
          To verify your identity, we need your consent to access your documents
          from DigiLocker.
        </p>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0' />
            <span className='text-red-600'>{error}</span>
          </div>
        )}

        <div className='flex items-start gap-4 mb-8'>
          <div className='bg-blue-100 p-3 rounded-full flex-shrink-0'>
            <FileText className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-2'>What is DigiLocker?</h3>
            <p className='text-gray-600 mb-2'>
              DigiLocker is a secure digital document wallet provided by the
              Government of India that allows citizens to store and access their
              documents like Aadhaar, PAN card, driving license, etc.
            </p>
            <p className='text-gray-600'>
              By connecting your DigiLocker, we can verify your identity quickly
              and securely without requiring you to upload documents manually.
            </p>
          </div>
        </div>

        <div className='border rounded-lg p-6 mb-8'>
          <h3 className='font-semibold mb-4'>Consent for Document Access</h3>

          <div className='space-y-4'>
            <div className='flex items-start gap-2'>
              <Checkbox
                id='access-documents'
                checked={consents.accessDocuments}
                onCheckedChange={checked =>
                  handleConsentChange('accessDocuments', checked as boolean)
                }
                className='mt-1'
              />
              <label htmlFor='access-documents' className='text-sm'>
                I authorize Krutrim Cloud to access my DigiLocker account for
                the purpose of identity verification.
              </label>
            </div>

            <div className='flex items-start gap-2'>
              <Checkbox
                id='share-aadhaar'
                checked={consents.shareAadhaar}
                onCheckedChange={checked =>
                  handleConsentChange('shareAadhaar', checked as boolean)
                }
                className='mt-1'
              />
              <label htmlFor='share-aadhaar' className='text-sm'>
                I consent to share my Aadhaar details from DigiLocker for
                verification purposes.
              </label>
            </div>

            <div className='flex items-start gap-2'>
              <Checkbox
                id='share-pan'
                checked={consents.sharePan}
                onCheckedChange={checked =>
                  handleConsentChange('sharePan', checked as boolean)
                }
                className='mt-1'
              />
              <label htmlFor='share-pan' className='text-sm'>
                I consent to share my PAN card details from DigiLocker for
                verification purposes.
              </label>
            </div>

            <div className='flex items-start gap-2'>
              <Checkbox
                id='terms'
                checked={consents.termsAndConditions}
                onCheckedChange={checked =>
                  handleConsentChange('termsAndConditions', checked as boolean)
                }
                className='mt-1'
              />
              <label htmlFor='terms' className='text-sm'>
                I have read and agree to the{' '}
                <a href='#' className='text-blue-600 hover:underline'>
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href='#' className='text-blue-600 hover:underline'>
                  Privacy Policy
                </a>{' '}
                regarding the use of my DigiLocker data.
              </label>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-8'>
          <Shield className='h-5 w-5 text-green-600 flex-shrink-0' />
          <p className='text-sm text-gray-600'>
            Your data is secure. We only access the documents needed for
            verification and do not store any sensitive information.
          </p>
        </div>

        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={onBack}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            className='bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className='h-4 w-4' />
                Continue to DigiLocker
              </>
            )}
          </Button>
        </div>
      </div>

      {renderOAuthPopup()}
    </>
  );
}
