'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtendVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: {
    id: string;
    name: string;
    size: string;
    type: string;
  };
  onConfirm: (newSize: number) => Promise<void>;
}

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  volume: {
    name: string;
    size: string;
  };
  newSize: number;
  priceDifference: number;
}

function WarningModal({
  isOpen,
  onClose,
  onConfirm,
  volume,
  newSize,
  priceDifference,
}: WarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Confirm Volume Extension
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            This action cannot be undone. Please review the details carefully.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='p-4 bg-amber-50 border border-amber-200 rounded-lg'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0' />
              <p className='text-amber-800' style={{ fontSize: '13px' }}>
                <strong>Warning:</strong> Once you extend the volume, you can't
                decrease the size later.
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Volume:</span>
              <span className='text-sm font-medium'>{volume.name}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Current Size:
              </span>
              <span className='text-sm font-medium'>{volume.size} GB</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>New Size:</span>
              <span className='text-sm font-medium'>{newSize} GB</span>
            </div>
            <Separator />
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Additional Cost:
              </span>
              <span className='text-sm font-medium text-black'>
                ₹{priceDifference.toFixed(2)}/month
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={onClose} className='text-sm'>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className='bg-black hover:bg-black/90 text-white text-sm'
          >
            Confirm Extension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ExtendVolumeModal({
  isOpen,
  onClose,
  volume,
  onConfirm,
}: ExtendVolumeModalProps) {
  const [newSize, setNewSize] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  const currentSize = parseInt(volume.size);
  const newSizeNumber = parseInt(newSize);

  // Calculate pricing (₹1.8 per GB per month for volumes)
  const pricePerGB = 1.8;
  const currentCost = currentSize * pricePerGB;
  const newCost = newSizeNumber * pricePerGB;
  const priceDifference = newCost - currentCost;

  useEffect(() => {
    if (isOpen) {
      setNewSize('');
      setError('');
      setShowWarning(false);
    }
  }, [isOpen]);

  const validateSize = (size: string) => {
    const sizeNumber = parseInt(size);

    if (!size || isNaN(sizeNumber)) {
      return 'Please enter a valid size';
    }

    if (sizeNumber <= currentSize) {
      return `New size must be greater than current size (${currentSize} GB)`;
    }

    if (sizeNumber > 16000) {
      return 'Maximum volume size is 16,000 GB';
    }

    return '';
  };

  const handleSizeChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewSize(numericValue);

    if (numericValue) {
      setError(validateSize(numericValue));
    } else {
      setError('');
    }
  };

  const handleExtendClick = () => {
    const validationError = validateSize(newSize);
    if (validationError) {
      setError(validationError);
      return;
    }

    setShowWarning(true);
  };

  const handleConfirmExtension = async () => {
    setIsLoading(true);
    try {
      await onConfirm(newSizeNumber);
      setShowWarning(false);
      onClose();
      toast({
        title: 'Volume extension initiated',
        description: `${volume.name} is being extended to ${newSize} GB.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to extend volume',
        description: 'An error occurred while extending the volume.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = newSize && !error && newSizeNumber > currentSize;

  return (
    <>
      <Dialog open={isOpen && !showWarning} onOpenChange={onClose}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Extend Volume
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Information Box with Volume Details */}
            <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
              <div className='space-y-3 mb-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Volume Name:
                  </span>
                  <span className='text-sm font-medium'>{volume.name}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Current Size:
                  </span>
                  <span className='text-sm font-medium'>{volume.size} GB</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Volume Type:
                  </span>
                  <span className='text-sm font-medium'>{volume.type}</span>
                </div>
              </div>

              <div className='flex items-start gap-2 pt-3 border-t border-gray-200'>
                <Info className='h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0' />
                <p className='text-gray-600' style={{ fontSize: '11px' }}>
                  You can only increase the volume size. Once extended, the
                  volume cannot be reduced back to its original size.
                </p>
              </div>
            </div>

            {/* New Size Input */}
            <div className='space-y-2'>
              <Label htmlFor='new-size' className='text-sm font-medium'>
                New Size (GB) <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='new-size'
                type='text'
                value={newSize}
                onChange={e => handleSizeChange(e.target.value)}
                placeholder={`Enter size greater than ${currentSize} GB`}
                className={error ? 'border-red-500 text-sm' : 'text-sm'}
              />
              {error && <p className='text-xs text-red-600'>{error}</p>}
              <p className='text-xs text-muted-foreground'>
                Minimum: {currentSize + 1} GB • Maximum: 16,000 GB
              </p>
            </div>

            {/* Pricing Information */}
            {isValid && (
              <div
                className='p-4 rounded-lg'
                style={{
                  boxShadow: 'rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset',
                  background:
                    'linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)',
                }}
              >
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm font-medium text-black'>
                    Pricing Summary
                  </span>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-black'>Current Cost:</span>
                    <span className='font-medium text-black'>
                      ₹{currentCost.toFixed(2)}/month
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-black'>New Cost:</span>
                    <span className='font-medium text-black'>
                      ₹{newCost.toFixed(2)}/month
                    </span>
                  </div>
                  <Separator
                    style={{ backgroundColor: 'rgba(14, 114, 180, 0.2)' }}
                  />
                  <div className='flex justify-between text-xs'>
                    <span className='font-medium text-black'>
                      Additional Cost:
                    </span>
                    <span className='font-semibold text-black'>
                      ₹{priceDifference.toFixed(2)}/month
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={onClose} className='text-sm'>
              Cancel
            </Button>
            <Button
              onClick={handleExtendClick}
              disabled={!isValid}
              className='text-sm'
            >
              Extend Volume Size
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onConfirm={handleConfirmExtension}
        volume={volume}
        newSize={newSizeNumber}
        priceDifference={priceDifference}
      />
    </>
  );
}
