'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';

interface AddressSelectionScreenProps {
  onBack: () => void;
  onNext: () => void;
}

export function AddressSelectionScreen({
  onBack,
  onNext,
}: AddressSelectionScreenProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample addresses retrieved from DigiLocker/Aadhaar
  const addresses = [
    {
      id: 'addr1',
      type: 'Aadhaar Address',
      line1: '123 Main Street, Apartment 4B',
      line2: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    {
      id: 'addr2',
      type: 'PAN Address',
      line1: '456 Park Avenue',
      line2: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
    },
  ];

  const handleSubmit = async () => {
    if (!selectedAddress && !showNewAddressForm) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onNext();
    } catch (error) {
      console.error('Error saving address', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-8'>
      {/* Add Krutrim Logo */}
      <div className='flex justify-center mb-6'>
        <KrutrimLogo className='h-12' />
      </div>

      <h2 className='text-2xl font-bold mb-2'>Address Selection</h2>
      <p className='text-gray-600 mb-6'>
        Please select or add an address for your account. This will be used for
        billing and communication purposes.
      </p>

      <div className='space-y-6 mb-8'>
        <RadioGroup
          value={selectedAddress || ''}
          onValueChange={setSelectedAddress}
        >
          {addresses.map(address => (
            <div
              key={address.id}
              className='border rounded-lg p-4 hover:border-blue-400 transition-colors'
              onClick={() => {
                setSelectedAddress(address.id);
                setShowNewAddressForm(false);
              }}
            >
              <div className='flex items-start gap-3'>
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className='mt-1'
                />
                <div className='flex-1'>
                  <Label
                    htmlFor={address.id}
                    className='font-medium cursor-pointer'
                  >
                    {address.type}
                  </Label>
                  <div className='mt-1 text-sm text-gray-600'>
                    <p>{address.line1}</p>
                    <p>{address.line2}</p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
                <MapPin className='h-5 w-5 text-gray-400 flex-shrink-0' />
              </div>
            </div>
          ))}

          <div
            className='border rounded-lg p-4 hover:border-blue-400 transition-colors'
            onClick={() => {
              setSelectedAddress(null);
              setShowNewAddressForm(true);
            }}
          >
            <div className='flex items-center gap-3'>
              <RadioGroupItem
                value='new'
                id='new'
                checked={showNewAddressForm}
              />
              <Label htmlFor='new' className='font-medium cursor-pointer'>
                Add a new address
              </Label>
              <Plus className='h-4 w-4 text-blue-600 ml-auto' />
            </div>
          </div>
        </RadioGroup>

        {showNewAddressForm && (
          <div className='border rounded-lg p-6 mt-4'>
            <h3 className='font-medium mb-4'>New Address</h3>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='addressLine1'>Address Line 1</Label>
                <Input
                  id='addressLine1'
                  placeholder='House/Flat No., Building Name, Street'
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='addressLine2'>Address Line 2</Label>
                <Input
                  id='addressLine2'
                  placeholder='Area, Landmark'
                  className='mt-1'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='city'>City</Label>
                  <Input id='city' placeholder='City' className='mt-1' />
                </div>

                <div>
                  <Label htmlFor='state'>State</Label>
                  <Input id='state' placeholder='State' className='mt-1' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='pincode'>PIN Code</Label>
                  <Input id='pincode' placeholder='PIN Code' className='mt-1' />
                </div>

                <div>
                  <Label htmlFor='country'>Country</Label>
                  <Input
                    id='country'
                    placeholder='Country'
                    defaultValue='India'
                    className='mt-1'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-between'>
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
          className='bg-blue-600 hover:bg-blue-700 text-white'
          disabled={isLoading || (!selectedAddress && !showNewAddressForm)}
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </Button>
      </div>
    </div>
  );
}
