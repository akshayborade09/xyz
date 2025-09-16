'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

function NvidiaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clipPath='url(#clip0_96_9)'>
        <path d='M0 0V5.999H1.248V1.248H5.999V0H0Z' fill='#68A100' />
        <path
          d='M8.95704 2.4L10.1154 2.4C13.0914 2.4 15.8654 6.281 15.8654 6.281C15.8654 6.281 15.8344 6.323 15.7724 6.4H24V0H8.95704V2.4Z'
          fill='#68A100'
        />
        <path
          d='M8.95703 2.4V5.999L10.1154 5.999C12.9914 5.999 15.2724 8.78 15.2724 8.78C15.2724 8.78 15.1704 8.942 15.0084 9.137H24V10.592H15.7724C15.8344 10.669 15.8654 10.711 15.8654 10.711C15.8654 10.711 13.0914 14.592 10.1154 14.592C9.71739 14.592 9.32839 14.53 8.95739 14.406V18.174C9.28339 18.156 9.60039 18.174 9.93639 18.174C13.417 18.174 19.555 16.384 22.188 14.159C21.799 13.766 19.918 12.867 19.459 12.493C16.687 14.897 13.824 16.936 9.86703 16.936C9.56703 16.936 9.25703 16.908 8.95703 16.873V20H24V10.593H22.188C21.799 10.2 19.918 9.301 19.459 8.927C16.687 11.331 13.824 13.37 9.86703 13.37C9.56703 13.37 9.25703 13.342 8.95703 13.307V8.948C9.28303 8.966 9.60003 8.948 9.93603 8.948C13.417 8.948 19.555 7.158 22.188 4.933C21.799 4.54 19.918 3.641 19.459 3.267C16.687 5.671 13.824 7.71 9.86703 7.71C9.56703 7.71 9.25703 7.682 8.95703 7.647V6.4H15.7724C15.8344 6.477 15.8654 6.519 15.8654 6.519C15.8654 6.519 13.0914 10.4 10.1154 10.4C9.71739 10.4 9.32839 10.338 8.95739 10.214V2.4Z'
          fill='#DEDEDE'
        />
        <path
          d='M0.051 10.593H0V10.642C0 10.642 0.017 10.625 0.051 10.593ZM13.652 10.593H10.423C10.874 10.98 11.195 11.571 11.704 12.432L13.744 10.705C13.744 10.705 13.713 10.664 13.652 10.593Z'
          fill='#DEDEDE'
        />
        <path
          d='M2.683 10.593H0.051C0.017 10.625 0 10.642 0 10.642C0 10.642 2.35 17.498 8.948 18.121V16.874C4.108 16.269 2.456 10.891 2.456 10.891C2.456 10.891 2.532 10.779 2.683 10.593Z'
          fill='#68A100'
        />
        <path
          d='M6.97839 10.593H4.76639C4.44539 10.863 4.27539 11.052 4.27539 11.052C4.27539 11.052 5.29139 14.888 8.94839 15.547V14.407C6.89039 13.704 6.21039 11.274 6.21039 11.274C6.21039 11.274 6.50139 10.926 6.97839 10.593ZM15.7724 10.593H13.6524C13.7134 10.663 13.7444 10.704 13.7444 10.704L11.7044 12.431C11.1954 11.57 10.8744 10.979 10.4234 10.592H8.95739V14.407C9.32839 14.531 9.71739 14.593 10.1154 14.593C13.0914 14.593 15.8654 10.712 15.8654 10.712C15.8654 10.712 15.8344 10.67 15.7724 10.593Z'
          fill='#68A100'
        />
        <path
          d='M24 10.593H18.351C18.372 10.619 18.382 10.633 18.382 10.633C18.382 10.633 14.302 15.637 10.052 15.637C9.68203 15.637 9.32003 15.602 8.95703 15.539V16.874C9.25703 16.909 9.56703 16.937 9.86703 16.937C13.824 16.937 16.687 14.898 19.459 12.494C19.918 12.868 21.799 13.767 22.188 14.16C19.555 16.385 13.417 18.175 9.93603 18.175C9.60003 18.175 9.28303 18.157 8.96503 18.122V20H24V10.593Z'
          fill='#68A100'
        />
      </g>
      <defs>
        <clipPath id='clip0_96_9'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

interface GpuBaremetalPricingCardProps {
  flavour: string;
  gpus: number;
  vcpus: number;
  memory: string;
  gpuMemory: number;
  availability: 'Low' | 'Medium' | 'High';
  architecture: 'A100' | 'H100';
  price: number;
  network: string;
  ssd: string;
}

const gpuBaremetalConfigs: GpuBaremetalPricingCardProps[] = [
  {
    flavour: 'A100-40GB-1-Node',
    gpus: 1,
    vcpus: 128,
    memory: '2 TB',
    gpuMemory: 320,
    availability: 'High',
    architecture: 'A100',
    price: 720,
    network: 'Upto 10GBps',
    ssd: 'Starting from 128 GB',
  },
  {
    flavour: 'H100-80GB-1-Node',
    gpus: 1,
    vcpus: 256,
    memory: '4 TB',
    gpuMemory: 640,
    availability: 'Low',
    architecture: 'H100',
    price: 1440,
    network: 'Upto 10GBps',
    ssd: 'Starting from 256 GB',
  },
];

function getAvailabilityColor(availability: string) {
  switch (availability) {
    case 'High':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Low':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

interface FormData {
  preferredStartDate: Date | undefined;
  reserveDuration: string;
  currentProvider: string;
  requirement: string;
}

function GpuBaremetalPricingCard({
  flavour,
  gpus,
  vcpus,
  memory,
  gpuMemory,
  availability,
  architecture,
  price,
  network,
  ssd,
}: GpuBaremetalPricingCardProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    preferredStartDate: undefined,
    reserveDuration: '',
    currentProvider: '',
    requirement: '',
  });

  const handleShowInterest = () => {
    setShowEnquiryModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.preferredStartDate || !formData.reserveDuration) {
      return; // Don't submit if required fields are missing
    }

    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowEnquiryModal(false);
    // You can add toast notification or API call here
  };

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className='relative w-full transition-all duration-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2 mb-2'>
          <NvidiaLogo className='h-5 w-5' />
          <h3 className='text-base font-medium text-foreground'>
            NVIDIA {architecture}
          </h3>
        </div>
        <div className='flex justify-between items-center'>
          <h4 className='text-lg font-semibold text-foreground'>{flavour}</h4>
          <div className='flex items-baseline gap-1'>
            <span className='text-lg font-medium'>₹{price}</span>
            <span className='text-sm text-muted-foreground'>/hour</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Basic Specs - First Row */}
        <div className='grid grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              vCPUs
            </span>
            <span className='font-medium'>{vcpus}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              RAM
            </span>
            <span className='font-medium'>{memory}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              GPUs
            </span>
            <span className='font-medium'>{gpus}</span>
          </div>
        </div>

        {/* Additional Specs - Second Row */}
        <div className='grid grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              GPU Memory
            </span>
            <span className='font-medium'>{gpuMemory} GB</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              Network
            </span>
            <span className='font-medium'>{network}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              SSD
            </span>
            <span className='font-medium'>{ssd}</span>
          </div>
        </div>

        {/* Availability - Third Row */}
        <div className='grid grid-cols-1 gap-4 text-sm'>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              Availability
            </span>
            <Badge
              className={`${getAvailabilityColor(availability)} text-xs px-2 py-0.5 w-fit pointer-events-none`}
            >
              {availability}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className='w-full transition-all duration-200 hover:bg-black hover:text-white'
          size='sm'
          variant='outline'
          onClick={handleShowInterest}
        >
          Show Interest
        </Button>
      </CardFooter>

      {/* Reserved GPU Enquiry Modal */}
      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent
          className='sm:max-w-lg'
          style={{
            boxShadow:
              'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px',
          }}
        >
          <DialogHeader className='space-y-3 pb-4'>
            <DialogTitle className='text-xl font-semibold text-black pr-8'>
              Reserved GPU Enquiry
            </DialogTitle>
            <hr className='border-border' />
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className='space-y-6'>
            {/* Selected Machine */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Selected Machine
              </Label>
              <div className='p-3 bg-muted rounded-md font-medium text-sm'>
                {flavour}
              </div>
            </div>

            {/* Form Fields Row */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Preferred Start Date */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>
                  Preferred Start Date{' '}
                  <span className='text-destructive'>*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.preferredStartDate ? (
                        format(formData.preferredStartDate, 'PPP')
                      ) : (
                        <span className='text-muted-foreground'>
                          DD/MM/YYYY
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={formData.preferredStartDate}
                      onSelect={date =>
                        handleInputChange('preferredStartDate', date)
                      }
                      initialFocus
                      disabled={date => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reserve GPU for */}
              <div className='space-y-2'>
                <Label htmlFor='duration' className='text-sm font-medium'>
                  Reserve GPU for <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.reserveDuration}
                  onValueChange={value =>
                    handleInputChange('reserveDuration', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select duration' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1-month'>1 month</SelectItem>
                    <SelectItem value='3-months'>3 months</SelectItem>
                    <SelectItem value='6-months'>6 months</SelectItem>
                    <SelectItem value='1-year'>1 year</SelectItem>
                    <SelectItem value='2-years'>2 years</SelectItem>
                    <SelectItem value='3-years'>3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Cloud Provider */}
            <div className='space-y-2'>
              <Label htmlFor='provider' className='text-sm font-medium'>
                Mention your current cloud provider (If any)
              </Label>
              <Input
                id='provider'
                placeholder='Enter cloud provider name'
                value={formData.currentProvider}
                onChange={e =>
                  handleInputChange('currentProvider', e.target.value)
                }
              />
            </div>

            {/* Describe Requirement */}
            <div className='space-y-2'>
              <Label htmlFor='requirement' className='text-sm font-medium'>
                Describe your requirement (Optional)
              </Label>
              <Textarea
                id='requirement'
                placeholder='Describe your specific requirements...'
                value={formData.requirement}
                onChange={e => handleInputChange('requirement', e.target.value)}
                rows={4}
                className='resize-none'
              />
            </div>

            {/* Submit Button */}
            <DialogFooter className='flex gap-3 sm:justify-end pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowEnquiryModal(false)}
                className='min-w-20'
              >
                Cancel
              </Button>
              <Button type='submit' variant='default' className='min-w-20'>
                Submit Enquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function GpuBaremetalPricingCards() {
  const [search, setSearch] = useState('');

  const filteredConfigs = gpuBaremetalConfigs.filter(config => {
    const searchLower = search.toLowerCase();
    return (
      config.flavour.toLowerCase().includes(searchLower) ||
      config.architecture.toLowerCase().includes(searchLower) ||
      config.vcpus.toString().includes(searchLower) ||
      config.memory.toLowerCase().includes(searchLower) ||
      config.gpus.toString().includes(searchLower)
    );
  });

  return (
    <div className='space-y-4'>
      <div className='relative w-full max-w-xs mb-2'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search Flavour...'
          className='pl-8'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredConfigs.map((config, index) => (
          <GpuBaremetalPricingCard key={index} {...config} />
        ))}
      </div>
    </div>
  );
}
