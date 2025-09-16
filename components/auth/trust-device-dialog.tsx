'use client';

import type React from 'react';

import { useState } from 'react';
import { Laptop, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TrustDeviceDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  onConfirm: (trust: boolean) => void;
}

export function TrustDeviceDialog({
  className,
  onConfirm,
  ...props
}: TrustDeviceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (trust: boolean) => {
    setIsLoading(true);

    try {
      // In a real app, you would save this preference to the user's account
      await new Promise(resolve => setTimeout(resolve, 500));
      onConfirm(trust);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='rounded-full bg-primary/10 p-3'>
              <ShieldCheck className='h-8 w-8 text-primary' />
            </div>
          </div>
          <CardTitle>Trust this device?</CardTitle>
          <CardDescription>
            You won&apos;t need to enter a verification code when signing in
            from this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4'>
            <Laptop className='h-4 w-4' />
            <span>Chrome on Windows</span>
          </div>
          <p className='text-sm text-center'>
            Only trust devices you regularly use and have proper security
            measures in place.
          </p>
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          <Button
            className='w-full'
            onClick={() => handleConfirm(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Yes, trust this device'}
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => handleConfirm(false)}
            disabled={isLoading}
          >
            No, don&apos;t trust
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
