'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, QrCode, Shield } from 'lucide-react';

interface PaymentSetupSuccessScreenProps {
  paymentMethod: 'card' | 'upi';
  paymentData?: {
    cardNumber?: string;
    upiId?: string;
    nameOnCard?: string;
  };
  onNext: () => void;
}

export function PaymentSetupSuccessScreen({
  paymentMethod,
  paymentData,
  onNext,
}: PaymentSetupSuccessScreenProps) {
  const formatCardNumber = (cardNumber: string) => {
    // Show only last 4 digits for security
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleanNumber.slice(-4)}`;
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
          <CheckCircle className='h-8 w-8 text-green-600' />
        </div>
        <h1 className='text-2xl font-bold text-center'>
          Payment Method Added!
        </h1>
      </div>

      <p className='text-center text-gray-600'>
        Your payment method has been successfully verified and saved. You can
        now access all Krutrim Cloud services.
      </p>

      <div className='bg-gray-50 p-6 rounded-lg'>
        <h2 className='text-lg font-semibold mb-4'>Payment Method Details</h2>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-500'>Payment Method:</span>
            <div className='flex items-center gap-2'>
              {paymentMethod === 'card' ? (
                <>
                  <CreditCard className='h-4 w-4 text-gray-600' />
                  <span className='font-medium'>Credit/Debit Card</span>
                </>
              ) : (
                <>
                  <QrCode className='h-4 w-4 text-gray-600' />
                  <span className='font-medium'>UPI</span>
                </>
              )}
            </div>
          </div>

          {paymentMethod === 'card' && paymentData?.cardNumber && (
            <>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Card Number:</span>
                <span className='font-medium'>
                  {formatCardNumber(paymentData.cardNumber)}
                </span>
              </div>
              {paymentData.nameOnCard && (
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Name on Card:</span>
                  <span className='font-medium'>{paymentData.nameOnCard}</span>
                </div>
              )}
            </>
          )}

          {paymentMethod === 'upi' && paymentData?.upiId && (
            <div className='flex justify-between'>
              <span className='text-gray-500'>UPI ID:</span>
              <span className='font-medium'>{paymentData.upiId}</span>
            </div>
          )}

          <div className='flex justify-between'>
            <span className='text-gray-500'>Status:</span>
            <span className='text-green-600 font-medium flex items-center gap-1'>
              <CheckCircle className='h-4 w-4' />
              Verified
            </span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-500'>Added on:</span>
            <span className='font-medium'>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start space-x-3'>
          <Shield className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
          <div>
            <h4 className='font-semibold text-blue-900'>Payment Security</h4>
            <ul className='text-sm text-blue-800 mt-1 space-y-1'>
              <li>• Your payment method is securely tokenized</li>
              <li>• No charges will be applied until you use paid services</li>
              <li>• You can update or remove this payment method anytime</li>
              <li>• All transactions are encrypted and monitored</li>
            </ul>
          </div>
        </div>
      </div>

      <p className='text-center text-gray-600 mt-6'>
        Your payment setup is complete. Please proceed to verify your identity
        to finish setting up your account.
      </p>

      <div className='flex justify-end mt-6'>
        <Button onClick={onNext} className='w-auto'>
          Continue to Identity Verification
        </Button>
      </div>
    </div>
  );
}
