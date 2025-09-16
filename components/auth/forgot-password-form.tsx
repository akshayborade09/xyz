'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import { cn } from '@/lib/utils';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Proceed with password reset request
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      setError('An error occurred. Please try again.');
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

        <Card className='shadow-lg'>
          <CardContent className='p-6 md:p-8'>
            {!isSubmitted ? (
              <>
                <div className='text-center mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Reset Your Password
                  </h2>
                  <p className='mt-2 text-sm text-gray-600'>
                    Enter your email address and we'll send you a link to reset
                    your password
                  </p>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={cn(
                        'mt-1',
                        error && 'border-red-300 focus-visible:ring-red-500'
                      )}
                      placeholder='you@example.com'
                      disabled={isLoading}
                    />
                    {error && (
                      <p className='mt-1 text-sm text-red-600'>{error}</p>
                    )}
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-black hover:bg-gray-800 text-white'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'Processing...'
                    ) : (
                      <>
                        Reset Password <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className='text-center py-4'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-5'>
                  <svg
                    className='h-8 w-8 text-green-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Check Your Email
                </h3>
                <p className='mt-3 text-sm text-gray-600'>
                  We've sent a password reset link to{' '}
                  <span className='font-medium'>{email}</span>. The link will
                  expire in 30 minutes.
                </p>

                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <p className='text-sm text-gray-600'>
                    Didn't receive the email?
                  </p>
                  <button
                    type='button'
                    onClick={() => {
                      setIsLoading(true);
                      // Simulate resending
                      setTimeout(() => setIsLoading(false), 1000);
                    }}
                    className='mt-2 text-sm font-medium text-black hover:text-gray-700 inline-flex items-center'
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend Link'}
                  </button>
                </div>

                <p className='mt-4 text-xs text-gray-500'>
                  If you don't see the email, check your spam folder
                </p>

                <Button
                  className='w-full mt-6 bg-black hover:bg-gray-800 text-white'
                  onClick={() => (window.location.href = '/auth/signin')}
                >
                  Back to Sign In
                </Button>
              </div>
            )}

            {!isSubmitted && (
              <div className='mt-6 text-center'>
                <Link
                  href='/auth/signin'
                  className='text-sm font-medium text-black hover:text-gray-700 inline-flex items-center'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Sign In
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
