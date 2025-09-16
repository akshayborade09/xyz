'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type HealthStatus =
  | 'healthy'
  | 'unhealthy'
  | 'partial'
  | 'no-targets'
  | 'draining'
  | 'unknown';

interface HealthIndicatorProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  healthy: {
    color: 'bg-green-500',
    label: 'Healthy',
    textColor: 'text-green-700',
  },
  unhealthy: {
    color: 'bg-red-500',
    label: 'Unhealthy',
    textColor: 'text-red-700',
  },
  partial: {
    color: 'bg-yellow-500',
    label: 'Partially Healthy',
    textColor: 'text-yellow-700',
  },
  'no-targets': {
    color: 'bg-gray-400',
    label: 'No Targets',
    textColor: 'text-gray-600',
  },
  draining: {
    color: 'bg-blue-500',
    label: 'Draining',
    textColor: 'text-blue-700',
  },
  unknown: {
    color: 'bg-gray-400',
    label: 'Unknown',
    textColor: 'text-gray-600',
  },
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function HealthIndicator({
  status,
  size = 'md',
  showLabel = false,
  className,
}: HealthIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn('rounded-full flex-shrink-0', config.color, sizeClass)}
        aria-label={config.label}
      />
      {showLabel && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

// Helper function to calculate overall health from target groups
export function calculateOverallHealth(
  targetGroups: any[],
  operatingStatus?: string
): HealthStatus {
  if (!targetGroups || targetGroups.length === 0) {
    return 'no-targets';
  }

  // If the load balancer itself is not active, return unknown
  if (operatingStatus && operatingStatus !== 'active') {
    return 'unknown';
  }

  // Count health statuses
  const healthCounts = targetGroups.reduce(
    (acc, group) => {
      const health = group.status || 'unknown';
      acc[health] = (acc[health] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = targetGroups.length;
  const healthy = healthCounts.healthy || 0;
  const unhealthy = healthCounts.unhealthy || 0;
  const draining = healthCounts.draining || 0;

  // Determine overall health
  if (healthy === total) {
    return 'healthy';
  } else if (unhealthy === total) {
    return 'unhealthy';
  } else if (draining > 0) {
    return 'draining';
  } else if (healthy > 0) {
    return 'partial';
  } else {
    return 'unknown';
  }
}

export default HealthIndicator;
