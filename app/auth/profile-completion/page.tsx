'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { ProfileCompletionDashboard } from '@/components/auth/profile-completion-dashboard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileCompletionPage() {
  const { user, accessLevel, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const featureContext = searchParams.get('feature');

  useEffect(() => {
    // If user already has full access, redirect to intended destination
    if (!isLoading && accessLevel === 'full') {
      router.push(redirectPath);
    }
  }, [accessLevel, isLoading, redirectPath, router]);

  const handleComplete = () => {
    // Add a small delay to ensure auth state is fully updated
    setTimeout(() => {
      // User completed profile, redirect to intended destination
      router.push(redirectPath);
    }, 100);
  };

  const handleSkip = () => {
    // User chose to skip for now, redirect to dashboard
    router.push('/dashboard');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // If no user data, redirect to signin
  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  // Show context message if redirected from a specific feature
  const getFeatureMessage = () => {
    if (!featureContext) {
      return null;
    }

    const featureNames: Record<string, string> = {
      compute: 'Compute & Scaling',
      storage: 'Storage',
      billing: 'Billing & Subscriptions',
      kubernetes: 'Kubernetes',
      networking: 'Networking',
      infrastructure: 'Infrastructure',
    };

    const featureName = featureNames[featureContext] || featureContext;

    return (
      <div className='max-w-4xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <h3 className='font-semibold text-blue-900 mb-1'>
          Complete your profile to access {featureName}
        </h3>
        <p className='text-sm text-blue-800'>
          You were redirected here because {featureName} requires a complete
          profile. Fill in the required information below to unlock full access.
        </p>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {getFeatureMessage()}

      <ProfileCompletionDashboard
        userData={{
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          mobile: user.mobile || '',
          accountType: user.accountType || 'individual',
          companyName: user.companyName,
          website: user.website,
          linkedinProfile: user.linkedinProfile,
          address: user.address,
          organizationType: user.organizationType,
          natureOfBusiness: user.natureOfBusiness,
          typeOfWorkload: user.typeOfWorkload,
        }}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </div>
  );
}
