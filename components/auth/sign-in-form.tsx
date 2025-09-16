'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import { cn } from '@/lib/utils';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onComplete: (email: string) => void;
}

export function SignInForm({
  className,
  onComplete,
  ...props
}: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // Authentication helper functions
  const setUserAuthData = (email: string) => {
    try {
      const userInfo = {
        name: email.split('@')[0], // Extract name from email as fallback
        email: email,
        mobile: '', // Will be empty for sign-in
        accountType: 'organization', // Default for existing users signing in
        signinCompletedAt: new Date().toISOString(),
      };
      document.cookie = `user_data=${JSON.stringify(userInfo)}; path=/; max-age=86400`;
      console.log('User auth data set successfully for sign-in');
    } catch (error) {
      console.error('Error setting user auth data:', error);
    }
  };

  const setAccessLevel = (level: 'full' = 'full') => {
    try {
      console.log('Setting access level for sign-in:', level);
      localStorage.setItem('accessLevel', level);

      // Set authentication cookie for middleware
      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`; // 24 hours

      // Set user profile status cookie for middleware - assume full access for existing users
      const profileStatus = {
        basicInfoComplete: true,
        identityVerified: true,
        paymentSetupComplete: true,
      };
      document.cookie = `user_profile_status=${JSON.stringify(profileStatus)}; path=/; max-age=86400`;

      console.log('Access level set successfully for sign-in');
    } catch (error) {
      console.error('Error setting access level:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call onComplete with the email
      onComplete(formData.email);
    } catch (error) {
      console.error('Sign-in error:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        <div className='flex justify-center mb-8'>
          <KrutrimLogo width={180} height={60} className='h-12' href={null} />
        </div>

        <Card className='shadow-sm'>
          <CardContent className='p-6 md:p-8'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Sign in to Krutrim Cloud
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                Enter your credentials to access your account
              </p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
              {errors.general && (
                <div className='rounded-md bg-red-50 p-4'>
                  <p className='text-sm text-red-700'>{errors.general}</p>
                </div>
              )}

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
                <div className='flex items-center justify-between'>
                  <Label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Password
                  </Label>
                  <Link
                    href='/auth/forgot-password'
                    className='text-sm font-medium text-gray-600 hover:text-gray-800'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative mt-1'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
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
                {errors.password && (
                  <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
                )}
              </div>

              <div className='flex items-center'>
                <Checkbox
                  id='remember-me'
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Remember me
                </Label>
              </div>

              <Button
                type='submit'
                className='w-full'
                variant='default'
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In <ArrowRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>
            </form>

            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3'>
                <Button variant='outline' className='w-full'>
                  <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                    <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                      <path
                        fill='#4285F4'
                        d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
                      />
                      <path
                        fill='#34A853'
                        d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
                      />
                      <path
                        fill='#FBBC05'
                        d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
                      />
                      <path
                        fill='#EA4335'
                        d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
                      />
                    </g>
                  </svg>
                  Google
                </Button>
                <Button variant='outline' className='w-full'>
                  <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                  Github
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
