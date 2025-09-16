import React from 'react';

interface NetworkingIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function NetworkingIcon({
  className = '',
  width = 24,
  height = 24,
}: NetworkingIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 18 18'
      className={className}
    >
      <title>connect</title>
      <g
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.3'
        stroke='currentColor'
      >
        <circle cx='5' cy='13' r='2.25'></circle>
        <circle cx='13' cy='5' r='2.25'></circle>
        <circle cx='13' cy='13' r='2.25'></circle>
        <circle cx='5' cy='5' r='2.25'></circle>
        <line x1='6.5907' y1='11.4093' x2='11.4095' y2='6.5905'></line>
      </g>
    </svg>
  );
}
