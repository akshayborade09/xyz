import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn('bg-card text-card-foreground rounded-lg p-6', className)}
    >
      <div className='flex flex-col items-center justify-center py-12'>
        {/* SVG Illustration or Custom Icon */}
        <div className='mb-6'>
          {icon || (
            <svg
              width='215'
              height='140'
              viewBox='0 0 215 140'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='215' height='140' fill='#FFFFFF'></rect>
              <path
                d='M64 0L64 140'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
                strokeDasharray='3 3'
              ></path>
              <path
                d='M151 0L151 140'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
                strokeDasharray='3 3'
              ></path>
              <path
                d='M215 32H0'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
                strokeDasharray='3 3'
              ></path>
              <path
                d='M215 108H0'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
                strokeDasharray='3 3'
              ></path>
              <path
                d='M215 71H0'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
                strokeDasharray='3 3'
              ></path>
              <path
                d='M199 0L199 140'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
              ></path>
              <path
                d='M16 0L16 140'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
              ></path>
              <path
                d='M0 16L215 16'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
              ></path>
              <path
                d='M0 124L215 124'
                stroke='#EEEFF1'
                strokeWidth='0.8'
                strokeMiterlimit='10'
              ></path>
              <path
                d='M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z'
                fill='#FFFFFF'
                stroke='#5C5E63'
                strokeWidth='1.1'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
            </svg>
          )}
        </div>

        <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-sm text-gray-600 text-center max-w-md mb-6'>
          {description}
        </p>

        {actionText && onAction && (
          <Button
            onClick={onAction}
            className='bg-black text-white hover:bg-black/90'
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
