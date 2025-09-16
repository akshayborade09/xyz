'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface AddressData {
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'India'; // readonly
}

interface OrganizationAddressData extends AddressData {
  companyName: string;
}

interface AddressCollectionProps {
  accountType: 'individual' | 'organization';
  onBack: () => void;
  onNext: () => void;
}

export function AddressCollection({
  accountType,
  onBack,
  onNext,
}: AddressCollectionProps) {
  const [formData, setFormData] = useState<OrganizationAddressData>({
    companyName: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'companyName':
        if (accountType === 'organization' && !value) {
          error = 'Company name is required';
        }
        break;

      case 'addressLine':
        if (!value) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Please provide a complete address';
        }
        break;

      case 'city':
        if (!value) {
          error = 'City is required';
        }
        break;

      case 'state':
        if (!value) {
          error = 'State is required';
        }
        break;

      case 'postalCode':
        if (!value) {
          error = 'Postal code is required';
        } else if (!/^\d{6}$/.test(value)) {
          error = 'Please enter a valid 6-digit postal code';
        }
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return false;
    }

    return true;
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    let isValid = true;
    const requiredFields = ['addressLine', 'city', 'state', 'postalCode'];

    // Add company name to required fields for organizations
    if (accountType === 'organization') {
      requiredFields.push('companyName');
    }

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onNext();
    } catch (error) {
      console.error('Error saving address', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  ];

  return (
    <div className='p-6 md:p-8'>
      <div className='w-full max-w-md mx-auto'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {accountType === 'organization' ? 'Company' : 'Your'} Address
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Please provide your{' '}
            {accountType === 'organization' ? 'company' : 'residential'} address
            for account setup.
          </p>
        </div>

        <div className='space-y-5'>
          {accountType === 'organization' && (
            <div>
              <Label
                htmlFor='companyName'
                className='block text-sm font-medium text-gray-700'
              >
                Company Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='companyName'
                value={formData.companyName}
                onChange={e => handleInputChange('companyName', e.target.value)}
                onBlur={() => handleBlur('companyName')}
                className={`mt-1 ${errors.companyName && touched.companyName ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                placeholder='Enter your company name'
              />
              {errors.companyName && touched.companyName && (
                <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                  <AlertCircle className='h-4 w-4' />
                  <span>{errors.companyName}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <Label
              htmlFor='addressLine'
              className='block text-sm font-medium text-gray-700'
            >
              Address <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='addressLine'
              value={formData.addressLine}
              onChange={e => handleInputChange('addressLine', e.target.value)}
              onBlur={() => handleBlur('addressLine')}
              className={`mt-1 min-h-[80px] ${errors.addressLine && touched.addressLine ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
              placeholder='House/Flat No., Building Name, Street, Area'
            />
            {errors.addressLine && touched.addressLine && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.addressLine}</span>
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='city'
                className='block text-sm font-medium text-gray-700'
              >
                City <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='city'
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                className={`mt-1 ${errors.city && touched.city ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                placeholder='City'
              />
              {errors.city && touched.city && (
                <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                  <AlertCircle className='h-4 w-4' />
                  <span>{errors.city}</span>
                </div>
              )}
            </div>

            <div>
              <Label
                htmlFor='postalCode'
                className='block text-sm font-medium text-gray-700'
              >
                Postal Code <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='postalCode'
                value={formData.postalCode}
                onChange={e => handleInputChange('postalCode', e.target.value)}
                onBlur={() => handleBlur('postalCode')}
                className={`mt-1 ${errors.postalCode && touched.postalCode ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                placeholder='123456'
                maxLength={6}
              />
              {errors.postalCode && touched.postalCode && (
                <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                  <AlertCircle className='h-4 w-4' />
                  <span>{errors.postalCode}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor='state'
              className='block text-sm font-medium text-gray-700'
            >
              State <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.state}
              onValueChange={value => handleInputChange('state', value)}
            >
              <SelectTrigger
                className={`mt-1 ${errors.state && touched.state ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
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
            {errors.state && touched.state && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.state}</span>
              </div>
            )}
          </div>

          <div>
            <Label
              htmlFor='country'
              className='block text-sm font-medium text-gray-700'
            >
              Country
            </Label>
            <Input
              id='country'
              value={formData.country}
              disabled
              className='mt-1 bg-gray-50'
            />
          </div>
        </div>

        <div className='flex justify-between mt-8'>
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
            disabled={isLoading}
            className='bg-primary hover:bg-primary/90 text-white px-8'
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
