'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { ProfileCompletionDashboard } from '@/components/auth/profile-completion-dashboard';
import { PageShell } from '@/components/page-shell';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardProfileCompletionPage() {
  const { user, accessLevel, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const featureContext = searchParams.get('feature');

  useEffect(() => {
    // Only redirect if user has full access AND they came from a feature-specific redirect
    // This allows users to manually visit profile completion to update their details
    if (!isLoading && accessLevel === 'full' && featureContext) {
      router.push(redirectPath);
    }
  }, [accessLevel, isLoading, redirectPath, featureContext, router]);

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
      <div className='flex items-center justify-center h-96'>
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
      <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
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
    <PageShell
      title='Your Profile'
      description='Manage your account information and preferences to access all Krutrim Cloud features—compute, storage, and more.'
    >
      {getFeatureMessage()}

      <ProfileCompletionDashboard
        userData={{
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          mobile: user.mobile || '',
          accountType: user.accountType || 'organization',
          companyName: user.companyName,
          website: user.website,
          linkedinProfile: user.linkedinProfile,
          address: user.address,
          organizationType: user.organizationType,
          natureOfBusiness: user.natureOfBusiness,
          typeOfWorkload: user.typeOfWorkload,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
          country: user.country || 'India',
        }}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </PageShell>
  );
}
