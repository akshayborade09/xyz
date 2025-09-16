import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, HardDrive, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

// AMD Logo Component
function AmdLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      height='24'
      width='24'
      className={className}
    >
      <path
        fill='#000000'
        fillRule='evenodd'
        d='M5 1a4 4 0 0 0 -4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4 -4V5a4 4 0 0 0 -4 -4H5Zm14.5 3.5h-15l4.09 4.09h6.82v6.82l4.09 4.09v-15Zm-15 9.546 4.09 -4.091v5.454h5.796l-4.09 4.091H4.5v-5.454Z'
        clipRule='evenodd'
        strokeWidth='1'
      />
    </svg>
  );
}

interface PricingCardProps {
  flavour: string;
  vcpus: number;
  memory: number;
  price: number;
  architecture: string;
  availability: 'Low' | 'Medium' | 'High';
  network: string;
}

const pricingConfigs: PricingCardProps[] = [
  {
    flavour: 'CPU-1x-4GB',
    vcpus: 1,
    memory: 4,
    price: 3,
    architecture: 'AMD EPYC 9554',
    availability: 'High',
    network: 'Upto 10GBps',
  },
  {
    flavour: 'CPU-2x-8GB',
    vcpus: 2,
    memory: 8,
    price: 6,
    architecture: 'AMD EPYC 9554',
    availability: 'High',
    network: 'Upto 10GBps',
  },
  {
    flavour: 'CPU-4x-16GB',
    vcpus: 4,
    memory: 16,
    price: 12,
    architecture: 'AMD EPYC 9554',
    availability: 'High',
    network: 'Upto 10GBps',
  },
  {
    flavour: 'CPU-8x-32GB',
    vcpus: 8,
    memory: 32,
    price: 24,
    architecture: 'AMD EPYC 9554',
    availability: 'Medium',
    network: 'Upto 10GBps',
  },
  {
    flavour: 'CPU-16x-64GB',
    vcpus: 16,
    memory: 64,
    price: 48,
    architecture: 'AMD EPYC 9554',
    availability: 'Low',
    network: 'Upto 10GBps',
  },
];

function getAvailabilityColor(availability: string) {
  switch (availability) {
    case 'High':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function PricingCard({
  flavour,
  vcpus,
  memory,
  price,
  architecture,
  availability,
  network,
}: PricingCardProps) {
  return (
    <Card className='relative w-full transition-all duration-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2 mb-2'>
          <AmdLogo className='h-5 w-5' />
          <h3 className='text-base font-medium text-foreground'>
            {architecture}
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
        {/* Basic Specs */}
        <div className='grid grid-cols-2 gap-4 text-sm'>
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
            <span className='font-medium'>{memory} GB</span>
          </div>
        </div>

        {/* Additional Specs */}
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              Network
            </span>
            <span className='font-medium'>{network}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-xs uppercase tracking-wide'>
              Availability
            </span>
            <Badge
              className={`${getAvailabilityColor(availability)} text-xs px-2 py-0.5 pointer-events-none`}
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
          onClick={() => (window.location.href = '/compute/vms/cpu/create')}
        >
          Create VM
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CpuPricingCards() {
  const [search, setSearch] = useState('');

  const filteredConfigs = pricingConfigs.filter(config => {
    const searchLower = search.toLowerCase();
    return (
      config.flavour.toLowerCase().includes(searchLower) ||
      config.architecture.toLowerCase().includes(searchLower) ||
      config.vcpus.toString().includes(searchLower) ||
      config.memory.toString().includes(searchLower) ||
      config.availability.toLowerCase().includes(searchLower)
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
          <PricingCard key={index} {...config} />
        ))}
      </div>
    </div>
  );
}
