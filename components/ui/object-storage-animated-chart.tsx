'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ObjectStorageAnimatedChartProps {
  storageUsed: number;
  totalCapacity: number;
  totalBuckets: number;
  className?: string;
}

export function ObjectStorageAnimatedChart({
  storageUsed,
  totalCapacity,
  totalBuckets,
  className,
}: ObjectStorageAnimatedChartProps) {
  const [hovered, setHovered] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState<number | null>(null);

  // Calculate storage metrics
  const usagePercentage = (storageUsed / totalCapacity) * 100;
  const availableStorage = totalCapacity - storageUsed;

  const mainColor = '#0ea5e9'; // Sky blue for object storage
  const secondaryColor = '#f1f5f9'; // Very light gray

  // Generate bucket data - simulate different usage levels across buckets
  const generateBucketData = () => {
    const buckets = [];
    const avgStoragePerBucket = storageUsed / totalBuckets;

    for (let i = 0; i < totalBuckets; i++) {
      // Vary the storage per bucket with some randomness
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const bucketStorage = Math.max(
        0.1,
        avgStoragePerBucket * (1 + variation)
      );
      const maxBucketCapacity = totalCapacity / totalBuckets;
      const fillPercentage = Math.min(
        95,
        (bucketStorage / maxBucketCapacity) * 100
      );

      buckets.push({
        id: i,
        storage: bucketStorage,
        fillPercentage: fillPercentage,
        name: `Bucket ${i + 1}`,
      });
    }
    return buckets;
  };

  const bucketData = generateBucketData();

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
            background: `radial-gradient(ellipse, ${mainColor}15 0%, ${mainColor}08 40%, transparent 70%)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className='absolute inset-0 z-[4] flex h-[160px] w-full items-center justify-center p-3'>
        <div className='w-full max-w-[260px] space-y-4'>
          {/* Adaptive Bucket Visualization */}
          {totalBuckets <= 12 ? (
            /* Individual Bucket View (≤12 buckets) */
            <div className='grid grid-cols-4 gap-3 px-2'>
              {bucketData.map((bucket, index) => (
                <div
                  key={bucket.id}
                  className={cn(
                    'relative h-10 cursor-pointer transition-all duration-300',
                    hoveredBucket === index ? 'z-10 transform scale-110' : ''
                  )}
                  onMouseEnter={() => setHoveredBucket(index)}
                  onMouseLeave={() => setHoveredBucket(null)}
                >
                  <div className='relative h-full w-full'>
                    <div
                      className='absolute inset-0 rounded-lg border transition-all duration-300'
                      style={{
                        borderColor:
                          hoveredBucket === index ? mainColor : '#e2e8f0',
                        backgroundColor: '#f8fafc',
                      }}
                    />
                    <div
                      className='absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-700 ease-out'
                      style={{
                        height: `${bucket.fillPercentage}%`,
                        background: `linear-gradient(180deg, ${mainColor}cc 0%, ${mainColor} 100%)`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                    {hoveredBucket === index && (
                      <div className='absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap'>
                        {bucket.storage.toFixed(1)} GB
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Compact Bar View (>12 buckets) */
            <div className='space-y-3'>
              {/* Usage Distribution Bar */}
              <div className='space-y-2'>
                <div className='flex justify-between text-xs'>
                  <span className='text-gray-600'>Storage Distribution</span>
                  <span className='text-gray-500'>{totalBuckets} Buckets</span>
                </div>
                <div className='h-6 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full transition-all duration-1000 ease-out'
                    style={{
                      width: `${usagePercentage}%`,
                      background: `linear-gradient(90deg, ${mainColor} 0%, #0284c7 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Bucket Size Distribution */}
              <div className='space-y-2'>
                <div className='text-xs text-gray-600'>Bucket Sizes</div>
                <div className='flex gap-1 h-4'>
                  {Array.from(
                    { length: Math.min(totalBuckets, 20) },
                    (_, index) => {
                      const bucket = bucketData[index];
                      if (!bucket) {
                        return null;
                      }
                      const widthPercent = (bucket.storage / storageUsed) * 100;
                      return (
                        <div
                          key={index}
                          className={cn(
                            'h-full rounded-sm transition-all duration-300 cursor-pointer',
                            hoveredBucket === index
                              ? 'transform scale-y-125'
                              : ''
                          )}
                          style={{
                            width: `${Math.max(4, widthPercent)}%`,
                            background:
                              hoveredBucket === index
                                ? mainColor
                                : `${mainColor}aa`,
                          }}
                          onMouseEnter={() => setHoveredBucket(index)}
                          onMouseLeave={() => setHoveredBucket(null)}
                          title={`Bucket ${index + 1}: ${bucket.storage.toFixed(1)} GB`}
                        />
                      );
                    }
                  )}
                  {totalBuckets > 20 && (
                    <div className='h-full w-6 rounded-sm bg-gray-300 flex items-center justify-center'>
                      <span className='text-[8px] text-gray-600'>
                        +{totalBuckets - 20}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Clean Storage Summary */}
          <div className='text-center'>
            <div className='text-xs text-gray-500'>
              {totalBuckets <= 12
                ? `${totalBuckets} Storage Buckets`
                : 'Object Storage Distribution'}
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
          <div className='text-xs font-medium text-black text-center'>
            <div>{totalBuckets} Buckets</div>
            <div className='text-gray-600 font-normal'>
              Avg {(storageUsed / totalBuckets).toFixed(1)} GB each
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
