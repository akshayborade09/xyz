import React from 'react';

interface ComputeIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ComputeIcon({
  className = '',
  width = 24,
  height = 24,
}: ComputeIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      className={className}
    >
      <title>compute-infrastructure</title>
      <g
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        stroke='currentColor'
      >
        <circle
          cx='8.67'
          cy='3'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='15.33'
          cy='3'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='21'
          cy='8.67'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='21'
          cy='15.33'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='15.33'
          cy='21'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='8.67'
          cy='21'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='3'
          cy='15.33'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle
          cx='3'
          cy='8.67'
          r='1.33'
          fill='currentColor'
          data-stroke='none'
          stroke='none'
        ></circle>
        <circle cx='8.67' cy='8.67' r='1.67'></circle>
        <circle cx='15.33' cy='8.67' r='1.67'></circle>
        <circle cx='8.67' cy='15.33' r='1.67'></circle>
        <circle cx='15.33' cy='15.33' r='1.67'></circle>
      </g>
    </svg>
  );
}
