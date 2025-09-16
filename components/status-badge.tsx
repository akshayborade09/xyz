import { TooltipWrapper } from './ui/tooltip-wrapper';
import { getTooltipContent } from '@/lib/tooltip-content';

interface StatusBadgeProps {
  status: string;
  tooltip?: string;
}

/**
 * @component StatusBadge
 * @description Displays a colored badge indicating status with consistent colors
 * @status Active
 * @example
 * <StatusBadge status="active" />      // Green badge
 * <StatusBadge status="completed" />   // Green badge
 * <StatusBadge status="in-progress" /> // Yellow badge
 * <StatusBadge status="failed" />      // Red badge
 * <StatusBadge status="inactive" />    // Gray badge
 * <StatusBadge status="incremental" /> // Purple badge
 * <StatusBadge status="full" />        // Blue badge
 */
export function StatusBadge({ status, tooltip }: StatusBadgeProps) {
  // Handle undefined/null status values
  if (!status) {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground'>
        Unknown
      </span>
    );
  }

  let bgColor = 'bg-secondary';
  let textColor = 'text-secondary-foreground';

  /*
   * Color Reference:
   * 🟢 Green (Success): #dcfce7 bg / #166534 text
   * 🟡 Yellow (Warning): #fef3c7 bg / #92400e text
   * 🔴 Red (Error): #fecaca bg / #991b1b text
   * 🔵 Blue (Info): #dbeafe bg / #1e40af text
   * 🟣 Purple (Special): #e9d5ff bg / #6b21a8 text
   * 🟠 Orange (Maintenance): #fed7aa bg / #c2410c text
   * ⚫ Gray (Default): #f1f5f9 bg / #475569 text
   */

  switch (status.toLowerCase()) {
    // Active/Success States - Green (#22c55e / #16a34a)
    case 'active':
    case 'running':
    case 'available':
    case 'completed':
    case 'success':
    case 'operational':
    case 'attached':
    case 'public':
    case 'healthy':
    case 'tcp':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;

    // Progress/Warning States - Yellow (#eab308 / #a16207)
    case 'pending':
    case 'provisioning':
    case 'updating':
    case 'in-progress':
    case 'processing':
    case 'deploying':
    case 'warning':
    case 'degraded':
    case 'draining':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;

    // Error/Failed States - Red (#ef4444 / #dc2626)
    case 'stopped':
    case 'error':
    case 'failed':
    case 'terminated':
    case 'incomplete':
    case 'incompleted':
    case 'rejected':
    case 'cancelled':
    case 'unhealthy':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;

    // Info/Neutral States - Blue (#3b82f6 / #1d4ed8)
    case 'private':
    case 'draft':
    case 'scheduled':
    case 'queued':
    case 'created':
    case 'full':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;

    // Inactive/Disabled States - Grey (#6b7280 / #4b5563)
    case 'inactive':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-600';
      break;

    // Special Protocol States - Purple (#8b5cf6 / #7c3aed)
    case 'udp':
    case 'incremental':
    case 'partial':
    case 'limited':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;

    // Network/Protocol States - Orange (#f97316 / #ea580c)
    case 'icmp':
    case 'maintenance':
    case 'paused':
    case 'suspended':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      break;

    // Deleting State - Blue (#3b82f6 / #1d4ed8)
    case 'deleting':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;

    // Offline States - Gray (#6b7280 / #374151)
    case 'offline':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;

    // Neutral/Default States - Gray (#6b7280 / #374151)
    case 'all':
    case 'unknown':
    case 'unassigned':
    case 'disabled':
    case 'inactive':
      bgColor = 'bg-secondary';
      textColor = 'text-secondary-foreground';
      break;
  }

  const badge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${bgColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );

  const tooltipContent =
    tooltip || getTooltipContent('status', status.toLowerCase());

  return <TooltipWrapper content={tooltipContent}>{badge}</TooltipWrapper>;
}
