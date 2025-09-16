'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';

interface IndividualBillingFormProps {
  onBack: () => void;
  onNext: () => void;
}

export function IndividualBillingForm({
  onBack,
  onNext,
}: IndividualBillingFormProps) {
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    gstin: '',
    noGstin: false,
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [panError, setPanError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear PAN error when user types
    if (field === 'pan') {
      setPanError(null);
    }

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
      case 'pan':
        if (!value) {
          error = 'PAN is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          error = 'Please enter a valid PAN';
        } else if (value === 'ABCDE1234F') {
          setPanError(
            'The PAN you entered is not of a Person. Kindly sign up as an Organization.'
          );
          return false;
        }
        break;

      case 'aadhaar':
        if (!value) {
          error = 'Aadhaar number is required';
        } else if (!/^\d{12}$/.test(value)) {
          error = 'Please enter a valid 12-digit Aadhaar number';
        }
        break;

      case 'gstin':
        if (!formData.noGstin && !value) {
          error = "GSTIN is required unless you don't have one";
        } else if (
          !formData.noGstin &&
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            value
          )
        ) {
          error = 'Please enter a valid GSTIN';
        }
        break;

      case 'address':
        if (!value) {
          error = 'Address is required';
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      noGstin: checked,
      gstin: checked ? '' : prev.gstin,
    }));

    // Clear GSTIN error if checkbox is checked
    if (checked && errors.gstin) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gstin;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // This is a mock validation - in a real app, you'd have proper validation
    if (formData.pan === 'ABCDE1234F') {
      setPanError(
        'The PAN you entered is not of a Person. Kindly sign up as an Organization.'
      );
      return false;
    }

    // Validate each required field
    const requiredFields = [
      'address',
      'city',
      'state',
      'postalCode',
      'aadhaar',
    ];
    let isValid = true;

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    // Validate GSTIN only if noGstin is false
    if (!formData.noGstin && !validateField('gstin', formData.gstin)) {
      isValid = false;
    }

    // Validate PAN if provided
    if (formData.pan && !validateField('pan', formData.pan)) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
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
    <div className='p-8'>
      <h2 className='text-2xl font-bold'>Billing Information</h2>
      <p className='text-gray-600 mt-2 mb-6'>
        Please provide your billing details. This information will be used for
        invoicing.
      </p>

      <div className='space-y-6'>
        {/* Aadhaar Field - Now placed first */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='aadhaar'>
              Aadhaar Number <span className='text-red-500'>*</span>
            </Label>
            <div className='flex items-center text-xs text-gray-500'>
              <HelpCircle className='h-3 w-3 mr-1' />
              <span>Format: 12 digits (e.g., 123456789012)</span>
            </div>
          </div>
          <Input
            id='aadhaar'
            value={formData.aadhaar}
            onChange={e => handleInputChange('aadhaar', e.target.value)}
            onBlur={() => handleBlur('aadhaar')}
            className={
              errors.aadhaar && touched.aadhaar ? 'border-red-500' : ''
            }
            placeholder='123456789012'
            maxLength={12}
          />
          {errors.aadhaar && touched.aadhaar && (
            <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
              <AlertCircle className='h-4 w-4' />
              <span>{errors.aadhaar}</span>
            </div>
          )}
        </div>

        {/* PAN Field - Now placed second */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='pan'>PAN</Label>
            <div className='flex items-center text-xs text-gray-500'>
              <HelpCircle className='h-3 w-3 mr-1' />
              <span>Format: AAAAA0000A (e.g., ABCPX1234Y)</span>
            </div>
          </div>
          <Input
            id='pan'
            value={formData.pan}
            onChange={e => handleInputChange('pan', e.target.value)}
            onBlur={() => handleBlur('pan')}
            className={
              panError || (errors.pan && touched.pan) ? 'border-red-500' : ''
            }
            placeholder='ABCPX1234Y'
          />
          {panError && (
            <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
              <AlertCircle className='h-4 w-4' />
              <span>{panError}</span>
            </div>
          )}
          {errors.pan && touched.pan && !panError && (
            <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
              <AlertCircle className='h-4 w-4' />
              <span>{errors.pan}</span>
            </div>
          )}
        </div>

        {/* GSTIN Field */}
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Label htmlFor='gstin'>GSTIN</Label>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='no-gstin'
                checked={formData.noGstin}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor='no-gstin' className='text-sm cursor-pointer'>
                I do not have GSTIN
              </label>
            </div>
          </div>
          {!formData.noGstin && (
            <div className='flex items-center text-xs text-gray-500 mb-1'>
              <HelpCircle className='h-3 w-3 mr-1' />
              <span>Format: 22AAAAA0000A1Z5 (e.g., 29ABCPX1234Y1Z5)</span>
            </div>
          )}
          <Input
            id='gstin'
            value={formData.gstin}
            onChange={e => handleInputChange('gstin', e.target.value)}
            onBlur={() => handleBlur('gstin')}
            disabled={formData.noGstin}
            className={errors.gstin && touched.gstin ? 'border-red-500' : ''}
            placeholder='29ABCPX1234Y1Z5'
          />
          {errors.gstin && touched.gstin && (
            <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
              <AlertCircle className='h-4 w-4' />
              <span>{errors.gstin}</span>
            </div>
          )}
        </div>

        {/* Address Field */}
        <div className='space-y-2'>
          <Label htmlFor='address'>
            Address <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='address'
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            rows={3}
            className={
              errors.address && touched.address ? 'border-red-500' : ''
            }
          />
          {errors.address && touched.address && (
            <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
              <AlertCircle className='h-4 w-4' />
              <span>{errors.address}</span>
            </div>
          )}
        </div>

        {/* City and State */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='city'>
              City <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='city'
              value={formData.city}
              onChange={e => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={errors.city && touched.city ? 'border-red-500' : ''}
            />
            {errors.city && touched.city && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.city}</span>
              </div>
            )}
          </div>

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
                className={
                  errors.state && touched.state ? 'border-red-500' : ''
                }
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
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.state}</span>
              </div>
            )}
          </div>
        </div>

        {/* Postal Code and Country */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='postalCode'>
              Postal Code <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='postalCode'
              value={formData.postalCode}
              onChange={e => handleInputChange('postalCode', e.target.value)}
              onBlur={() => handleBlur('postalCode')}
              className={
                errors.postalCode && touched.postalCode ? 'border-red-500' : ''
              }
              placeholder='560001'
            />
            {errors.postalCode && touched.postalCode && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.postalCode}</span>
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='country'>Country</Label>
            <Input
              id='country'
              value={formData.country}
              readOnly
              className='bg-gray-100'
            />
          </div>
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

        <Button
          onClick={handleSubmit}
          className='bg-black hover:bg-gray-800 text-white'
        >
          Next
        </Button>
      </div>
    </div>
  );
}
