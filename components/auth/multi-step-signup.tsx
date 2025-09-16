'use client';

import { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';

// Import the first step eagerly to avoid full-page loading state
import { SignUpForm } from './sign-up-form';

// Lazy load all step components for the new flow
const OTPVerificationForm = lazy(() =>
  import('./otp-verification-form').then(mod => ({
    default: mod.OTPVerificationForm,
  }))
);
const AccountTypeSelection = lazy(() =>
  import('./customer-type-selection').then(mod => ({
    default: mod.CustomerTypeSelection,
  }))
);
const AddressCollection = lazy(() =>
  import('./address-collection').then(mod => ({
    default: mod.AddressCollection,
  }))
);
const SignupSuccess = lazy(() =>
  import('./signup-success').then(mod => ({ default: mod.SignupSuccess }))
);
const BasicInfoCompletion = lazy(() =>
  import('./customer-validation-screen').then(mod => ({
    default: mod.CustomerValidationScreen,
  }))
);
const IdentityVerification = lazy(() =>
  import('./kyc-verification-screen').then(mod => ({
    default: mod.KYCVerificationScreen,
  }))
);
const PaymentSetup = lazy(() =>
  import('./payment-validation-form').then(mod => ({
    default: mod.PaymentSetupForm,
  }))
);
const PaymentSetupSuccess = lazy(() =>
  import('./payment-success-screen').then(mod => ({
    default: mod.PaymentSetupSuccessScreen,
  }))
);

// Updated stepper configuration function
const getStepperConfig = (phase: 'signup' | 'profile') => {
  if (phase === 'signup') {
    return [
      { name: 'Signup', status: 'current' },
      { name: 'Verify', status: 'upcoming' },
      { name: 'Account Type', status: 'upcoming' },
      { name: 'Address', status: 'upcoming' },
      { name: 'Complete', status: 'upcoming' },
    ];
  }

  return [
    { name: 'Basic Info', status: 'current' },
    { name: 'Identity', status: 'upcoming' },
    { name: 'Payment', status: 'upcoming' },
  ];
};

// New flow configuration supporting two phases
const flowConfig = {
  signup: [
    { step: 0, name: 'Signup', component: 'SignUpForm' },
    { step: 1, name: 'Verify', component: 'OTPVerificationForm' },
    { step: 2, name: 'Account Type', component: 'AccountTypeSelection' },
    { step: 3, name: 'Address', component: 'AddressCollection' },
    { step: 4, name: 'Complete', component: 'SignupSuccess' },
  ],
  profile: [
    { step: 5, name: 'Basic Info', component: 'BasicInfoCompletion' },
    { step: 6, name: 'Identity', component: 'IdentityVerification' },
    { step: 7, name: 'Payment', component: 'PaymentSetup' },
    { step: 8, name: 'Payment Success', component: 'PaymentSetupSuccess' },
  ],
};

// Loading component for Suspense fallback
const LoadingStep = () => (
  <div className='flex justify-center items-center p-12'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
  </div>
);

type FlowPhase = 'signup' | 'profile';

export function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowPhase, setFlowPhase] = useState<FlowPhase>('signup');
  const [accountType, setAccountType] = useState<
    'individual' | 'organization' | null
  >(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [visibleSteps, setVisibleSteps] = useState(getStepperConfig('signup'));
  const router = useRouter();

  const setUserAuthData = (
    userData: { name: string; email: string; mobile: string },
    accountType: string
  ) => {
    try {
      // Set user data in cookie for the application
      const userInfo = {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        accountType: accountType,
        signupCompletedAt: new Date().toISOString(),
      };
      document.cookie = `user_data=${JSON.stringify(userInfo)}; path=/; max-age=86400`;
      console.log('User auth data set successfully');
    } catch (error) {
      console.error('Error setting user auth data:', error);
    }
  };

  const setAccessLevel = (level: 'limited' | 'full') => {
    try {
      // Set access level in localStorage/cookies for access control system
      console.log('Setting access level:', level);
      localStorage.setItem('accessLevel', level);

      // Set authentication cookie for middleware
      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`; // 24 hours

      // Set user profile status cookie for middleware
      const profileStatus = {
        basicInfoComplete: true,
        identityVerified: level === 'full',
        paymentSetupComplete: level === 'full',
      };
      document.cookie = `user_profile_status=${JSON.stringify(profileStatus)}; path=/; max-age=86400`;

      if (level === 'limited') {
        localStorage.setItem('profileCompletionPending', 'true');
      } else {
        localStorage.removeItem('profileCompletionPending');
      }
      console.log('Access level set successfully');
    } catch (error) {
      console.error('Error setting access level:', error);
    }
  };

  const goToNextStep = async () => {
    const nextStep = currentStep + 1;

    // Handle completion of main signup flow
    if (currentStep === 4 && flowPhase === 'signup') {
      // Set limited access and navigate to dashboard
      setAccessLevel('limited');
      sessionStorage.setItem('newSignup', 'true');
      router.push('/dashboard');
      return;
    }

    // Handle transition from signup to profile completion
    if (nextStep === 5 && flowPhase === 'signup') {
      setCurrentStep(nextStep);
      setFlowPhase('profile');
      setVisibleSteps(getStepperConfig('profile'));
      return;
    }

    // Handle completion of profile flow
    if (currentStep === 7 && flowPhase === 'profile') {
      // Set full access and navigate to dashboard
      setAccessLevel('full');
      router.push('/dashboard');
      return;
    }

    setCurrentStep(nextStep);

    // Update step status for current phase
    if (flowPhase === 'signup' && nextStep <= 4) {
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status:
          index < nextStep
            ? 'complete'
            : index === nextStep
              ? 'current'
              : 'upcoming',
      }));
      setVisibleSteps(updatedSteps);
    } else if (flowPhase === 'profile' && nextStep >= 5 && nextStep <= 7) {
      const profileStepIndex = nextStep - 5;
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status:
          index < profileStepIndex
            ? 'complete'
            : index === profileStepIndex
              ? 'current'
              : 'upcoming',
      }));
      setVisibleSteps(updatedSteps);
    }
  };

  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;

    // Handle transition back from profile to signup
    if (prevStep === 4 && flowPhase === 'profile') {
      setCurrentStep(prevStep);
      setFlowPhase('signup');
      setVisibleSteps([
        { name: 'Signup', status: 'complete' },
        { name: 'Verify', status: 'complete' },
        { name: 'Account Type', status: 'complete' },
        { name: 'Address', status: 'complete' },
        { name: 'Complete', status: 'current' },
      ]);
      return;
    }

    setCurrentStep(prevStep);

    // Update step status for current phase
    if (flowPhase === 'signup' && prevStep >= 0) {
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status:
          index < prevStep
            ? 'complete'
            : index === prevStep
              ? 'current'
              : 'upcoming',
      }));
      setVisibleSteps(updatedSteps);
    } else if (flowPhase === 'profile' && prevStep >= 5) {
      const profileStepIndex = prevStep - 5;
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status:
          index < profileStepIndex
            ? 'complete'
            : index === profileStepIndex
              ? 'current'
              : 'upcoming',
      }));
      setVisibleSteps(updatedSteps);
    }
  };

  const goToDashboard = () => {
    try {
      // For profile completion steps, set full access
      console.log('Navigating to dashboard with full access');
      // Set user authentication data
      setUserAuthData(userData, accountType || 'individual');
      setAccessLevel('full');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error navigating to dashboard:', error);
    }
  };

  const handleSignupComplete = (formData: {
    fullName: string;
    email: string;
    mobile: string;
  }) => {
    setUserData({
      name: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
    });
    goToNextStep();
  };

  const handleAccountTypeSelection = (type: 'individual' | 'organization') => {
    setAccountType(type);
    goToNextStep();
  };

  const handlePaymentSetup = (data: any) => {
    setPaymentData(data);
    goToNextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Signup
        return <SignUpForm onNext={handleSignupComplete} />;

      case 1: // Verify
        return (
          <Suspense fallback={<LoadingStep />}>
            <OTPVerificationForm
              email={userData.email}
              mobile={userData.mobile}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </Suspense>
        );

      case 2: // Account Type
        return (
          <Suspense fallback={<LoadingStep />}>
            <AccountTypeSelection
              userName={userData.name}
              selectedType={accountType}
              onSelectType={handleAccountTypeSelection}
              onBack={goToPreviousStep}
              onNext={() => {}} // Handled by onSelectType
            />
          </Suspense>
        );

      case 3: // Address
        return (
          <Suspense fallback={<LoadingStep />}>
            <AddressCollection
              accountType={accountType || 'individual'}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </Suspense>
        );

      case 4: // Complete (Signup Success)
        return (
          <Suspense fallback={<LoadingStep />}>
            <SignupSuccess
              onNext={() => {
                try {
                  console.log('Profile completion selected');
                  // Set user authentication data
                  setUserAuthData(userData, accountType || 'individual');
                  setCurrentStep(5);
                  setFlowPhase('profile');
                  setVisibleSteps(getStepperConfig('profile'));
                } catch (error) {
                  console.error('Error starting profile completion:', error);
                }
              }}
              onSkipToDashboard={() => {
                try {
                  console.log('Skip to dashboard selected');
                  // Set user authentication data
                  setUserAuthData(userData, accountType || 'individual');
                  setAccessLevel('limited');
                  sessionStorage.setItem('newSignup', 'true');
                  console.log('Navigating to dashboard...');
                  router.push('/dashboard');
                } catch (error) {
                  console.error('Error skipping to dashboard:', error);
                  // Fallback navigation
                  window.location.href = '/dashboard';
                }
              }}
            />
          </Suspense>
        );

      case 5: // Basic Info (Profile Completion)
        return (
          <Suspense fallback={<LoadingStep />}>
            <BasicInfoCompletion
              onNext={goToNextStep}
              onSkip={goToDashboard}
              onBack={goToPreviousStep}
            />
          </Suspense>
        );

      case 6: // Identity Verification
        return (
          <Suspense fallback={<LoadingStep />}>
            <IdentityVerification
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </Suspense>
        );

      case 7: // Payment Setup
        return (
          <Suspense fallback={<LoadingStep />}>
            <PaymentSetup
              onBack={goToPreviousStep}
              onNext={handlePaymentSetup}
            />
          </Suspense>
        );

      case 8: // Payment Setup Success
        return (
          <Suspense fallback={<LoadingStep />}>
            <PaymentSetupSuccess
              paymentMethod={paymentData?.paymentMethod}
              paymentData={{
                cardNumber: paymentData?.cardDetails?.number,
                upiId: paymentData?.upiId,
                nameOnCard: paymentData?.cardDetails?.nameOnCard,
              }}
              onNext={goToDashboard}
            />
          </Suspense>
        );

      default:
        return <SignUpForm onNext={handleSignupComplete} />;
    }
  };

  // Calculate current step position for stepper display
  const getStepperValue = () => {
    if (flowPhase === 'signup') {
      return currentStep;
    } else {
      return currentStep - 5; // Adjust for profile completion phase
    }
  };

  // Get phase-specific breadcrumb for profile sections
  const getPhaseInfo = () => {
    if (flowPhase === 'signup') {
      return {
        title: 'Account Setup',
        description: 'Create your Krutrim Cloud account',
        color: 'bg-blue-100 text-blue-800',
      };
    } else {
      return {
        title: 'Profile Completion',
        description: 'Verify your identity for full access',
        color: 'bg-green-100 text-green-800',
      };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-4xl'>
        <div className='flex justify-center mb-8'>
          <KrutrimLogo width={180} height={60} className='h-12' href={null} />
        </div>

        {/* Progressive Stepper with maintained visual design */}
        <div className='w-full mb-6'>
          <Stepper value={getStepperValue()} className='w-full'>
            {visibleSteps.map((step, index) => {
              return (
                <StepperItem
                  key={`${flowPhase}-${step.name}`}
                  step={index}
                  completed={step.status === 'complete'}
                  className='relative flex-1 !flex-col'
                >
                  <StepperTrigger className='flex-col gap-3'>
                    <StepperIndicator
                      aria-label={`Step ${index + 1}: ${step.name}`}
                      className={`
                        transition-all duration-200 ease-in-out
                        ${step.status === 'complete' ? 'bg-green-600 border-green-600' : ''}
                        ${step.status === 'current' ? 'bg-primary border-primary' : ''}
                        ${step.status === 'upcoming' ? 'bg-gray-200 border-gray-300' : ''}
                      `}
                    />
                    <div className='px-2'>
                      <StepperTitle
                        className={`
                        transition-colors duration-200
                        ${step.status === 'complete' ? 'text-green-600' : ''}
                        ${step.status === 'current' ? 'text-primary font-semibold' : ''}
                        ${step.status === 'upcoming' ? 'text-gray-500' : ''}
                      `}
                      >
                        {step.name}
                      </StepperTitle>
                    </div>
                  </StepperTrigger>
                  {index < visibleSteps.length - 1 && (
                    <StepperSeparator
                      className={`
                      absolute inset-x-0 left-[calc(50%+0.75rem+0.125rem)] top-3 -order-1 m-0 -translate-y-1/2 
                      group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] 
                      group-data-[orientation=horizontal]/stepper:flex-none
                      transition-colors duration-200
                      ${step.status === 'complete' ? 'bg-green-200' : 'bg-gray-200'}
                    `}
                    />
                  )}
                </StepperItem>
              );
            })}
          </Stepper>
        </div>

        {/* Context switching indicator for profile completion */}
        {flowPhase === 'profile' && (
          <div className='text-center mb-4'>
            <div className='inline-flex items-center space-x-2 text-sm text-gray-600'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              <span>Account created successfully</span>
              <span>•</span>
              <span>Verify your identity for full access</span>
            </div>
          </div>
        )}

        <Card className='mt-6 shadow-sm border-gray-200'>
          <CardContent className='p-0'>{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
