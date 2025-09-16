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
import { ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';

interface OrganizationBillingFormProps {
  onBack: () => void;
  onNext: () => void;
}

export function OrganizationBillingForm({
  onBack,
  onNext,
}: OrganizationBillingFormProps) {
  // Add a state field to the form data
  const [formData, setFormData] = useState({
    gstin: '',
    pan: '',
    organizationName: '',
    organizationType: '',
    website: '',
    socialProfile: '',
    natureOfBusiness: '',
    workLoad: '',
    state: '', // Add state field
    address: '', // Add address field
    city: '', // Add city field
    postalCode: '', // Add postal code field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      case 'gstin':
        if (!value) {
          error = 'GSTIN is required';
        } else if (
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            value
          )
        ) {
          error = 'Please enter a valid GSTIN';
        }
        break;

      case 'pan':
        if (!value) {
          error = 'PAN is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          error = 'Please enter a valid PAN';
        }
        break;

      case 'organizationName':
        if (!value) {
          error = 'Organization name is required';
        }
        break;

      case 'organizationType':
        if (!value) {
          error = 'Please select an organization type';
        }
        break;

      // Add validation for state field
      case 'state':
        if (!value) {
          error = 'State is required';
        }
        break;

      case 'natureOfBusiness':
        if (!value) {
          error = 'Nature of business is required';
        } else if (value.length < 10) {
          error = 'Please provide more details about your business';
        }
        break;

      case 'workLoad':
        if (!value) {
          error = 'Work load information is required';
        }
        break;

      case 'website':
        if (
          value &&
          !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/.test(value)
        ) {
          error = 'Please enter a valid website URL';
        }
        break;

      case 'socialProfile':
        if (
          value &&
          !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/.test(value)
        ) {
          error = 'Please enter a valid social profile URL';
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
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate each required field
    const requiredFields = [
      'gstin',
      'pan',
      'organizationName',
      'organizationType',
      'natureOfBusiness',
      'workLoad',
      'state',
    ];

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    // Validate optional fields if they have values
    const optionalFields = ['website', 'socialProfile'];
    optionalFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value && !validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const organizationTypes = ['Company', 'Partnership', 'Proprietorship', 'LLP'];

  // Add indianStates array if it doesn't exist
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
    <div className='p-8'>
      <h2 className='text-2xl font-bold'>Organization Billing Information</h2>
      <p className='text-gray-600 mt-2 mb-6'>
        Please provide your organization details. This information will be used
        for invoicing.
      </p>

      <div className='space-y-6'>
        {/* GSTIN Field */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='gstin'>
              GSTIN <span className='text-red-500'>*</span>
            </Label>
            <div className='flex items-center text-xs text-gray-500'>
              <HelpCircle className='h-3 w-3 mr-1' />
              <span>Format: 22AAAAA0000A1Z5 (e.g., 29ABCDE1234F1Z5)</span>
            </div>
          </div>
          <Input
            id='gstin'
            value={formData.gstin}
            onChange={e => handleInputChange('gstin', e.target.value)}
            onBlur={() => handleBlur('gstin')}
            className={errors.gstin && touched.gstin ? 'border-red-500' : ''}
            placeholder='29ABCDE1234F1Z5'
          />
          {errors.gstin && touched.gstin && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.gstin}
            </div>
          )}
        </div>

        {/* PAN Field */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='pan'>
              PAN <span className='text-red-500'>*</span>
            </Label>
            <div className='flex items-center text-xs text-gray-500'>
              <HelpCircle className='h-3 w-3 mr-1' />
              <span>Format: AAAAA0000A (e.g., ABCDE1234F)</span>
            </div>
          </div>
          <Input
            id='pan'
            value={formData.pan}
            onChange={e => handleInputChange('pan', e.target.value)}
            onBlur={() => handleBlur('pan')}
            className={errors.pan && touched.pan ? 'border-red-500' : ''}
            placeholder='ABCDE1234F'
          />
          {errors.pan && touched.pan && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.pan}
            </div>
          )}
        </div>

        {/* Organization Name */}
        <div className='space-y-2'>
          <Label htmlFor='organizationName'>
            Organization Name <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='organizationName'
            value={formData.organizationName}
            onChange={e =>
              handleInputChange('organizationName', e.target.value)
            }
            onBlur={() => handleBlur('organizationName')}
            className={
              errors.organizationName && touched.organizationName
                ? 'border-red-500'
                : ''
            }
          />
          {errors.organizationName && touched.organizationName && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.organizationName}
            </div>
          )}
        </div>

        {/* Organization Type */}
        <div className='space-y-2'>
          <Label htmlFor='organizationType'>
            Organization Type <span className='text-red-500'>*</span>
          </Label>
          <Select
            value={formData.organizationType}
            onValueChange={value =>
              handleInputChange('organizationType', value)
            }
            onOpenChange={() => handleBlur('organizationType')}
          >
            <SelectTrigger
              className={
                errors.organizationType && touched.organizationType
                  ? 'border-red-500'
                  : ''
              }
            >
              <SelectValue placeholder='Select organization type' />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationType && touched.organizationType && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.organizationType}
            </div>
          )}
        </div>

        {/* Add a State dropdown with search functionality after Organization Type */}
        <div className='space-y-2'>
          <Label htmlFor='state'>
            State <span className='text-red-500'>*</span>
          </Label>
          <Select
            value={formData.state}
            onValueChange={value => handleInputChange('state', value)}
            onOpenChange={() => handleBlur('state')}
          >
            <SelectTrigger
              className={errors.state && touched.state ? 'border-red-500' : ''}
            >
              <SelectValue placeholder='Select state' />
            </SelectTrigger>
            <SelectContent>
              <div className='px-3 pb-2'>
                <Input
                  placeholder='Search states...'
                  className='h-9 mb-2'
                  onChange={e => {
                    // This would filter the dropdown items in a real implementation
                    console.log('Searching for:', e.target.value);
                  }}
                />
              </div>
              {indianStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && touched.state && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.state}
            </div>
          )}
        </div>

        {/* Website and Social Profile */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='website'>Website</Label>
            <Input
              id='website'
              value={formData.website}
              onChange={e => handleInputChange('website', e.target.value)}
              onBlur={() => handleBlur('website')}
              placeholder='https://example.com'
              className={
                errors.website && touched.website ? 'border-red-500' : ''
              }
            />
            {errors.website && touched.website && (
              <div className='flex items-center mt-1 text-red-500 text-sm'>
                <AlertCircle className='h-4 w-4 mr-1' />
                {errors.website}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='socialProfile'>Social Profile</Label>
            <Input
              id='socialProfile'
              value={formData.socialProfile}
              onChange={e => handleInputChange('socialProfile', e.target.value)}
              onBlur={() => handleBlur('socialProfile')}
              placeholder='https://linkedin.com/company/example'
              className={
                errors.socialProfile && touched.socialProfile
                  ? 'border-red-500'
                  : ''
              }
            />
            {errors.socialProfile && touched.socialProfile && (
              <div className='flex items-center mt-1 text-red-500 text-sm'>
                <AlertCircle className='h-4 w-4 mr-1' />
                {errors.socialProfile}
              </div>
            )}
          </div>
        </div>

        {/* Nature of Business */}
        <div className='space-y-2'>
          <Label htmlFor='natureOfBusiness'>
            Nature of Business <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='natureOfBusiness'
            value={formData.natureOfBusiness}
            onChange={e =>
              handleInputChange('natureOfBusiness', e.target.value)
            }
            onBlur={() => handleBlur('natureOfBusiness')}
            rows={3}
            placeholder="Describe your organization's primary business activities"
            className={
              errors.natureOfBusiness && touched.natureOfBusiness
                ? 'border-red-500'
                : ''
            }
          />
          {errors.natureOfBusiness && touched.natureOfBusiness && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.natureOfBusiness}
            </div>
          )}
        </div>

        {/* Work Load */}
        <div className='space-y-2'>
          <Label htmlFor='workLoad'>
            Work Load <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='workLoad'
            value={formData.workLoad}
            onChange={e => handleInputChange('workLoad', e.target.value)}
            onBlur={() => handleBlur('workLoad')}
            rows={3}
            placeholder='Describe your expected workload on Krutrim Cloud Platform'
            className={
              errors.workLoad && touched.workLoad ? 'border-red-500' : ''
            }
          />
          {errors.workLoad && touched.workLoad && (
            <div className='flex items-center mt-1 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.workLoad}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between mt-10'>
        <Button
          variant='outline'
          onClick={onBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>

        <Button onClick={handleSubmit} variant='default'>
          Next
        </Button>
      </div>
    </div>
  );
}
