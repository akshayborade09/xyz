'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { ALBFormData } from '../alb-create-form';

interface ListenersSectionProps {
  formData: ALBFormData;
  updateFormData: (section: string, data: any) => void;
  isSection?: boolean;
}

interface Listener {
  id: string;
  name: string;
  protocol: string;
  port: number;
  certificate: string;
}

export function ListenersSection({
  formData,
  updateFormData,
  isSection = false,
}: ListenersSectionProps) {
  const [listeners, setListeners] = useState<Listener[]>(
    formData.listeners.length > 0
      ? formData.listeners
      : [
          {
            id: crypto.randomUUID(),
            name: '',
            protocol: '',
            port: 80,
            certificate: '',
          },
        ]
  );

  const protocolOptions = [
    { value: 'HTTP', label: 'HTTP', defaultPort: 80 },
    { value: 'HTTPS', label: 'HTTPS', defaultPort: 443 },
  ];

  const certificateOptions = [
    { value: 'cert-1', label: 'wildcard.example.com (*.example.com)' },
    { value: 'cert-2', label: 'api.example.com' },
    { value: 'cert-3', label: 'app.example.com' },
    { value: 'cert-4', label: 'staging.example.com' },
  ];

  const addListener = () => {
    const newListener: Listener = {
      id: crypto.randomUUID(),
      name: '',
      protocol: '',
      port: 80,
      certificate: '',
    };
    setListeners([...listeners, newListener]);
  };

  const removeListener = (id: string) => {
    if (listeners.length > 1) {
      setListeners(listeners.filter(listener => listener.id !== id));
    }
  };

  const updateListener = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setListeners(
      listeners.map(listener => {
        if (listener.id === id) {
          const updated = { ...listener, [field]: value };

          // Auto-fill port based on protocol
          if (field === 'protocol') {
            const protocol = protocolOptions.find(p => p.value === value);
            if (protocol) {
              updated.port = protocol.defaultPort;
            }
          }

          return updated;
        }
        return listener;
      })
    );
  };

  const isFormValid = () => {
    return listeners.every(
      listener =>
        listener.name.trim().length > 0 &&
        listener.protocol.length > 0 &&
        listener.port > 0
    );
  };

  useEffect(() => {
    updateFormData('listeners', { listeners });
  }, [listeners]);

  return (
    <div className='space-y-6'>
      {listeners.map((listener, index) => (
        <div key={listener.id} className='relative'>
          <div className='flex items-center justify-between mb-4'>
            <h4 className='font-medium'>Listener {index + 1}</h4>
            {listeners.length > 1 && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => removeListener(listener.id)}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>

          <div className='grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20'>
            {/* Listener Name */}
            <div>
              <Label className='block mb-2 font-medium'>
                Listener Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                placeholder='e.g., web-listener, api-listener'
                value={listener.name}
                onChange={e =>
                  updateListener(listener.id, 'name', e.target.value)
                }
                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
              />
            </div>

            {/* Protocol */}
            <div>
              <Label className='block mb-2 font-medium'>
                Protocol <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={listener.protocol}
                onValueChange={value =>
                  updateListener(listener.id, 'protocol', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select protocol' />
                </SelectTrigger>
                <SelectContent>
                  {protocolOptions.map(protocol => (
                    <SelectItem key={protocol.value} value={protocol.value}>
                      {protocol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Port */}
            <div>
              <Label className='block mb-2 font-medium'>
                Port <span className='text-destructive'>*</span>
              </Label>
              <Input
                type='number'
                min='1'
                max='65535'
                placeholder='80'
                value={listener.port}
                onChange={e =>
                  updateListener(
                    listener.id,
                    'port',
                    parseInt(e.target.value) || 80
                  )
                }
                className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Port auto-fills based on protocol selection
              </p>
            </div>

            {/* Certificate */}
            {(listener.protocol === 'HTTPS' ||
              listener.protocol === 'TERMINATED_HTTPS') && (
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2 mb-2'>
                  <Label className='font-medium'>
                    SSL Certificate <span className='text-destructive'>*</span>
                  </Label>
                  <TooltipWrapper
                    content='Select an SSL certificate for HTTPS listeners. The certificate must be valid and associated with your domain.'
                    side='top'
                  >
                    <HelpCircle className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                  </TooltipWrapper>
                </div>
                <Select
                  value={listener.certificate}
                  onValueChange={value =>
                    updateListener(listener.id, 'certificate', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select SSL certificate' />
                  </SelectTrigger>
                  <SelectContent>
                    {certificateOptions.map(cert => (
                      <SelectItem key={cert.value} value={cert.value}>
                        {cert.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Listener Button */}
      <Button
        type='button'
        variant='outline'
        onClick={addListener}
        className='w-full border-dashed'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add Another Listener
      </Button>

      {/* Configuration Note */}
      <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <p className='text-sm text-blue-700'>
          <strong>Note:</strong> Each listener must have a unique port. For
          HTTPS listeners, ensure you have valid SSL certificates configured.
          Multiple listeners allow you to handle different types of traffic on
          the same load balancer.
        </p>
      </div>
    </div>
  );
}
