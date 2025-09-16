'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Smartphone, Shield } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TwoFactorFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
  onComplete: () => void;
  onBack: () => void;
}

export function TwoFactorForm({
  className,
  email,
  onComplete,
  onBack,
  ...props
}: TwoFactorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'app' | 'sms'>('app');
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendCode = () => {
    // In a real app, you would call your API to resend the code
    setCountdown(30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would validate the code with your backend
      // This is just a simulation for the demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, we'll accept any code
      // In a real app, this would be where you verify the 2FA code
      onComplete();
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className='flex items-center'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='mr-2'
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className='h-4 w-4' />
          <span className='sr-only'>Back</span>
        </Button>
        <h2 className='text-lg font-semibold'>Two-Factor Authentication</h2>
      </div>

      <Tabs
        defaultValue='app'
        onValueChange={value => setMethod(value as 'app' | 'sms')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='app'>Authenticator App</TabsTrigger>
          <TabsTrigger value='sms'>SMS</TabsTrigger>
        </TabsList>
        <TabsContent value='app' className='mt-4'>
          <div className='flex items-center justify-center mb-4'>
            <Shield className='h-12 w-12 text-primary' />
          </div>
          <p className='text-sm text-center mb-4'>
            Enter the 6-digit code from your authenticator app
          </p>
        </TabsContent>
        <TabsContent value='sms' className='mt-4'>
          <div className='flex items-center justify-center mb-4'>
            <Smartphone className='h-12 w-12 text-primary' />
          </div>
          <p className='text-sm text-center mb-4'>
            We&apos;ve sent a 6-digit code to the phone number associated with{' '}
            {email}
          </p>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit}>
        <div className='grid gap-4'>
          <div>
            <Label htmlFor='code-1' className='sr-only'>
              Verification Code
            </Label>
            <div className='flex justify-between gap-2' onPaste={handlePaste}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  id={`code-${index + 1}`}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInputChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className='w-12 h-12 text-center text-lg'
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className='text-sm font-medium text-destructive'>{error}</div>
          )}

          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className='text-center'>
            <Button
              type='button'
              variant='link'
              size='sm'
              disabled={countdown > 0 || isLoading}
              onClick={handleResendCode}
              className='text-sm'
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : `Didn't receive a code? Resend`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
