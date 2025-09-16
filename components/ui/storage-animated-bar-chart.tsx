'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StorageAnimatedBarChartProps {
  allocatedGB: number;
  totalCapacityGB: number;
  volumeCount: number;
  className?: string;
}

export function StorageAnimatedBarChart({
  allocatedGB,
  totalCapacityGB,
  volumeCount,
  className,
}: StorageAnimatedBarChartProps) {
  const [hovered, setHovered] = useState(false);
  const availableGB = totalCapacityGB - allocatedGB;

  // Calculate percentages
  const allocatedPercentage = (allocatedGB / totalCapacityGB) * 100;
  const availablePercentage = (availableGB / totalCapacityGB) * 100;

  const mainColor = '#10b981'; // Green for storage
  const secondaryColor = '#e5e7eb'; // Light gray for available

  return (
    <div
      className={cn(
        'relative h-[160px] w-full overflow-hidden rounded-lg',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        {
          '--color': mainColor,
          '--secondary-color': secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Background Grid */}
      <div
        style={{ '--grid-color': '#f1f5f915' } as React.CSSProperties}
        className='pointer-events-none absolute inset-0 z-[1] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:24px_24px] bg-center opacity-40'
      />

      {/* Gradient Background */}
      <div className='absolute inset-0 z-[2] flex h-full w-full items-center justify-center'>
        <div
          className='w-full h-32 rounded-lg opacity-20'
          style={{
            background: `linear-gradient(90deg, ${mainColor}15 0%, ${mainColor}08 40%, transparent 70%)`,
          }}
        />
      </div>

      {/* Main Bar Chart Container */}
      <div className='absolute inset-0 z-[4] flex h-[160px] w-full items-center justify-center p-6'>
        <div className='w-full max-w-[200px]'>
          {/* Storage Usage Bar */}
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-xs font-medium text-gray-600'>
                Storage Usage
              </span>
              <span className='text-xs font-semibold text-gray-800'>
                {allocatedPercentage.toFixed(1)}%
              </span>
            </div>

            {/* Main Progress Bar */}
            <div className='relative h-6 bg-gray-200 rounded-full overflow-hidden'>
              {/* Allocated Storage Bar */}
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out',
                  hovered ? 'shadow-lg' : ''
                )}
                style={{
                  width: `${allocatedPercentage}%`,
                  background: `linear-gradient(90deg, ${mainColor} 0%, #059669 100%)`,
                  transform: hovered ? 'scaleY(1.1)' : 'scaleY(1)',
                  filter: hovered
                    ? 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))'
                    : 'none',
                }}
              />

              {/* Usage Text Overlay */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-xs font-semibold text-white drop-shadow-sm'>
                  {allocatedGB} GB / {totalCapacityGB} GB
                </span>
              </div>
            </div>
          </div>

          {/* Volume Count Bar */}
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-xs font-medium text-gray-600'>
                Volume Distribution
              </span>
              <span className='text-xs font-semibold text-gray-800'>
                {volumeCount} Volumes
              </span>
            </div>

            {/* Volume Visualization */}
            <div className='flex gap-1'>
              {Array.from({ length: Math.min(volumeCount, 15) }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-3 flex-1 rounded transition-all duration-500',
                    hovered ? 'transform scale-y-125' : ''
                  )}
                  style={{
                    background:
                      index < volumeCount * 0.7 ? mainColor : secondaryColor,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Info */}
      <div
        className={cn(
          'absolute top-2 right-2 z-[6] transition-all duration-500',
          hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        <div className='rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1.5 backdrop-blur-sm shadow-lg'>
          <div className='flex items-center gap-1.5'>
            <div className='h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color)]' />
            <p className='text-xs font-medium text-black'>
              {allocatedPercentage.toFixed(1)}% Utilized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
