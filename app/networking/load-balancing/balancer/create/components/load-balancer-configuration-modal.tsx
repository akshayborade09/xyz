'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Info } from 'lucide-react';

import type { LoadBalancerConfiguration } from '../page';

interface LoadBalancerConfigurationModalProps {
  isOpen: boolean;
  onComplete: (config: LoadBalancerConfiguration) => void;
  onClose: () => void;
}

export function LoadBalancerConfigurationModal({
  isOpen,
  onComplete,
  onClose,
}: LoadBalancerConfigurationModalProps) {
  const [selectedType, setSelectedType] = useState<'ALB' | 'NLB' | ''>('');

  const handleTypeSelect = (type: 'ALB' | 'NLB') => {
    setSelectedType(type);
  };

  const handleComplete = () => {
    if (selectedType) {
      onComplete({
        loadBalancerType: selectedType,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Select Load Balancer Type
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Choose the type of load balancer based on your application needs
          </p>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Load Balancer Type Selection */}
          <div className='px-6 py-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Application Load Balancer */}
              <div
                className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedType === 'ALB'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/20'
                }`}
                onClick={() => handleTypeSelect('ALB')}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      <h3 className='text-lg font-semibold'>
                        Application Load Balancer
                      </h3>
                      {selectedType === 'ALB' ? (
                        <CheckCircle2 className='h-6 w-6 text-primary' />
                      ) : (
                        <Circle className='h-6 w-6 text-muted-foreground' />
                      )}
                    </div>
                    <Badge variant='outline' className='mb-3'>
                      Layer 7 (HTTP/HTTPS)
                    </Badge>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Content-based routing and SSL termination for web
                      applications. Uses policies and rules to make routing
                      decisions based on content of the request.
                    </p>
                    <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700'>
                      <div className='flex items-center gap-2'>
                        <Info className='h-4 w-4' />
                        <span>Recommended for general web traffic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Load Balancer */}
              <div
                className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedType === 'NLB'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/20'
                }`}
                onClick={() => handleTypeSelect('NLB')}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      <h3 className='text-lg font-semibold'>
                        Network Load Balancer
                      </h3>
                      {selectedType === 'NLB' ? (
                        <CheckCircle2 className='h-6 w-6 text-primary' />
                      ) : (
                        <Circle className='h-6 w-6 text-muted-foreground' />
                      )}
                    </div>
                    <Badge variant='outline' className='mb-3'>
                      Layer 4 (TCP/UDP)
                    </Badge>
                    <p className='text-sm text-muted-foreground mb-4'>
                      High performance and low latency for TCP/UDP traffic with
                      static IP support. Will handle traffic based on IP
                      addresses and ports, without inspecting the content of the
                      request.
                    </p>
                    <div className='mt-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700'>
                      <div className='flex items-center gap-2'>
                        <Info className='h-4 w-4' />
                        <span>
                          Best for gaming, IoT, and real-time applications
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end items-center border-t pt-4'>
            <div className='flex gap-2'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>

              <Button
                onClick={handleComplete}
                disabled={!selectedType}
                className={`transition-colors ${
                  selectedType
                    ? 'bg-black text-white hover:bg-black/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Load Balancer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
