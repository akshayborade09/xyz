import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HoverArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'button';
  showIcon?: boolean;
}

export function HoverArrowLink({
  href,
  children,
  className,
  variant = 'default',
  showIcon = true,
}: HoverArrowLinkProps) {
  const baseClasses =
    'group inline-flex items-center gap-1 transition-all duration-200 whitespace-nowrap align-baseline';

  if (variant === 'button') {
    return (
      <Link href={href} className={cn(baseClasses, className)}>
        <span>{children}</span>
        {showIcon && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            viewBox='0 0 12 12'
            className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0'
          >
            <title>arrow-to-corner-top-right</title>
            <g
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              stroke='#212121'
            >
              <line x1='1.25' y1='10.75' x2='7.073' y2='4.927'></line>
              <polyline points='7.25 9 7.25 4.75 3 4.75'></polyline>
              <path d='m2.5,1.25h6.25c1.105,0,2,.895,2,2v6.25'></path>
            </g>
          </svg>
        )}
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(baseClasses, 'hover:underline', className)}>
      <span>{children}</span>
      {showIcon && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='12'
          height='12'
          viewBox='0 0 12 12'
          className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0'
        >
          <title>arrow-to-corner-top-right</title>
          <g
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            stroke='#212121'
          >
            <line x1='1.25' y1='10.75' x2='7.073' y2='4.927'></line>
            <polyline points='7.25 9 7.25 4.75 3 4.75'></polyline>
            <path d='m2.5,1.25h6.25c1.105,0,2,.895,2,2v6.25'></path>
          </g>
        </svg>
      )}
    </Link>
  );
}
