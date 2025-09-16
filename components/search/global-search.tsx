'use client';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCommandPalette } from '@/components/command/command-palette-context';

export function GlobalSearch() {
  const { setOpen } = useCommandPalette();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setOpen(true)}
            className='relative w-full border-gray-300 text-gray-700 flex items-center justify-between'
          >
            <span className='flex items-center gap-2'>
              <MagnifyingGlassIcon className='h-4 w-4' />
              <span className='text-gray-500'>Search</span>
            </span>
            <div className='flex items-center bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200'>
              <span className='text-xs mr-0.5'>⌘</span>
              <span className='text-xs'>K</span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Press{' '}
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs'>
              ⌘
            </kbd>
            <kbd className='px-1.5 py-0.5 bg-muted border rounded text-xs'>
              K
            </kbd>{' '}
            to search
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
