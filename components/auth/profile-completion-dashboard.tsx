'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { ArrowRight, Shield, Zap, Globe, X, HelpCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

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
  website?: string;
  linkedinProfile?: string;
  address?: string;
  organizationType?: string;
  natureOfBusiness?: string;
  typeOfWorkload?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface ProfileCompletionDashboardProps {
  userData: UserData;
  onComplete?: () => void;
  onSkip?: () => void;
}

// Define form data types
type BaseFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  accountType: 'individual' | 'organization';
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  typeOfWorkload: string;
};

type OrganizationFormData = BaseFormData & {
  companyName: string;
  website: string;
  linkedinProfile: string;
  organizationType: string;
  natureOfBusiness: string;
};

type FormData = BaseFormData | OrganizationFormData;

export function ProfileCompletionDashboard({
  userData,
  onComplete,
  onSkip,
}: ProfileCompletionDashboardProps) {
  const { updateProfileStatus } = useAuth();
  const router = useRouter();

  // Detect user type - new users are "individual", existing users are "organization"
  const isNewUser = userData.accountType === 'individual';
  const isExistingUser = userData.accountType === 'organization';

  // Parse name into first and last name if not already separated
  const getNameParts = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  const { firstName: defaultFirstName, lastName: defaultLastName } =
    userData.firstName && userData.lastName
      ? { firstName: userData.firstName, lastName: userData.lastName }
      : getNameParts(userData.name || '');

  // Initialize form data based on user type
  const [formData, setFormData] = useState<FormData>(() => {
    const baseData: BaseFormData = {
      firstName: userData.firstName || defaultFirstName,
      lastName: userData.lastName || defaultLastName,
      email: userData.email || '',
      mobile: userData.mobile || '',
      accountType:
        userData.accountType || (isNewUser ? 'individual' : 'organization'),
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      pincode: userData.pincode || '',
      country: userData.country || 'India',
      typeOfWorkload: userData.typeOfWorkload || '',
    };

    // Add organization-specific fields only for existing users
    if (isExistingUser) {
      const orgData: OrganizationFormData = {
        ...baseData,
        accountType: 'organization',
        companyName: userData.companyName || '',
        website: userData.website || '',
        linkedinProfile: userData.linkedinProfile || '',
        organizationType: userData.organizationType || '',
        natureOfBusiness: userData.natureOfBusiness || '',
      };
      return orgData;
    }

    return { ...baseData, accountType: 'individual' as const };
  });

  const [originalData, setOriginalData] = useState<FormData>(() => {
    const baseData: BaseFormData = {
      firstName: userData.firstName || defaultFirstName,
      lastName: userData.lastName || defaultLastName,
      email: userData.email || '',
      mobile: userData.mobile || '',
      accountType:
        userData.accountType || (isNewUser ? 'individual' : 'organization'),
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      pincode: userData.pincode || '',
      country: userData.country || 'India',
      typeOfWorkload: userData.typeOfWorkload || '',
    };

    // Add organization-specific fields only for existing users
    if (isExistingUser) {
      const orgData: OrganizationFormData = {
        ...baseData,
        accountType: 'organization',
        companyName: userData.companyName || '',
        website: userData.website || '',
        linkedinProfile: userData.linkedinProfile || '',
        organizationType: userData.organizationType || '',
        natureOfBusiness: userData.natureOfBusiness || '',
      };
      return orgData;
    }

    return { ...baseData, accountType: 'individual' as const };
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showIdentityVerificationModal, setShowIdentityVerificationModal] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  // Add state for password change success at the top of the component
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if form data has changed
  useEffect(() => {
    const isChanged = Object.keys(formData).some(
      key =>
        formData[key as keyof typeof formData] !==
        originalData[key as keyof typeof originalData]
    );
    setHasChanges(isChanged);
  }, [formData, originalData]);

  // Check if profile is complete (all required fields filled)
  const isProfileComplete = () => {
    // Base required fields for all users
    const baseRequiredFields = [
      'firstName',
      'lastName',
      'email',
      'mobile',
      'address',
      'typeOfWorkload',
      'city',
      'state',
      'pincode',
    ];

    // Additional required fields for existing users (organizations)
    const orgRequiredFields = isExistingUser
      ? ['companyName', 'organizationType', 'natureOfBusiness']
      : [];

    const requiredFields = [...baseRequiredFields, ...orgRequiredFields];

    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.trim() !== '';
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required field validations for all users
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.typeOfWorkload) {
      errors.typeOfWorkload = 'Type of workload is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      errors.city = 'City should contain only alphabetic characters';
    }

    if (!formData.state) {
      errors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }

    // Additional validations for existing users (organizations)
    if (formData.accountType === 'organization') {
      const orgData = formData as OrganizationFormData;

      if (!orgData.companyName?.trim()) {
        errors.companyName = 'Company name is required';
      }

      if (!orgData.organizationType) {
        errors.organizationType = 'Organization type is required';
      }

      if (!orgData.natureOfBusiness?.trim()) {
        errors.natureOfBusiness = 'Nature of business is required';
      }

      // Optional field validations for organizations
      if (orgData.website && !orgData.website.startsWith('http')) {
        errors.website = 'Website must start with http:// or https://';
      }

      if (
        orgData.linkedinProfile &&
        !orgData.linkedinProfile.includes('linkedin.com')
      ) {
        errors.linkedinProfile = 'LinkedIn ID must be a valid LinkedIn URL';
      }
    }

    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));

    // Clear error when user selects
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Save the form data
    setOriginalData(formData);
    setHasChanges(false);
    setErrors({});

    // Mark profile as saved
    setIsProfileSaved(true);

    // Show success modal after saving
    setShowSuccessModal(true);

    // You can add API call here to save the data
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData(originalData);
    setHasChanges(false);
    setErrors({});
  };

  const handleVerifyIdentity = () => {
    // Save current form data first if there are changes
    if (hasChanges) {
      handleSave();
    }

    // Show the identity verification modal
    setShowIdentityVerificationModal(true);
  };

  const handleIdentityVerificationComplete = () => {
    // Update profile status to mark identity as verified
    updateProfileStatus({
      basicInfoComplete: true,
      identityVerified: true,
    });

    // Close modal
    setShowIdentityVerificationModal(false);

    // Complete the profile flow
    if (onComplete) {
      onComplete();
    }
  };

  const handleIdentityVerificationCancel = () => {
    // Close modal without completing verification
    setShowIdentityVerificationModal(false);
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion (prototype only)
    // In production, this would call an API to delete the account
    
    // Show toast notification
    toast({
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted.',
      variant: 'destructive',
    });

    // Close modal
    setShowDeleteAccountModal(false);

    // Redirect to sign-in page after a short delay
    setTimeout(() => {
      router.push('/auth/signin');
    }, 1500);
  };

  const handleSuccessModalClose = () => {
    // Just close the success modal
    setShowSuccessModal(false);
  };

  const organizationTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Partnership',
    'Private Limited Companies',
    'Public Limited Companies',
    'One-Person Companies',
    'Joint-Venture Company',
    'Non-Government Organization (NGO)',
    'Others',
  ];

  // Different workload types based on user type
  const workloadTypes = isNewUser
    ? [
        'Web Hosting',
        'Application Hosting',
        'Dev/Test Environments',
        'Big Data & Analytics',
        'Machine Learning / AI',
        'SaaS Application Hosting',
        'Backup & Disaster Recovery',
        'Others',
      ]
    : [
        'Web Hosting',
        'Application Hosting',
        'Dev/Test Environments',
        'Big Data & Analytics',
        'Machine Learning / AI',
        'SaaS Application Hosting',
        'Backup & Disaster Recovery',
        'Others',
      ];

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
  ];

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      {/* Main Content - Left Side */}
      <div className='flex-1 space-y-6'>
        <Card>
          <CardContent className='space-y-6 pt-6'>
            <div className='space-y-5'>
              {/* First Name and Last Name */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName' className='block mb-2 font-medium'>
                    First Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='Enter your first name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.firstName ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.firstName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='lastName' className='block mb-2 font-medium'>
                    Last Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Enter your last name'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.lastName ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.lastName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Mobile - Non-editable */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='email' className='block mb-2 font-medium'>
                    <div className='flex items-center gap-2'>
                      Email Address <span className='text-destructive'>*</span>
                      <TooltipWrapper content='Email address cannot be modified'>
                        <HelpCircle className='h-4 w-4 text-gray-400' />
                      </TooltipWrapper>
                    </div>
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor='mobile' className='block mb-2 font-medium'>
                    <div className='flex items-center gap-2'>
                      Mobile Number <span className='text-destructive'>*</span>
                      <TooltipWrapper content='Mobile number cannot be modified'>
                        <HelpCircle className='h-4 w-4 text-gray-400' />
                      </TooltipWrapper>
                    </div>
                  </Label>
                  <Input
                    id='mobile'
                    type='tel'
                    value={formData.mobile}
                    className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Account Type - Non-editable */}
              <div>
                <Label htmlFor='accountType' className='block mb-2 font-medium'>
                  <div className='flex items-center gap-2'>
                    Account Type <span className='text-destructive'>*</span>
                    <TooltipWrapper content='Account type cannot be changed'>
                      <HelpCircle className='h-4 w-4 text-gray-400' />
                    </TooltipWrapper>
                  </div>
                </Label>
                <Input
                  value={isNewUser ? 'Individual' : 'Organisation'}
                  className='focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed'
                  disabled
                  readOnly
                />
              </div>

              {/* Organization fields - Only show for existing users */}
              {isExistingUser && (
                <>
                  {/* Company Name */}
                  <div>
                    <Label
                      htmlFor='companyName'
                      className='block mb-2 font-medium'
                    >
                      Company Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='companyName'
                      placeholder='Enter your company name'
                      value={
                        (formData as OrganizationFormData).companyName || ''
                      }
                      onChange={handleChange}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.companyName ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.companyName && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Website and LinkedIn Profile */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label
                        htmlFor='website'
                        className='block mb-2 font-medium'
                      >
                        Website{' '}
                        <span className='text-muted-foreground'>
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id='website'
                        placeholder='https://yourcompany.com'
                        value={(formData as OrganizationFormData).website || ''}
                        onChange={handleChange}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.website ? 'border-destructive' : ''}`}
                      />
                      {errors.website && (
                        <p className='text-sm text-destructive mt-1'>
                          {errors.website}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor='linkedinProfile'
                        className='block mb-2 font-medium'
                      >
                        LinkedIn ID{' '}
                        <span className='text-muted-foreground'>
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id='linkedinProfile'
                        placeholder='https://linkedin.com/in/yourprofile'
                        value={
                          (formData as OrganizationFormData).linkedinProfile ||
                          ''
                        }
                        onChange={handleChange}
                        className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.linkedinProfile ? 'border-destructive' : ''}`}
                      />
                      {errors.linkedinProfile && (
                        <p className='text-sm text-destructive mt-1'>
                          {errors.linkedinProfile}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Address Line */}
              <div>
                <Label htmlFor='address' className='block mb-2 font-medium'>
                  Address Line <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='address'
                  placeholder='Enter your complete address'
                  value={formData.address}
                  onChange={handleChange}
                  className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.address ? 'border-destructive' : ''}`}
                  required
                />
                {errors.address && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* City and State */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='city' className='block mb-2 font-medium'>
                    City <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='city'
                    placeholder='Enter city name'
                    value={formData.city}
                    onChange={handleChange}
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.city ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.city && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='state' className='block mb-2 font-medium'>
                    State <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={value => handleSelectChange('state', value)}
                    required
                  >
                    <SelectTrigger
                      className={errors.state ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder='Select state' />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Pincode and Country */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='pincode' className='block mb-2 font-medium'>
                    Pincode <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='pincode'
                    placeholder='Enter 6-digit pincode'
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    pattern='[0-9]{6}'
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.pincode ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.pincode && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.pincode}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='country' className='block mb-2 font-medium'>
                    <div className='flex items-center gap-2'>
                      Country <span className='text-destructive'>*</span>
                      <TooltipWrapper content='Country cannot be changed'>
                        <HelpCircle className='h-4 w-4 text-gray-400' />
                      </TooltipWrapper>
                    </div>
                  </Label>
                  <Input
                    id='country'
                    value={formData.country}
                    disabled
                    className='bg-gray-50 cursor-not-allowed focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  />
                </div>
              </div>

              {/* Type of Workload - Always show */}
              <div>
                <Label
                  htmlFor='typeOfWorkload'
                  className='block mb-2 font-medium'
                >
                  Type of Workload <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.typeOfWorkload}
                  onValueChange={value =>
                    handleSelectChange('typeOfWorkload', value)
                  }
                  required
                >
                  <SelectTrigger
                    className={
                      errors.typeOfWorkload ? 'border-destructive' : ''
                    }
                  >
                    <SelectValue placeholder='Select your workload type' />
                  </SelectTrigger>
                  <SelectContent>
                    {workloadTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOfWorkload && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.typeOfWorkload}
                  </p>
                )}
              </div>

              {/* Organization-specific fields - Only show for existing users */}
              {isExistingUser && (
                <>
                  {/* Organisation Type */}
                  <div>
                    <Label
                      htmlFor='organizationType'
                      className='block mb-2 font-medium'
                    >
                      Organisation Type{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      value={
                        (formData as OrganizationFormData).organizationType ||
                        ''
                      }
                      onValueChange={value =>
                        handleSelectChange('organizationType', value)
                      }
                      required
                    >
                      <SelectTrigger
                        className={
                          errors.organizationType ? 'border-destructive' : ''
                        }
                      >
                        <SelectValue placeholder='Select organisation type' />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organizationType && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.organizationType}
                      </p>
                    )}
                  </div>

                  {/* Nature of Business */}
                  <div>
                    <Label
                      htmlFor='natureOfBusiness'
                      className='block mb-2 font-medium'
                    >
                      Nature of Business{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Textarea
                      id='natureOfBusiness'
                      placeholder='Describe your business activities and industry'
                      value={
                        (formData as OrganizationFormData).natureOfBusiness ||
                        ''
                      }
                      onChange={handleChange}
                      className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.natureOfBusiness ? 'border-destructive' : ''}`}
                      rows={3}
                      required
                    />
                    {errors.natureOfBusiness && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.natureOfBusiness}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={!hasChanges}
                className='hover:bg-secondary transition-colors'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className='bg-black text-white hover:bg-black/90 transition-colors'
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Panel - Right Side */}
      <div className='w-full md:w-80 space-y-6'>
        {/* Best Practices Panel */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-normal'>
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              <li className='flex items-start gap-2'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                <span
                  className='text-muted-foreground'
                  style={{ fontSize: '13px' }}
                >
                  Make sure your name and address are accurate, as they are used
                  for billing and invoicing.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                <span
                  className='text-muted-foreground'
                  style={{ fontSize: '13px' }}
                >
                  Choose the most relevant workload type to help us optimize
                  your cloud experience.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                <span
                  className='text-muted-foreground'
                  style={{ fontSize: '13px' }}
                >
                  Limit profile changes to prevent issues with billing, support,
                  and account tracking.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Action Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-normal'>
              {isNewUser ? 'Identity Verification' : 'Profile Completion'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {isNewUser
                ? 'Complete your identity verification to unlock full access to all cloud services and features.'
                : 'Complete your profile setup to unlock full access to all cloud services and features.'}
            </p>
            <Button
              onClick={
                isNewUser
                  ? handleVerifyIdentity
                  : () => {
                      // For existing users, save the form if there are changes, then complete
                      if (hasChanges) {
                        handleSave();
                      }
                      // Update profile status to mark as complete
                      updateProfileStatus({
                        basicInfoComplete: true,
                        identityVerified: true,
                      });
                      // Show success modal and trigger completion
                      setShowSuccessModal(true);
                      // Call the completion handler
                      if (onComplete) {
                        setTimeout(() => {
                          onComplete();
                        }, 1500); // Small delay to show success message
                      }
                    }
              }
              className='w-full bg-black text-white hover:bg-black/90 transition-colors'
              disabled={
                isNewUser
                  ? false
                  : !isProfileSaved && Object.keys(errors).length > 0
              }
            >
              {isNewUser ? 'Verify your identity' : 'Complete Profile'}
            </Button>
            {!isNewUser && hasChanges && (
              <p className='text-xs text-amber-600'>
                Save your changes first to complete your profile
              </p>
            )}
          </CardContent>
        </Card>

        {/* Change Password Button OUTSIDE the KYC card */}
        <Button
          type='button'
          onClick={() => setShowChangePasswordModal(true)}
          className='w-full bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors mt-4'
        >
          Change Password
        </Button>

        {/* Delete Account Link */}
        <button
          type='button'
          onClick={() => setShowDeleteAccountModal(true)}
          className='w-full text-center text-sm text-red-600 hover:text-red-700 underline transition-colors mt-3'
        >
          Delete Account
        </button>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className='p-0 bg-white max-w-md w-full overflow-hidden flex flex-col'>
          {/* Main Content */}
          <div className='flex-1 p-6 text-center'>
            <div className='space-y-6'>
              <Shield className='mx-auto h-16 w-16 text-green-600' />
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold'>
                  Profile Updated Successfully
                </h3>
                <p className='text-gray-600'>
                  Your profile details have been updated successfully and are
                  now saved to your account.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex-shrink-0 p-6 border-t bg-gray-50'>
            <div className='flex justify-center'>
              <Button
                onClick={handleSuccessModalClose}
                className='bg-black text-white hover:bg-black/90 px-8'
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Identity Verification Modal */}
      <Dialog
        open={showIdentityVerificationModal}
        onOpenChange={setShowIdentityVerificationModal}
      >
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
                userData={formData}
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
                  <h3 className='text-base font-semibold'>
                    Verification Tips:
                  </h3>
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

      {/* Change Password Modal */}
      <Dialog
        open={showChangePasswordModal}
        onOpenChange={isOpen => {
          setShowChangePasswordModal(isOpen);
          if (!isOpen) {
            setChangePasswordSuccess(false);
          } // Reset on close
        }}
      >
        <DialogContent className='p-0 bg-white max-w-md w-full overflow-hidden flex flex-col'>
          {/* Header */}
          <div className='flex-shrink-0 p-6 border-b'>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new password.
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Main Content */}
          {changePasswordSuccess ? (
            <div className='flex-1 p-8 flex flex-col items-center justify-center text-center'>
              <div className='mb-4'>
                <svg
                  className='mx-auto h-12 w-12 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                Password changed successfully!
              </h3>
              <p className='text-gray-600 mb-6'>
                Your password has been updated.
              </p>
              <Button
                type='button'
                className='bg-black text-white hover:bg-black/90 px-8'
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setChangePasswordSuccess(false);
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form
              className='flex-1 p-6 space-y-5'
              onSubmit={e => {
                e.preventDefault();
                setChangePasswordSuccess(true);
              }}
            >
              <div>
                <Label htmlFor='current-password'>Current Password</Label>
                <Input
                  id='current-password'
                  type='password'
                  required
                  autoComplete='current-password'
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='new-password'>New Password</Label>
                <Input
                  id='new-password'
                  type='password'
                  required
                  autoComplete='new-password'
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <Input
                  id='confirm-password'
                  type='password'
                  required
                  autoComplete='new-password'
                  className='mt-1'
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowChangePasswordModal(false)}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-black text-white hover:bg-black/90'
                >
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog
        open={showDeleteAccountModal}
        onOpenChange={isOpen => {
          setShowDeleteAccountModal(isOpen);
          if (!isOpen) {
            setDeleteConfirmText('');
          } // Reset on close
        }}
      >
        <DialogContent className='p-0 bg-white max-w-md w-full overflow-hidden flex flex-col'>
          {/* Header */}
          <div className='flex-shrink-0 p-6 border-b'>
            <DialogHeader>
              <DialogTitle className='text-red-600'>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please read carefully.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content */}
          <div className='flex-1 p-6 space-y-4'>
            {/* Warning Icon */}
            <div className='flex justify-center mb-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 18 18">
                <title>triangle-warning</title>
                <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" stroke="#dc2626">
                  <path d="M7.63796 3.48996L2.21295 12.89C1.60795 13.9399 2.36395 15.25 3.57495 15.25H14.425C15.636 15.25 16.392 13.9399 15.787 12.89L10.362 3.48996C9.75696 2.44996 8.24296 2.44996 7.63796 3.48996Z"></path>
                  <path d="M9 6.75V9.75"></path>
                  <path d="M9 13.5C8.448 13.5 8 13.05 8 12.5C8 11.95 8.448 11.5 9 11.5C9.552 11.5 10 11.9501 10 12.5C10 13.0499 9.552 13.5 9 13.5Z" fill="#dc2626" data-stroke="none" stroke="none"></path>
                </g>
              </svg>
            </div>

            {/* Warning Text */}
            <div className='space-y-3'>
              <div className='text-sm text-gray-700 text-center bg-red-50 p-4 rounded-lg border border-red-200'>
                <p className='leading-relaxed'>
                  All existing credits in your account will be lost and services including storage and computation will be terminated within the next 48 hours. Are you sure you want to go ahead with permanent deletion?
                </p>
              </div>

              {/* Support Contact */}
              <div className='text-sm text-center text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200'>
                <p>
                  Need help or have concerns?{' '}
                  <a
                    href='mailto:support@olakrutrim.com'
                    className='text-blue-600 hover:text-blue-700 font-medium underline'
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className='space-y-2 pt-2'>
              <Label htmlFor='delete-confirmation' className='text-sm font-medium'>
                Type <span className='font-mono font-bold text-red-600'>DELETE</span> to confirm:
              </Label>
              <Input
                id='delete-confirmation'
                type='text'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type DELETE here'
                className='font-mono'
                autoComplete='off'
              />
            </div>
          </div>

          {/* Footer */}
          <div className='flex-shrink-0 p-6 border-t bg-gray-50'>
            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText('');
                }}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='button'
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className='flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
