'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VMAnimatedPieChartProps {
  activeVMs: number;
  totalVMs: number;
  className?: string;
}

export function VMAnimatedPieChart({
  activeVMs,
  totalVMs,
  className,
}: VMAnimatedPieChartProps) {
  const [hovered, setHovered] = useState(false);
  const inactiveVMs = totalVMs - activeVMs;

  // Calculate percentages
  const activePercentage = (activeVMs / totalVMs) * 100;
  const inactivePercentage = (inactiveVMs / totalVMs) * 100;

  // Calculate angles for pie segments
  const activeAngle = (activePercentage / 100) * 360;
  const inactiveAngle = (inactivePercentage / 100) * 360;

  const mainColor = '#4CAF50'; // Krutrim green for active VMs
  const secondaryColor = '#e5e7eb'; // Light gray for inactive VMs

  // Create SVG path for pie segments
  const createPieSlice = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    const start = polarToCartesian(80, 80, outerRadius, endAngle);
    const end = polarToCartesian(80, 80, outerRadius, startAngle);
    const innerStart = polarToCartesian(80, 80, innerRadius, endAngle);
    const innerEnd = polarToCartesian(80, 80, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      innerEnd.x,
      innerEnd.y,
      'A',
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      'Z',
    ].join(' ');
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

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
          className='w-32 h-32 rounded-full opacity-20'
          style={{
            background: `radial-gradient(circle, ${mainColor}15 0%, ${mainColor}08 40%, transparent 70%)`,
          }}
        />
      </div>

      {/* Animated Pie Chart */}
      <div className='absolute inset-0 z-[4] flex h-[160px] w-full items-center justify-center'>
        <div
          className={cn(
            'transition-all duration-700 ease-out',
            hovered ? 'scale-105' : 'scale-100'
          )}
        >
          <svg
            width='140'
            height='140'
            viewBox='0 0 160 160'
            className='drop-shadow-sm'
          >
            {/* Active VMs Segment */}
            <path
              d={createPieSlice(0, activeAngle, 45, hovered ? 72 : 70)}
              fill={mainColor}
              stroke='white'
              strokeWidth='2'
              className='transition-all duration-500 ease-out hover:brightness-110'
              style={{
                filter: hovered
                  ? 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
                  : 'none',
              }}
            />

            {/* Inactive VMs Segment */}
            <path
              d={createPieSlice(activeAngle, 360, 45, hovered ? 72 : 70)}
              fill={secondaryColor}
              stroke='white'
              strokeWidth='2'
              className='transition-all duration-500 ease-out hover:brightness-95'
            />

            {/* Center circle for clean donut look */}
            <circle
              cx='80'
              cy='80'
              r='45'
              fill='white'
              className='drop-shadow-sm'
            />
          </svg>
        </div>
      </div>

      {/* Hover Info - positioned to avoid center overlap */}
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
              {activePercentage.toFixed(1)}% Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
