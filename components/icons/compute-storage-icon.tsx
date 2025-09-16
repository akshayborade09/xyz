import React from 'react';

interface ComputeStorageIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ComputeStorageIcon({
  className = '',
  width = 24,
  height = 24,
}: ComputeStorageIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 18 18'
      className={className}
    >
      <title>file-cloud</title>
      <g
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.3'
        stroke='currentColor'
      >
        <path d='M5.75 6.75H7.75'></path>
        <path d='M5.75 9.75H10.25'></path>
        <path d='M15.16 6.24999H11.75C11.198 6.24999 10.75 5.80199 10.75 5.24999V1.85199'></path>
        <path d='M15.25 8.8006V6.664C15.25 6.399 15.145 6.144 14.957 5.957L11.043 2.043C10.855 1.855 10.601 1.75 10.336 1.75H4.75C3.645 1.75 2.75 2.646 2.75 3.75V14.25C2.75 15.354 3.645 16.25 4.75 16.25H6.8122'></path>
        <path d='M14.5 11.75C13.2297 11.75 12.1711 12.616 11.8553 13.7864C11.7405 13.7627 11.6217 13.75 11.5 13.75C10.5335 13.75 9.75 14.5335 9.75 15.5C9.75 16.4665 10.5335 17.25 11.5 17.25H14.5C16.0188 17.25 17.25 16.0187 17.25 14.5C17.25 12.9813 16.0188 11.75 14.5 11.75Z'></path>
      </g>
    </svg>
  );
}
