'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, ArrowLeft, Save, X } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  mobile: string;
  accountType: 'individual' | 'organization';
  companyName?: string;
}

interface BasicInfoSectionProps {
  userData: UserData;
  onComplete: () => void;
  onCancel: () => void;
}

export function BasicInfoSection({
  userData,
  onComplete,
  onCancel,
}: BasicInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile,
    companyName: userData.companyName || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!editData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(editData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (
      userData.accountType === 'organization' &&
      !editData.companyName.trim()
    ) {
      newErrors.companyName = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would update the user data here
      setIsEditing(false);
      onComplete();
    } catch (error) {
      console.error('Error updating basic info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      companyName: userData.companyName || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-2xl mx-auto'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl'>
                  Edit Basic Information
                </CardTitle>
                <Button
                  variant='outline'
                  onClick={handleCancel}
                  className='flex items-center gap-2'
                >
                  <X className='h-4 w-4' />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  value={editData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`mt-1 ${errors.name ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                  placeholder='John Doe'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={editData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`mt-1 ${errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                  placeholder='you@example.com'
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor='mobile'
                  className='block text-sm font-medium text-gray-700'
                >
                  Mobile Number <span className='text-red-500'>*</span>
                </Label>
                <div className='relative mt-1'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <span className='text-gray-500 sm:text-sm'>+91</span>
                  </div>
                  <Input
                    id='mobile'
                    value={editData.mobile}
                    onChange={e => handleInputChange('mobile', e.target.value)}
                    className={`pl-12 ${errors.mobile ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                    placeholder='9876543210'
                    maxLength={10}
                  />
                </div>
                {errors.mobile && (
                  <p className='mt-1 text-sm text-red-600'>{errors.mobile}</p>
                )}
              </div>

              {userData.accountType === 'organization' && (
                <div>
                  <Label
                    htmlFor='companyName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Company Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='companyName'
                    value={editData.companyName}
                    onChange={e =>
                      handleInputChange('companyName', e.target.value)
                    }
                    className={`mt-1 ${errors.companyName ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                    placeholder='Your Company Name'
                  />
                  {errors.companyName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.companyName}
                    </p>
                  )}
                </div>
              )}

              <div className='flex justify-between pt-4'>
                <Button
                  variant='outline'
                  onClick={onCancel}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to Profile
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className='bg-primary hover:bg-primary/90 text-white flex items-center gap-2'
                >
                  <Save className='h-4 w-4' />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='h-6 w-6 text-green-600' />
                <CardTitle className='text-xl'>Basic Information</CardTitle>
                <Badge className='bg-green-100 text-green-800 border-green-200'>
                  Complete
                </Badge>
              </div>
              <Button
                variant='outline'
                onClick={() => setIsEditing(true)}
                className='flex items-center gap-2'
              >
                <Edit className='h-4 w-4' />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label className='text-sm font-medium text-gray-500'>
                  Full Name
                </Label>
                <p className='mt-1 text-lg font-semibold text-gray-900'>
                  {userData.name}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-500'>
                  Account Type
                </Label>
                <p className='mt-1 text-lg font-semibold text-gray-900 capitalize'>
                  {userData.accountType}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-500'>
                  Email Address
                </Label>
                <p className='mt-1 text-lg font-semibold text-gray-900'>
                  {userData.email}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-500'>
                  Mobile Number
                </Label>
                <p className='mt-1 text-lg font-semibold text-gray-900'>
                  +91 {userData.mobile}
                </p>
              </div>

              {userData.accountType === 'organization' &&
                userData.companyName && (
                  <div className='md:col-span-2'>
                    <Label className='text-sm font-medium text-gray-500'>
                      Company Name
                    </Label>
                    <p className='mt-1 text-lg font-semibold text-gray-900'>
                      {userData.companyName}
                    </p>
                  </div>
                )}
            </div>

            <div className='flex justify-between pt-4'>
              <Button
                variant='outline'
                onClick={onCancel}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Profile
              </Button>

              <Button
                onClick={onComplete}
                className='bg-green-600 hover:bg-green-700 text-white'
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
