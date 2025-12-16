'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';

interface SignUpFormProps {
  onNext?: (formData: {
    organisationName: string;
    fullName: string;
    email: string;
    mobile: string;
  }) => void;
}

export function SignUpForm({ onNext }: SignUpFormProps) {
  const router = useRouter();
  const { setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organisationName: '',
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    organisationName?: string;
    fullName?: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  // Password strength criteria
  const passwordCriteria = [
    {
      id: 'length',
      label: 'At least 8 characters',
      test: (p: string) => p.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter',
      test: (p: string) => /[A-Z]/.test(p),
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter',
      test: (p: string) => /[a-z]/.test(p),
    },
    {
      id: 'number',
      label: 'At least one number',
      test: (p: string) => /[0-9]/.test(p),
    },
    {
      id: 'special',
      label: 'At least one special character',
      test: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  const getPasswordStrength = (password: string) => {
    if (!password) {
      return 0;
    }
    return passwordCriteria.filter(c => c.test(password)).length;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 1) {
      return 'Very weak';
    }
    if (strength === 2) {
      return 'Weak';
    }
    if (strength === 3) {
      return 'Medium';
    }
    if (strength === 4) {
      return 'Strong';
    }
    return 'Very strong';
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) {
      return 'bg-gray-200';
    }
    if (strength === 1) {
      return 'bg-red-500';
    }
    if (strength === 2) {
      return 'bg-orange-500';
    }
    if (strength === 3) {
      return 'bg-yellow-500';
    }
    if (strength === 4) {
      return 'bg-gray-600';
    }
    return 'bg-green-500';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate form
    const newErrors: {
      organisationName?: string;
      fullName?: string;
      email?: string;
      mobile?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
      general?: string;
    } = {};

    if (!formData.organisationName.trim()) {
      newErrors.organisationName = 'Organisation name is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms =
        'You must accept the Terms of Service and Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with sign up
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data in auth context
      setUserData({ name: formData.fullName });

      // For demo purposes, we'll just move to the next step
      if (onNext) {
        onNext({
          organisationName: formData.organisationName,
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
        });
      } else {
        // Fallback to original behavior if not in multi-step flow
        router.push('/auth/signin');
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred during sign up. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className='p-6 md:p-8'>
      <div className='w-full max-w-md mx-auto space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Sign up for Krutrim Cloud Platform
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Create your Krutrim Cloud account to access high-performance
            computing services
          </p>
        </div>

        <div>
          <form className='space-y-5' onSubmit={handleSubmit}>
            {errors.general && (
              <div className='rounded-md bg-red-50 p-4'>
                <p className='text-sm text-red-700'>{errors.general}</p>
              </div>
            )}
            <div>
              <Label
                htmlFor='organisationName'
                className='block text-sm font-medium text-gray-700'
              >
                Organisation name
              </Label>
              <Input
                id='organisationName'
                name='organisationName'
                type='text'
                autoComplete='organization'
                value={formData.organisationName}
                onChange={handleChange}
                className={cn(
                  'mt-1',
                  errors.organisationName && 'border-red-300 focus-visible:ring-red-500'
                )}
                placeholder='Your Organisation Name'
              />
              {errors.organisationName && (
                <p className='mt-1 text-sm text-red-600'>{errors.organisationName}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor='fullName'
                className='block text-sm font-medium text-gray-700'
              >
                Full Name
              </Label>
              <Input
                id='fullName'
                name='fullName'
                type='text'
                autoComplete='name'
                value={formData.fullName}
                onChange={handleChange}
                className={cn(
                  'mt-1',
                  errors.fullName && 'border-red-300 focus-visible:ring-red-500'
                )}
                placeholder='John Doe'
              />
              {errors.fullName && (
                <p className='mt-1 text-sm text-red-600'>{errors.fullName}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'mt-1',
                  errors.email && 'border-red-300 focus-visible:ring-red-500'
                )}
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
                Mobile Number
              </Label>
              <div className='relative mt-1'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <span className='text-gray-500 sm:text-sm'>+91</span>
                </div>
                <Input
                  id='mobile'
                  name='mobile'
                  type='tel'
                  autoComplete='tel'
                  value={formData.mobile}
                  onChange={handleChange}
                  className={cn(
                    'pl-12',
                    errors.mobile && 'border-red-300 focus-visible:ring-red-500'
                  )}
                  placeholder='9876543210'
                  maxLength={10}
                />
              </div>
              {errors.mobile && (
                <p className='mt-1 text-sm text-red-600'>{errors.mobile}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </Label>
              <div className='relative mt-1'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    'pr-10',
                    errors.password &&
                      'border-red-300 focus-visible:ring-red-500'
                  )}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {formData.password && (
                <div className='mt-2'>
                  <div className='mb-1 flex items-center justify-between'>
                    <div className='flex h-2 w-full overflow-hidden rounded-full bg-gray-200'>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-full w-1/5',
                            i < passwordStrength
                              ? getPasswordStrengthColor(passwordStrength)
                              : 'bg-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className='ml-2 text-xs font-medium text-gray-700'>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>

                  <div className='mt-2 space-y-1'>
                    {passwordCriteria.map(criterion => (
                      <div
                        key={criterion.id}
                        className='flex items-center text-xs'
                      >
                        {criterion.test(formData.password) ? (
                          <Check size={12} className='mr-1 text-green-500' />
                        ) : (
                          <X size={12} className='mr-1 text-gray-400' />
                        )}
                        <span
                          className={
                            criterion.test(formData.password)
                              ? 'text-green-700'
                              : 'text-gray-500'
                          }
                        >
                          {criterion.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                Confirm Password
              </Label>
              <div className='relative mt-1'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    'pr-10',
                    errors.confirmPassword &&
                      'border-red-300 focus-visible:ring-red-500'
                  )}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-start'>
                <Checkbox
                  id='terms'
                  checked={acceptTerms}
                  onCheckedChange={checked =>
                    setAcceptTerms(checked as boolean)
                  }
                  className='mt-0.5'
                />
                <Label
                  htmlFor='terms'
                  className='ml-2 block text-sm text-gray-700'
                >
                  I accept the{' '}
                  <Link
                    href='#'
                    className='font-medium text-gray-900 hover:text-gray-800'
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='#'
                    className='font-medium text-gray-900 hover:text-gray-800'
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {errors.terms && (
                <p className='mt-1 text-sm text-red-600'>{errors.terms}</p>
              )}
            </div>
            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 text-white'
              disabled={isLoading}
            >
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Sign Up <ArrowRight className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className='text-center text-sm'>
          Already registered?{' '}
          <Link
            href='/auth/signin'
            className='font-medium text-gray-900 hover:text-gray-800'
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
