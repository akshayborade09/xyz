'use client';

import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const regions = [
  { id: 'in-west', name: 'India West', code: 'IN' },
  { id: 'in-central', name: 'India Central', code: 'IN' },
  { id: 'in-south', name: 'India South', code: 'IN' },
  { id: 'us-east', name: 'US East', code: 'US' },
  { id: 'eu-central', name: 'EU Central', code: 'EU' },
];

export function RegionSelector() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-2 h-9 px-2'>
          <Globe className='h-4 w-4' />
          <span>{selectedRegion.name}</span>
          <ChevronDown className='h-4 w-4 ml-1 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        {regions.map(region => (
          <DropdownMenuItem
            key={region.id}
            className='flex items-center justify-between'
            onClick={() => setSelectedRegion(region)}
          >
            <span>{region.name}</span>
            {selectedRegion.id === region.id && <Check className='h-4 w-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
