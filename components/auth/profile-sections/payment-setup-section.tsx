'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Shield,
  AlertCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserData {
  name: string;
  email: string;
  mobile: string;
  accountType: 'individual' | 'organization';
  companyName?: string;
}

interface PaymentSetupSectionProps {
  userData: UserData;
  onComplete: () => void;
  onCancel: () => void;
}

export function PaymentSetupSection({
  userData,
  onComplete,
  onCancel,
}: PaymentSetupSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    savePaymentMethod: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateCardNumber = (cardNumber: string) => {
    // Remove spaces and check if it's 16 digits
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
  };

  const validateExpiryDate = (expiryDate: string) => {
    // Check MM/YY format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      return false;
    }
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  };

  const validateUPI = (upiId: string) => {
    // Basic UPI ID validation
    return /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(upiId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!formData.nameOnCard) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    } else {
      if (!formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!validateUPI(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to save payment method
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
    } catch (error) {
      console.error('Error setting up payment method:', error);
      setErrors({
        general: 'Failed to save payment method. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Payment Setup</CardTitle>
            <p className='text-gray-600'>
              Add a payment method for seamless access to paid services
            </p>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Important Notice */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <Info className='h-5 w-5 text-blue-600 mt-0.5' />
                <div>
                  <h4 className='font-semibold text-blue-900'>
                    No charges will be applied
                  </h4>
                  <p className='text-sm text-blue-800 mt-1'>
                    Your card will not be charged until you use paid services.
                    This is only for payment method verification.
                  </p>
                </div>
              </div>
            </div>

            {errors.general && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-center space-x-2'>
                  <AlertCircle className='h-5 w-5 text-red-600' />
                  <p className='text-sm text-red-800'>{errors.general}</p>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-3'>
                Choose Payment Method
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-300'
                  )}
                  onClick={() => setSelectedMethod('card')}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-center space-x-3'>
                      <CreditCard className='h-6 w-6 text-primary' />
                      <div>
                        <h4 className='font-semibold'>Credit/Debit Card</h4>
                        <p className='text-sm text-gray-600'>
                          Visa, Mastercard, RuPay
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedMethod === 'upi'
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-300'
                  )}
                  onClick={() => setSelectedMethod('upi')}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-center space-x-3'>
                      <QrCode className='h-6 w-6 text-primary' />
                      <div>
                        <h4 className='font-semibold'>UPI</h4>
                        <p className='text-sm text-gray-600'>
                          GPay, PhonePe, Paytm
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment Form */}
            {selectedMethod === 'card' ? (
              <div className='space-y-4'>
                <div>
                  <Label
                    htmlFor='cardNumber'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Card Number <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='cardNumber'
                    value={formData.cardNumber}
                    onChange={e =>
                      handleInputChange(
                        'cardNumber',
                        formatCardNumber(e.target.value)
                      )
                    }
                    className={`mt-1 ${errors.cardNumber ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                    placeholder='1234 5678 9012 3456'
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                      <AlertCircle className='h-4 w-4' />
                      <span>{errors.cardNumber}</span>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label
                      htmlFor='expiryDate'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Expiry Date <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='expiryDate'
                      value={formData.expiryDate}
                      onChange={e =>
                        handleInputChange(
                          'expiryDate',
                          formatExpiryDate(e.target.value)
                        )
                      }
                      className={`mt-1 ${errors.expiryDate ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                      placeholder='MM/YY'
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        <span>{errors.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor='cvv'
                      className='block text-sm font-medium text-gray-700'
                    >
                      CVV <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='cvv'
                      type='password'
                      value={formData.cvv}
                      onChange={e =>
                        handleInputChange(
                          'cvv',
                          e.target.value.replace(/\D/g, '')
                        )
                      }
                      className={`mt-1 ${errors.cvv ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                      placeholder='123'
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        <span>{errors.cvv}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='nameOnCard'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Name on Card <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='nameOnCard'
                    value={formData.nameOnCard}
                    onChange={e =>
                      handleInputChange('nameOnCard', e.target.value)
                    }
                    className={`mt-1 ${errors.nameOnCard ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                    placeholder='John Doe'
                  />
                  {errors.nameOnCard && (
                    <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                      <AlertCircle className='h-4 w-4' />
                      <span>{errors.nameOnCard}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Label
                  htmlFor='upiId'
                  className='block text-sm font-medium text-gray-700'
                >
                  UPI ID <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='upiId'
                  value={formData.upiId}
                  onChange={e => handleInputChange('upiId', e.target.value)}
                  className={`mt-1 ${errors.upiId ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                  placeholder='yourname@paytm'
                />
                {errors.upiId && (
                  <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                    <AlertCircle className='h-4 w-4' />
                    <span>{errors.upiId}</span>
                  </div>
                )}
              </div>
            )}

            {/* Security Information */}
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <Shield className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    Secure & Protected
                  </h4>
                  <ul className='text-sm text-gray-600 mt-1 space-y-1'>
                    <li>• 256-bit SSL encryption</li>
                    <li>• PCI DSS compliant</li>
                    <li>• Your payment data is tokenized and secure</li>
                    <li>• No charges until you use paid services</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save Payment Method Option */}
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='savePaymentMethod'
                checked={formData.savePaymentMethod}
                onChange={e =>
                  handleInputChange(
                    'savePaymentMethod',
                    e.target.checked.toString()
                  )
                }
                className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
              />
              <Label
                htmlFor='savePaymentMethod'
                className='text-sm text-gray-700'
              >
                Save this payment method for future use
              </Label>
            </div>

            <div className='flex justify-between pt-4'>
              <Button
                variant='outline'
                onClick={onCancel}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Profile
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className='bg-primary hover:bg-primary/90 text-white px-8'
              >
                {isLoading ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
