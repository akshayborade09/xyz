'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Shield,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentSetupData {
  paymentMethod: 'card' | 'upi';
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
    saveCard: boolean;
  };
  upiId?: string;
  verified: boolean;
}

interface PaymentSetupFormProps {
  onBack: () => void;
  onNext: (paymentData: PaymentSetupData) => void;
}

export function PaymentSetupForm({ onBack, onNext }: PaymentSetupFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'upi'
  >('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    saveCard: true,
  });
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    nameOnCard?: string;
    upiId?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveCard: checked }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '');

    // Add spaces every 4 digits
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    return formattedValue.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }

    return cleanValue;
  };

  const validateCard = () => {
    const newErrors: typeof errors = {};

    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const cleanNumber = formData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if card is not expired
      const [month, year] = formData.expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Name validation
    if (!formData.nameOnCard) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    return newErrors;
  };

  const validateUPI = () => {
    const newErrors: typeof errors = {};

    if (!formData.upiId) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(formData.upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }

    return newErrors;
  };

  const handleSetupPayment = async () => {
    // Validate form based on selected payment method
    const validationErrors =
      selectedPaymentMethod === 'card' ? validateCard() : validateUPI();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate payment method verification (setup intent)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare payment setup data
      const paymentSetupData: PaymentSetupData = {
        paymentMethod: selectedPaymentMethod,
        verified: true,
        ...(selectedPaymentMethod === 'card'
          ? {
              cardDetails: {
                number: formData.cardNumber,
                expiry: formData.expiryDate,
                cvv: formData.cvv,
                nameOnCard: formData.nameOnCard,
                saveCard: formData.saveCard,
              },
            }
          : {
              upiId: formData.upiId,
            }),
      };

      onNext(paymentSetupData);
    } catch (error) {
      setErrors({
        general: 'Failed to verify payment method. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold'>Payment Information</h2>
      <p className='text-gray-600 mt-2 mb-6'>
        Add a payment method for future billing. Your card will not be charged
        until you start using paid services.
      </p>

      {errors.general && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2'>
          <AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0' />
          <span className='text-red-600'>{errors.general}</span>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div
          className={cn(
            'border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all',
            selectedPaymentMethod === 'card'
              ? 'border-primary bg-gray-50'
              : 'border-gray-200'
          )}
          onClick={() => setSelectedPaymentMethod('card')}
        >
          <CreditCard className='h-8 w-8 text-primary mb-2' />
          <h3 className='font-medium'>Credit/Debit Card</h3>
          <p className='text-sm text-gray-500 text-center mt-1'>
            Secure card verification
          </p>
        </div>

        <div
          className={cn(
            'border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all',
            selectedPaymentMethod === 'upi'
              ? 'border-primary bg-gray-50'
              : 'border-gray-200'
          )}
          onClick={() => setSelectedPaymentMethod('upi')}
        >
          <QrCode className='h-8 w-8 text-primary mb-2' />
          <h3 className='font-medium'>UPI</h3>
          <p className='text-sm text-gray-500 text-center mt-1'>
            Instant UPI verification
          </p>
        </div>
      </div>

      {/* Card Payment Form */}
      {selectedPaymentMethod === 'card' && (
        <div className='space-y-6 border rounded-lg p-6'>
          <div className='space-y-2'>
            <Label htmlFor='cardNumber'>Card Number</Label>
            <Input
              id='cardNumber'
              value={formData.cardNumber}
              onChange={e =>
                handleInputChange(
                  'cardNumber',
                  formatCardNumber(e.target.value)
                )
              }
              className={
                errors.cardNumber
                  ? 'border-red-300 focus-visible:ring-red-500'
                  : ''
              }
              placeholder='1234 5678 9012 3456'
              maxLength={19}
            />
            <p className='text-xs text-gray-500'>
              Enter the 16-digit number on the front of your card
            </p>
            {errors.cardNumber && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.cardNumber}</span>
              </div>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='expiryDate'>Expiry Date</Label>
              <Input
                id='expiryDate'
                value={formData.expiryDate}
                onChange={e =>
                  handleInputChange(
                    'expiryDate',
                    formatExpiryDate(e.target.value)
                  )
                }
                placeholder='MM/YY'
                maxLength={5}
                className={
                  errors.expiryDate
                    ? 'border-red-300 focus-visible:ring-red-500'
                    : ''
                }
              />
              {errors.expiryDate && (
                <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                  <AlertCircle className='h-4 w-4' />
                  <span>{errors.expiryDate}</span>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cvv'>CVV</Label>
              <Input
                id='cvv'
                type='password'
                value={formData.cvv}
                onChange={e =>
                  handleInputChange('cvv', e.target.value.replace(/\D/g, ''))
                }
                placeholder='123'
                maxLength={4}
                className={
                  errors.cvv ? 'border-red-300 focus-visible:ring-red-500' : ''
                }
              />
              {errors.cvv && (
                <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                  <AlertCircle className='h-4 w-4' />
                  <span>{errors.cvv}</span>
                </div>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='nameOnCard'>Name on Card</Label>
            <Input
              id='nameOnCard'
              value={formData.nameOnCard}
              onChange={e => handleInputChange('nameOnCard', e.target.value)}
              placeholder='John Doe'
              className={
                errors.nameOnCard
                  ? 'border-red-300 focus-visible:ring-red-500'
                  : ''
              }
            />
            {errors.nameOnCard && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.nameOnCard}</span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox
              id='save-card'
              checked={formData.saveCard}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor='save-card' className='text-sm cursor-pointer'>
              Save card securely for future payments
            </label>
          </div>
        </div>
      )}

      {/* UPI Payment Form */}
      {selectedPaymentMethod === 'upi' && (
        <div className='space-y-4 border rounded-lg p-6'>
          <div className='space-y-2'>
            <Label htmlFor='upiId'>UPI ID</Label>
            <Input
              id='upiId'
              value={formData.upiId}
              onChange={e => handleInputChange('upiId', e.target.value)}
              placeholder='yourname@paytm'
              className={
                errors.upiId ? 'border-red-300 focus-visible:ring-red-500' : ''
              }
            />
            <p className='text-xs text-gray-500'>
              Enter your UPI ID (e.g., name@paytm, name@gpay)
            </p>
            {errors.upiId && (
              <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                <AlertCircle className='h-4 w-4' />
                <span>{errors.upiId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className='flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
        <Shield className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
        <div>
          <h4 className='font-semibold text-gray-900'>Secure & Protected</h4>
          <ul className='text-sm text-gray-600 mt-1 space-y-1'>
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant</li>
            <li>• Your payment data is tokenized and secure</li>
            <li>• No charges until you use paid services</li>
          </ul>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
        <p className='text-sm text-blue-800'>
          <strong>Important:</strong> Your card will not be charged until you
          start using paid services. This is only for payment method
          verification and future billing setup.
        </p>
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
          onClick={handleSetupPayment}
          variant='default'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Verifying...
            </>
          ) : (
            'Setup Payment Method'
          )}
        </Button>
      </div>
    </div>
  );
}
