'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, ArrowLeft } from 'lucide-react';

interface OTPVerificationFormProps {
  email: string;
  mobile: string;
  onBack: () => void;
  onNext: () => void;
}

export function OTPVerificationForm({
  email,
  mobile,
  onBack,
  onNext,
}: OTPVerificationFormProps) {
  const [emailOTP, setEmailOTP] = useState<string[]>(Array(6).fill(''));
  const [mobileOTP, setMobileOTP] = useState<string[]>(Array(6).fill(''));
  const [emailTimeLeft, setEmailTimeLeft] = useState(59);
  const [mobileTimeLeft, setMobileTimeLeft] = useState(59);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [canResendMobile, setCanResendMobile] = useState(false);
  const [emailResendMessage, setEmailResendMessage] = useState('');
  const [mobileResendMessage, setMobileResendMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );
  const mobileInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  useEffect(() => {
    // Email timer
    let emailTimerId: NodeJS.Timeout;
    if (emailTimeLeft > 0) {
      emailTimerId = setTimeout(() => {
        setEmailTimeLeft(emailTimeLeft - 1);
      }, 1000);
    } else {
      setCanResendEmail(true);
    }

    // Mobile timer
    let mobileTimerId: NodeJS.Timeout;
    if (mobileTimeLeft > 0) {
      mobileTimerId = setTimeout(() => {
        setMobileTimeLeft(mobileTimeLeft - 1);
      }, 1000);
    } else {
      setCanResendMobile(true);
    }

    return () => {
      if (emailTimerId) {
        clearTimeout(emailTimerId);
      }
      if (mobileTimerId) {
        clearTimeout(mobileTimerId);
      }
    };
  }, [emailTimeLeft, mobileTimeLeft]);

  const handleResendEmailOTP = () => {
    if (canResendEmail) {
      setEmailTimeLeft(59);
      setCanResendEmail(false);
      setEmailResendMessage('Email OTP sent successfully!');
      setTimeout(() => setEmailResendMessage(''), 3000);
    }
  };

  const handleResendMobileOTP = () => {
    if (canResendMobile) {
      setMobileTimeLeft(59);
      setCanResendMobile(false);
      setMobileResendMessage('Mobile OTP sent successfully!');
      setTimeout(() => setMobileResendMessage(''), 3000);
    }
  };

  const handleOTPChange = (
    index: number,
    value: string,
    otpType: 'email' | 'mobile',
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setOTP: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    // Update the OTP array
    setOTP(prev => {
      const newOTP = [...prev];
      newOTP[index] = value.slice(0, 1); // Take only the first character
      return newOTP;
    });

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setOTP: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    otpType: 'email' | 'mobile',
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setOTP: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOTP(otpArray);
      refs.current[5]?.focus();
    }
  };

  const areBothOTPsComplete = () => {
    return (
      emailOTP.every(digit => digit !== '') &&
      mobileOTP.every(digit => digit !== '')
    );
  };

  const handleSubmit = async () => {
    if (!areBothOTPsComplete()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onNext();
    } catch (error) {
      console.error('OTP verification failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6 md:p-8'>
      <h2 className='text-2xl font-bold text-center mb-8'>
        Email and Mobile Verification
      </h2>

      {/* Email OTP Section */}
      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <Mail className='h-5 w-5 text-black mr-2' />
          <p className='text-sm text-gray-700'>Enter OTP sent on {email}</p>
        </div>

        <div className='flex justify-center gap-2 mb-3'>
          {emailOTP.map((digit, index) => (
            <input
              key={`email-${index}`}
              ref={el => (emailInputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={e =>
                handleOTPChange(
                  index,
                  e.target.value,
                  'email',
                  emailInputRefs,
                  setEmailOTP
                )
              }
              onKeyDown={e =>
                handleKeyDown(e, index, emailInputRefs, setEmailOTP)
              }
              onPaste={e =>
                handlePaste(e, 'email', emailInputRefs, setEmailOTP)
              }
              className='w-12 h-12 text-center text-lg border rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none'
            />
          ))}
        </div>

        {/* Email Resend OTP Section */}
        <div className='text-center'>
          {emailResendMessage && (
            <p className='text-green-600 text-sm font-medium mb-2'>
              {emailResendMessage}
            </p>
          )}
          {canResendEmail ? (
            <button
              onClick={handleResendEmailOTP}
              className='text-black hover:text-gray-800 text-sm font-medium'
            >
              Resend Email OTP
            </button>
          ) : (
            <p className='text-gray-600 text-sm'>
              Resend Email OTP after 00:
              {emailTimeLeft.toString().padStart(2, '0')} seconds
            </p>
          )}
        </div>
      </div>

      {/* Mobile OTP Section */}
      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <Phone className='h-5 w-5 text-black mr-2' />
          <p className='text-sm text-gray-700'>Enter OTP sent on {mobile}</p>
        </div>

        <div className='flex justify-center gap-2 mb-3'>
          {mobileOTP.map((digit, index) => (
            <input
              key={`mobile-${index}`}
              ref={el => (mobileInputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={e =>
                handleOTPChange(
                  index,
                  e.target.value,
                  'mobile',
                  mobileInputRefs,
                  setMobileOTP
                )
              }
              onKeyDown={e =>
                handleKeyDown(e, index, mobileInputRefs, setMobileOTP)
              }
              onPaste={e =>
                handlePaste(e, 'mobile', mobileInputRefs, setMobileOTP)
              }
              className='w-12 h-12 text-center text-lg border rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none'
            />
          ))}
        </div>

        {/* Mobile Resend OTP Section */}
        <div className='text-center'>
          {mobileResendMessage && (
            <p className='text-green-600 text-sm font-medium mb-2'>
              {mobileResendMessage}
            </p>
          )}
          {canResendMobile ? (
            <button
              onClick={handleResendMobileOTP}
              className='text-black hover:text-gray-800 text-sm font-medium'
            >
              Resend Mobile OTP
            </button>
          ) : (
            <p className='text-gray-600 text-sm'>
              Resend Mobile OTP after 00:
              {mobileTimeLeft.toString().padStart(2, '0')} seconds
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={onBack} className='px-6'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !areBothOTPsComplete()}
          className='px-6 bg-black hover:bg-gray-800 text-white'
        >
          {isLoading ? 'Validating...' : 'Validate OTP'}
        </Button>
      </div>
    </div>
  );
}
