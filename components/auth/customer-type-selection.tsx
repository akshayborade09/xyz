'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerTypeSelectionProps {
  userName: string;
  selectedType: 'individual' | 'organization' | null;
  onSelectType: (type: 'individual' | 'organization') => void;
  onBack: () => void;
  onNext: () => void;
}

export function CustomerTypeSelection({
  userName,
  selectedType,
  onSelectType,
  onBack,
  onNext,
}: CustomerTypeSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedType) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext();
    } catch (error) {
      console.error('Error proceeding to next step', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6 md:p-8'>
      <div className='w-full max-w-md mx-auto'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Welcome {userName || ''}!
          </h2>
          <p className='text-gray-600 mt-2'>
            Choose your account type to customize your Krutrim Cloud experience.
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          {/* Individual Card */}
          <div
            onClick={() => onSelectType('individual')}
            className={cn(
              'border rounded-lg p-6 cursor-pointer transition-all',
              'hover:border-primary hover:shadow-sm',
              selectedType === 'individual'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200'
            )}
          >
            <div className='flex items-center space-x-4'>
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  selectedType === 'individual'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100'
                )}
              >
                <User className='h-6 w-6' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Individual
                </h3>
                <p className='text-gray-600 text-sm'>
                  Perfect for developers, researchers, and personal projects
                </p>
              </div>
              {selectedType === 'individual' && (
                <div className='w-5 h-5 rounded-full bg-primary flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
              )}
            </div>
          </div>

          {/* Organization Card */}
          <div
            onClick={() => onSelectType('organization')}
            className={cn(
              'border rounded-lg p-6 cursor-pointer transition-all',
              'hover:border-primary hover:shadow-sm',
              selectedType === 'organization'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200'
            )}
          >
            <div className='flex items-center space-x-4'>
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  selectedType === 'organization'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100'
                )}
              >
                <Building className='h-6 w-6' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Organization
                </h3>
                <p className='text-gray-600 text-sm'>
                  Ideal for businesses, teams, and enterprise applications
                </p>
              </div>
              {selectedType === 'organization' && (
                <div className='w-5 h-5 rounded-full bg-primary flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
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
            onClick={handleNext}
            disabled={!selectedType || isLoading}
            className='bg-primary hover:bg-primary/90 text-white px-8'
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
