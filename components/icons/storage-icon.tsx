import React from 'react';

interface StorageIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function StorageIcon({
  className = '',
  width = 24,
  height = 24,
}: StorageIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 18 18'
      className={className}
    >
      <title>box-archive-3</title>
      <g
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.3'
        stroke='currentColor'
      >
        <path d='M2.75 5.25L5 2.25H13L15.25 5.25'></path>
        <path d='M2.75 5.25H15.25V13.75C15.25 14.854 14.354 15.75 13.25 15.75H4.75C3.646 15.75 2.75 14.854 2.75 13.75V5.25Z'></path>
        <path d='M11 8.25H7'></path>
      </g>
    </svg>
  );
}
