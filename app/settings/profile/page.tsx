'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { LogoutButton } from '@/components/auth/logout-button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const INDIAN_STATES = [
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

const ORGANIZATION_TYPES = [
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

const WORKLOAD_TYPES = [
  'Web Hosting',
  'Application Hosting',
  'Dev/Test Environments',
  'Big Data & Analytics',
  'Machine Learning / AI',
  'SaaS Application Hosting',
  'Backup & Disaster Recovery',
  'Others',
];

export default function ProfilePage() {
  // Detect user type based on account type
  // In a real app, this would come from auth context or user data
  // For demo, we'll use a default - you can change this for testing
  const accountType = 'individual'; // Change to "organization" to test existing user flow
  const isNewUser = accountType === 'individual';
  const isExistingUser = accountType === 'organization';

  const [formData, setFormData] = useState(() => {
    const baseData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '+91 9876543210',
      accountType: isNewUser ? 'Individual' : 'Organization',
      addressLine: '123 Tech Park, Silicon Valley',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      typeOfWorkload: isNewUser ? 'Web Hosting' : 'Application Hosting',
    };

    // Add organization-specific fields only for existing users
    if (isExistingUser) {
      return {
        ...baseData,
        companyName: 'Acme Inc.',
        website: 'https://acme.com',
        linkedinId: 'https://linkedin.com/in/johndoe',
        organizationType: 'Private Limited Companies',
        natureOfBusiness: 'Software Development and IT Services',
      };
    }

    return baseData;
  });

  const [originalData, setOriginalData] = useState({ ...formData });
  const [hasChanges, setHasChanges] = useState(false);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations for all users
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.typeOfWorkload) {
      newErrors.typeOfWorkload = 'Type of workload is required';
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Address line is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      newErrors.city = 'City should contain only alphabetic characters';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    // Additional validations for existing users (organizations)
    if (isExistingUser) {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = 'Company name is required';
      }

      if (!formData.organizationType) {
        newErrors.organizationType = 'Organization type is required';
      }

      if (!formData.natureOfBusiness?.trim()) {
        newErrors.natureOfBusiness = 'Nature of business is required';
      }

      // Optional field validations for organizations
      if (formData.website && !formData.website.startsWith('http')) {
        newErrors.website = 'Website must start with http:// or https://';
      }

      if (
        formData.linkedinId &&
        !formData.linkedinId.includes('linkedin.com')
      ) {
        newErrors.linkedinId = 'LinkedIn ID must be a valid LinkedIn URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive',
      });
      return;
    }

    // Save the form data
    setOriginalData({ ...formData });
    setHasChanges(false);

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully',
    });
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData({ ...originalData });
    setHasChanges(false);
    setErrors({});
  };

  return (
    <PageLayout
      title='Profile Settings'
      description='Manage your account profile and preferences'
    >
      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* First Name and Last Name */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>
                  First Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className='text-sm text-destructive'>{errors.firstName}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>
                  Last Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className='text-sm text-destructive'>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email and Mobile - View Only */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='email'>
                  <div className='flex items-center gap-2'>
                    Email ID <span className='text-destructive'>*</span>
                    <TooltipWrapper content='Email cannot be modified'>
                      <HelpCircle className='h-4 w-4 text-gray-400' />
                    </TooltipWrapper>
                  </div>
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  disabled
                  className='bg-gray-50 cursor-not-allowed'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='mobile'>
                  <div className='flex items-center gap-2'>
                    Mobile Number <span className='text-destructive'>*</span>
                    <TooltipWrapper content='Mobile number cannot be modified'>
                      <HelpCircle className='h-4 w-4 text-gray-400' />
                    </TooltipWrapper>
                  </div>
                </Label>
                <Input
                  id='mobile'
                  value={formData.mobile}
                  disabled
                  className='bg-gray-50 cursor-not-allowed'
                />
              </div>
            </div>

            {/* Account Type - Non-editable */}
            <div className='space-y-2'>
              <Label htmlFor='accountType'>
                <div className='flex items-center gap-2'>
                  Account Type <span className='text-destructive'>*</span>
                  <TooltipWrapper content='Account type cannot be changed'>
                    <HelpCircle className='h-4 w-4 text-gray-400' />
                  </TooltipWrapper>
                </div>
              </Label>
              <Input
                id='accountType'
                value={formData.accountType}
                disabled
                className='bg-gray-50 cursor-not-allowed'
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details and business information
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Company Name */}
            <div className='space-y-2'>
              <Label htmlFor='companyName'>
                Company Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='companyName'
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <p className='text-sm text-destructive'>{errors.companyName}</p>
              )}
            </div>

            {/* Website and LinkedIn ID */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='website'>
                  Website{' '}
                  <span className='text-muted-foreground'>(optional)</span>
                </Label>
                <Input
                  id='website'
                  placeholder='https://yourcompany.com'
                  value={formData.website}
                  onChange={handleChange}
                  className={errors.website ? 'border-destructive' : ''}
                />
                {errors.website && (
                  <p className='text-sm text-destructive'>{errors.website}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='linkedinId'>
                  LinkedIn ID{' '}
                  <span className='text-muted-foreground'>(optional)</span>
                </Label>
                <Input
                  id='linkedinId'
                  placeholder='https://linkedin.com/in/yourprofile'
                  value={formData.linkedinId}
                  onChange={handleChange}
                  className={errors.linkedinId ? 'border-destructive' : ''}
                />
                {errors.linkedinId && (
                  <p className='text-sm text-destructive'>
                    {errors.linkedinId}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Type and Type of Workload */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='organizationType'>
                  Organisation Type <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={value =>
                    handleSelectChange('organizationType', value)
                  }
                >
                  <SelectTrigger
                    className={
                      errors.organizationType ? 'border-destructive' : ''
                    }
                  >
                    <SelectValue placeholder='Select organisation type' />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organizationType && (
                  <p className='text-sm text-destructive'>
                    {errors.organizationType}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='typeOfWorkload'>
                  Type of Workload <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.typeOfWorkload}
                  onValueChange={value =>
                    handleSelectChange('typeOfWorkload', value)
                  }
                >
                  <SelectTrigger
                    className={
                      errors.typeOfWorkload ? 'border-destructive' : ''
                    }
                  >
                    <SelectValue placeholder='Select workload type' />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKLOAD_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOfWorkload && (
                  <p className='text-sm text-destructive'>
                    {errors.typeOfWorkload}
                  </p>
                )}
              </div>
            </div>

            {/* Nature of Business */}
            <div className='space-y-2'>
              <Label htmlFor='natureOfBusiness'>
                Nature of Business <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                id='natureOfBusiness'
                placeholder='Describe your business activities and industry'
                value={formData.natureOfBusiness}
                onChange={handleChange}
                rows={3}
                className={errors.natureOfBusiness ? 'border-destructive' : ''}
              />
              {errors.natureOfBusiness && (
                <p className='text-sm text-destructive'>
                  {errors.natureOfBusiness}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Update your address details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Address Line */}
            <div className='space-y-2'>
              <Label htmlFor='addressLine'>
                Address Line <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='addressLine'
                placeholder='Enter your complete address'
                value={formData.addressLine}
                onChange={handleChange}
                className={errors.addressLine ? 'border-destructive' : ''}
              />
              {errors.addressLine && (
                <p className='text-sm text-destructive'>{errors.addressLine}</p>
              )}
            </div>

            {/* City and State */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='city'>
                  City <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='city'
                  placeholder='Enter city name'
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className='text-sm text-destructive'>{errors.city}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>
                  State <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={value => handleSelectChange('state', value)}
                >
                  <SelectTrigger
                    className={errors.state ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder='Select state' />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className='text-sm text-destructive'>{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode and Country */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='pincode'>
                  Pincode <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='pincode'
                  placeholder='Enter 6-digit pincode'
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  pattern='[0-9]{6}'
                  className={errors.pincode ? 'border-destructive' : ''}
                />
                {errors.pincode && (
                  <p className='text-sm text-destructive'>{errors.pincode}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='country'>
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
                  className='bg-gray-50 cursor-not-allowed'
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={!hasChanges}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className='bg-primary hover:bg-primary/90'
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='current-password'>Current password</Label>
              <Input id='current-password' type='password' />
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='new-password'>New password</Label>
                <Input id='new-password' type='password' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Confirm password</Label>
                <Input id='confirm-password' type='password' />
              </div>
            </div>
            <Button>Update password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium'>Delete Account</h3>
                <p className='text-sm text-muted-foreground'>
                  Permanently delete your account and all of your content.
                </p>
              </div>
              <Button variant='destructive'>Delete Account</Button>
            </div>

            <Separator className='my-4' />

            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium'>Sign Out</h3>
                <p className='text-sm text-muted-foreground'>
                  Sign out of your account on this device.
                </p>
              </div>
              <LogoutButton variant='outline' />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
