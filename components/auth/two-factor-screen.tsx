'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TwoFactorScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'app' | 'sms'>('app');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedValue = value.slice(0, 6).split('');
      const newCode = [...code];

      pastedValue.forEach((char, i) => {
        if (i + index < 6) {
          newCode[i + index] = char;
        }
      });

      setCode(newCode);

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedValue.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user email for trust device screen
      const userEmail =
        sessionStorage.getItem('userEmail') || 'user@example.com';
      sessionStorage.setItem('userEmail', userEmail);

      console.log('2FA verification successful');
      // Navigate to trust device
      router.push('/auth/trust-device');
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(30);
    // Simulate resending code
    setTimeout(() => {
      // Show success message if needed
    }, 1000);
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex flex-col items-center'>
          {/* Krutrim Logo */}
          <div className='mb-6 flex justify-center'>
            <KrutrimLogo width={180} height={60} className='h-12' />
          </div>
        </div>

        <Card className='border-0 shadow-md'>
          <CardHeader className='space-y-1'>
            <div className='flex justify-center mb-4'>
              <div className='rounded-full bg-krutrim-green/10 p-3'>
                <Shield className='h-8 w-8 text-krutrim-green' />
              </div>
            </div>
            <CardTitle className='text-2xl font-bold text-center'>
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className='text-center'>
              Please enter the verification code to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue='app'
              className='w-full'
              onValueChange={value => setMethod(value as 'app' | 'sms')}
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='app'>Authenticator App</TabsTrigger>
                <TabsTrigger value='sms'>SMS</TabsTrigger>
              </TabsList>
              <TabsContent value='app'>
                <div className='mt-4 text-sm text-gray-600'>
                  Enter the 6-digit code from your authenticator app
                </div>
              </TabsContent>
              <TabsContent value='sms'>
                <div className='mt-4 text-sm text-gray-600'>
                  We sent a code to +1 (***) ***-**67
                </div>
              </TabsContent>
            </Tabs>

            <form className='mt-6 space-y-6' onSubmit={handleSubmit}>
              {error && (
                <div className='rounded-md bg-red-50 p-4'>
                  <p className='text-sm text-red-700'>{error}</p>
                </div>
              )}

              <div>
                <Label htmlFor='code-1' className='sr-only'>
                  Verification Code
                </Label>
                <div className='flex justify-between gap-2'>
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={() => {}}
                      id={`code-${index + 1}`}
                      type='text'
                      inputMode='numeric'
                      autoComplete='one-time-code'
                      pattern='[0-9]*'
                      maxLength={6}
                      className='h-12 w-12 text-center text-lg'
                      value={digit}
                      onChange={e => handleInputChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => router.push('/auth/signin')}
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  disabled={timeLeft > 0}
                  onClick={handleResendCode}
                  className='text-sm'
                >
                  {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend code'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type='submit'
              onClick={handleSubmit}
              className='w-full'
              variant='default'
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
