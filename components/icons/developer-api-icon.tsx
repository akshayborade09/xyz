import React from 'react';

interface DeveloperApiIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function DeveloperApiIcon({
  className = '',
  width = 24,
  height = 24,
}: DeveloperApiIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      <path
        d='M7.66663 9H10.3333'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.66663 13H13.6666'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20.2133 8.33333H15.6666C14.9306 8.33333 14.3333 7.736 14.3333 7V2.46933'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16 21.04L18.52 18.52L16 16'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.24 21.04H22'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20.3333 10.3333V8.88548C20.3333 8.53201 20.1933 8.19214 19.9426 7.94281L14.724 2.72401C14.4733 2.47334 14.1346 2.33334 13.7813 2.33334H6.33329C4.85996 2.33334 3.66663 3.52801 3.66663 5.00001V19C3.66663 20.472 4.85996 21.6667 6.33329 21.6667H13'
        stroke='#212121'
        strokeWidth='1.73'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
