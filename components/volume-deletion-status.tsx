import { useState, useEffect } from 'react';
import { TooltipWrapper } from './ui/tooltip-wrapper';

interface VolumeDeletionStatusProps {
  volume: {
    id: string;
    name: string;
    status: string;
    deletionStartedOn?: string;
    estimatedDeletionTime?: number; // in minutes
  };
  showProgress?: boolean;
  compact?: boolean;
}

export function VolumeDeletionStatus({
  volume,
  showProgress = true,
  compact = false,
}: VolumeDeletionStatusProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (volume.status !== 'deleting' || !volume.deletionStartedOn) {
      return;
    }

    const updateProgress = () => {
      const deletionStarted = new Date(volume.deletionStartedOn!).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - deletionStarted) / 1000 / 60); // minutes elapsed
      const estimatedTotal = volume.estimatedDeletionTime || 10;

      setTimeElapsed(elapsed);

      // Calculate progress (max 95% until actually complete)
      const calculatedProgress = Math.min((elapsed / estimatedTotal) * 100, 95);
      setProgress(calculatedProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [volume.deletionStartedOn, volume.estimatedDeletionTime, volume.status]);

  if (volume.status !== 'deleting') {
    return null;
  }

  const formatTimeRemaining = () => {
    const estimatedTotal = volume.estimatedDeletionTime || 10;
    const remaining = Math.max(0, estimatedTotal - timeElapsed);
    if (remaining === 0) {
      return 'Completing...';
    }
    return `~${remaining} min remaining`;
  };

  const AnimatedDots = () => (
    <div className='flex items-center gap-0.5'>
      <div
        className='w-1 h-1 rounded-full animate-pulse'
        style={{ backgroundColor: 'rgb(165, 47, 46)', animationDelay: '0s' }}
      ></div>
      <div
        className='w-1 h-1 rounded-full animate-pulse'
        style={{ backgroundColor: 'rgb(165, 47, 46)', animationDelay: '0.2s' }}
      ></div>
      <div
        className='w-1 h-1 rounded-full animate-pulse'
        style={{ backgroundColor: 'rgb(165, 47, 46)', animationDelay: '0.4s' }}
      ></div>
    </div>
  );

  if (compact) {
    return (
      <TooltipWrapper
        content={`Volume deletion in progress. Started ${timeElapsed} minutes ago. ${formatTimeRemaining()}`}
      >
        <span
          className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'
          style={{
            background:
              'linear-gradient(263deg, rgba(255, 109, 107, 0.08) 6.86%, rgba(255, 109, 107, 0.02) 96.69%)',
            color: 'rgb(165, 47, 46)',
            boxShadow: 'rgba(255, 109, 107, 0.1) 0px 0px 0px 1px inset',
          }}
        >
          Deleting
          <AnimatedDots />
        </span>
      </TooltipWrapper>
    );
  }

  return null;
}
