import React from 'react';

interface AccessUsageIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function AccessUsageIcon({
  className = '',
  width = 24,
  height = 24,
}: AccessUsageIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 18 18'
      className={className}
    >
      <title>file-key</title>
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
        <path d='M15.25 12.153V6.664C15.25 6.399 15.145 6.144 14.957 5.957L11.043 2.043C10.855 1.855 10.601 1.75 10.336 1.75H4.75C3.645 1.75 2.75 2.646 2.75 3.75V14.25C2.75 15.354 3.645 16.25 4.75 16.25H6.3506'></path>
        <path d='M11.25 17.25C12.3546 17.25 13.25 16.3546 13.25 15.25C13.25 14.1454 12.3546 13.25 11.25 13.25C10.1454 13.25 9.25 14.1454 9.25 15.25C9.25 16.3546 10.1454 17.25 11.25 17.25Z'></path>
        <path d='M13.25 15.25H17.25'></path>
        <path d='M15.75 15.25V16.75'></path>
      </g>
    </svg>
  );
}
