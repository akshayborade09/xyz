'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AiPodsAnimatedChartProps {
  activePods: number;
  totalPods: number;
  className?: string;
}

export function AiPodsAnimatedChart({
  activePods,
  totalPods,
  className,
}: AiPodsAnimatedChartProps) {
  const [hovered, setHovered] = useState(false);
  const [hoveredPod, setHoveredPod] = useState<number | null>(null);

  const activeColor = '#10b981'; // Green for active
  const inactiveColor = '#e5e7eb'; // Light gray for inactive

  // Generate pod data
  const generatePodData = () => {
    const pods = [];
    for (let i = 0; i < totalPods; i++) {
      const isActive = i < activePods;
      pods.push({
        id: i,
        isActive,
        name: `Pod ${i + 1}`,
        status: isActive ? 'Running' : 'Stopped',
      });
    }
    return pods;
  };

  const podData = generatePodData();

  return (
    <div
      className={cn(
        'relative h-[160px] w-full overflow-hidden rounded-lg p-4',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Grid */}
      <div className='absolute inset-0 z-[1] h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-50 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]' />

      {/* Radial Gradient Background */}
      <div className='absolute inset-0 z-[2] flex h-full w-full items-center justify-center'>
        <div
          className='h-full w-full rounded-lg opacity-20'
          style={{
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${activeColor}20 0%, ${activeColor}10 34%, transparent 100%)`,
          }}
        />
      </div>

      {/* Simple Container Grid */}
      <div className='absolute inset-0 z-[4] flex h-[160px] w-full items-center justify-center p-4'>
        <div className='w-full max-w-[240px] space-y-3'>
          {/* Pods Grid */}
          <div className='grid grid-cols-3 gap-3'>
            {podData.map((pod, index) => (
              <div
                key={pod.id}
                className={cn(
                  'relative h-12 w-full rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center justify-center',
                  pod.isActive
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200',
                  hoveredPod === index ? 'scale-105 shadow-md' : 'scale-100'
                )}
                onMouseEnter={() => setHoveredPod(index)}
                onMouseLeave={() => setHoveredPod(null)}
              >
                {/* Status Indicator */}
                <div
                  className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full'
                  style={{
                    backgroundColor: pod.isActive ? activeColor : '#9ca3af',
                  }}
                />

                {/* Pod Label */}
                <span
                  className={cn(
                    'text-xs font-medium',
                    pod.isActive ? 'text-green-700' : 'text-gray-500'
                  )}
                >
                  {pod.name}
                </span>

                {/* Active Animation */}
                {pod.isActive && (
                  <div
                    className='absolute inset-0 rounded-lg opacity-20 animate-pulse'
                    style={{ backgroundColor: activeColor }}
                  />
                )}

                {/* Hover Tooltip - positioned safely */}
                {hoveredPod === index && (
                  <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-20'>
                    {pod.status}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Simple Summary */}
          <div className='text-center'>
            <div className='text-xs text-gray-500'>Container Pods</div>
          </div>
        </div>
      </div>

      {/* Top-right status - only shows on hover */}
      <div
        className={cn(
          'absolute top-2 right-2 z-[6] transition-all duration-500',
          hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        <div className='rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1.5 backdrop-blur-sm shadow-sm'>
          <p className='text-xs font-medium text-black'>
            {activePods}/{totalPods} Active
          </p>
        </div>
      </div>
    </div>
  );
}
