'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CustomerValidationScreen } from '@/components/auth/customer-validation-screen';
import { DigiLockerConsentScreen } from '@/components/auth/digilocker-consent-screen';
import { KYCVerificationScreen } from '@/components/auth/kyc-verification-screen';
import { AddressSelectionScreen } from '@/components/auth/address-selection-screen';
import { useRouter } from 'next/navigation';

export default function ValidatePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const goToNextStep = () => {
    if (step === 3) {
      // Final step, mark validation as complete
      localStorage.removeItem('needsValidation');

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step === 0) {
      // First step, go back to dashboard
      router.push('/dashboard');
    } else {
      setStep(prev => prev - 1);
    }
  };

  const skipValidation = () => {
    // User chose to skip validation for now, but we'll keep the needsValidation flag
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <CustomerValidationScreen
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            onSkip={skipValidation}
          />
        );
      case 1:
        return (
          <DigiLockerConsentScreen
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        );
      case 2:
        return <KYCVerificationScreen onNext={goToNextStep} />;
      case 3:
        return (
          <AddressSelectionScreen
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        );
      default:
        return (
          <CustomerValidationScreen
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            onSkip={skipValidation}
          />
        );
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-4xl'>
        <Card className='shadow-lg'>
          <CardContent className='p-0'>{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
