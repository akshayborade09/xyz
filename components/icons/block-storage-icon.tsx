import React from 'react';

interface BlockStorageIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BlockStorageIcon({
  className = '',
  width = 24,
  height = 24,
}: BlockStorageIconProps) {
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
        d='M12 11.6667C16.6023 11.6667 20.3333 9.72657 20.3333 7.33333C20.3333 4.9401 16.6023 3 12 3C7.39759 3 3.66663 4.9401 3.66663 7.33333C3.66663 9.72657 7.39759 11.6667 12 11.6667Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20.2573 12.5893C19.704 14.704 16.2187 16.3333 12 16.3333C7.78268 16.3333 4.29601 14.704 3.74268 12.5893'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20.2573 17.256C19.704 19.3707 16.2187 21 12 21C7.78268 21 4.29601 19.3707 3.74268 17.256'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
