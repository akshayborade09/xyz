import React from 'react';

interface ObjectStorageIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ObjectStorageIcon({
  className = '',
  width = 24,
  height = 24,
}: ObjectStorageIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M19 11H4.99996C4.26396 11 3.66663 11.5973 3.66663 12.3333V19C3.66663 19.736 4.26396 20.3333 4.99996 20.3333H19C19.736 20.3333 20.3333 19.736 20.3333 19V12.3333C20.3333 11.5973 19.736 11 19 11Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.33325 8.33333C4.33325 7.59733 4.93059 7 5.66659 7H18.3333C19.0693 7 19.6666 7.59733 19.6666 8.33333'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5 4.33333C5 3.59733 5.59733 3 6.33333 3H17.6667C18.4027 3 19 3.59733 19 4.33333'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
