'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { CalendarIcon } from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { getTooltipContent } from '@/lib/tooltip-content';
import type { DateRange } from 'react-day-picker';

interface UsageActionBarProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function UsageActionBar({ date, setDate }: UsageActionBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const presets = [
    {
      label: 'Last 7 days',
      range: { from: subDays(new Date(), 7), to: new Date() },
    },
    {
      label: 'Last 30 days',
      range: { from: subDays(new Date(), 30), to: new Date() },
    },
    {
      label: 'Last 3 months',
      range: { from: subMonths(new Date(), 3), to: new Date() },
    },
    {
      label: 'This month',
      range: {
        from: startOfMonth(new Date()),
        to: new Date(),
      },
    },
    {
      label: 'Last month',
      range: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
  ];

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    setDate(preset.range);
    setIsOpen(false);
    setIsSelecting(false);
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    // Track selection state for better UX feedback
    if (selectedDate?.from && selectedDate?.to) {
      setIsSelecting(false);
    } else if (selectedDate?.from && !selectedDate?.to) {
      setIsSelecting(true);
    } else {
      setIsSelecting(false);
    }
  };

  return (
    <div className='flex flex-wrap gap-2 justify-end mb-6'>
      <TooltipWrapper content={getTooltipContent('billing', 'export')}>
        <Button variant='outline' className='h-10 px-4 rounded-md'>
          Export Report
        </Button>
      </TooltipWrapper>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <TooltipWrapper content='Select date range for usage report'>
          <PopoverTrigger asChild>
            <Button
              id='date-range'
              variant='outline'
              className='ml-2 min-w-[260px] justify-start text-left font-normal rounded-md h-10 px-4'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  <span className='text-blue-600'>
                    From: {format(date.from, 'LLL dd, y')} | Select end date
                  </span>
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipWrapper>

        <PopoverContent className='w-auto p-0 flex' align='end'>
          {/* Quick Presets Sidebar */}
          <div className='w-48 p-4 border-r bg-gray-50'>
            <h4 className='font-medium text-sm mb-3 text-gray-700'>
              Quick Select
            </h4>
            <div className='space-y-2'>
              {presets.map(preset => (
                <Button
                  key={preset.label}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start h-9 text-sm text-left px-3 py-2 hover:bg-gray-100'
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Current Selection Status */}
            {date?.from && (
              <div className='mt-4 pt-3 border-t'>
                <h5 className='font-medium text-xs text-gray-600 mb-2'>
                  Current Selection
                </h5>
                <div className='text-xs text-gray-500 space-y-1'>
                  <div>Start: {format(date.from, 'MMM dd, y')}</div>
                  {date.to ? (
                    <div>End: {format(date.to, 'MMM dd, y')}</div>
                  ) : (
                    <div className='text-blue-600'>Select end date →</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className='p-3'>
            {/* Selection Progress Indicator */}
            {isSelecting && date?.from && (
              <div className='mb-3 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700'>
                <span className='font-medium'>Start:</span>{' '}
                {format(date.from, 'LLL dd, y')}
                <br />
                <span className='text-gray-600'>Now select an end date</span>
              </div>
            )}

            <Calendar
              initialFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              className='rounded-md'
              modifiers={{
                ...(date?.from && { start: date.from }),
                ...(date?.to && { end: date.to }),
              }}
              modifiersStyles={{
                start: {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                },
                end: {
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
