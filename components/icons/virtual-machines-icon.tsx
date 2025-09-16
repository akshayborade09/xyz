import React from 'react';

interface VirtualMachinesIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function VirtualMachinesIcon({
  className = '',
  width = 24,
  height = 24,
}: VirtualMachinesIconProps) {
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
        d='M8 8V16H16V8H8Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11C20.4477 11 20 11.4477 20 12C20 12.5523 20.4477 13 21 13Z'
        fill='currentColor'
      />
      <path
        d='M21 8.5C21.5523 8.5 22 8.05228 22 7.5C22 6.94772 21.5523 6.5 21 6.5C20.4477 6.5 20 6.94772 20 7.5C20 8.05228 20.4477 8.5 21 8.5Z'
        fill='currentColor'
      />
      <path
        d='M21 17.5C21.5523 17.5 22 17.0523 22 16.5C22 15.9477 21.5523 15.5 21 15.5C20.4477 15.5 20 15.9477 20 16.5C20 17.0523 20.4477 17.5 21 17.5Z'
        fill='currentColor'
      />
      <path
        d='M21 4C21.5523 4 22 3.55228 22 3C22 2.44772 21.5523 2 21 2C20.4477 2 20 2.44772 20 3C20 3.55228 20.4477 4 21 4Z'
        fill='currentColor'
      />
      <path
        d='M21 22C21.5523 22 22 21.5523 22 21C22 20.4477 21.5523 20 21 20C20.4477 20 20 20.4477 20 21C20 21.5523 20.4477 22 21 22Z'
        fill='currentColor'
      />
      <path
        d='M3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13Z'
        fill='currentColor'
      />
      <path
        d='M3 8.5C3.55228 8.5 4 8.05228 4 7.5C4 6.94772 3.55228 6.5 3 6.5C2.44772 6.5 2 6.94772 2 7.5C2 8.05228 2.44772 8.5 3 8.5Z'
        fill='currentColor'
      />
      <path
        d='M3 17.5C3.55228 17.5 4 17.0523 4 16.5C4 15.9477 3.55228 15.5 3 15.5C2.44772 15.5 2 15.9477 2 16.5C2 17.0523 2.44772 17.5 3 17.5Z'
        fill='currentColor'
      />
      <path
        d='M3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4Z'
        fill='currentColor'
      />
      <path
        d='M3 22C3.55228 22 4 21.5523 4 21C4 20.4477 3.55228 20 3 20C2.44772 20 2 20.4477 2 21C2 21.5523 2.44772 22 3 22Z'
        fill='currentColor'
      />
      <path
        d='M12 4C12.5523 4 13 3.55228 13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4Z'
        fill='currentColor'
      />
      <path
        d='M16.5 4C17.0523 4 17.5 3.55228 17.5 3C17.5 2.44772 17.0523 2 16.5 2C15.9477 2 15.5 2.44772 15.5 3C15.5 3.55228 15.9477 4 16.5 4Z'
        fill='currentColor'
      />
      <path
        d='M7.5 4C8.05228 4 8.5 3.55228 8.5 3C8.5 2.44772 8.05228 2 7.5 2C6.94772 2 6.5 2.44772 6.5 3C6.5 3.55228 6.94772 4 7.5 4Z'
        fill='currentColor'
      />
      <path
        d='M12 22C12.5523 22 13 21.5523 13 21C13 20.4477 12.5523 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22Z'
        fill='currentColor'
      />
      <path
        d='M16.5 22C17.0523 22 17.5 21.5523 17.5 21C17.5 20.4477 17.0523 20 16.5 20C15.9477 20 15.5 20.4477 15.5 21C15.5 21.5523 15.9477 22 16.5 22Z'
        fill='currentColor'
      />
      <path
        d='M7.5 22C8.05228 22 8.5 21.5523 8.5 21C8.5 20.4477 8.05228 20 7.5 20C6.94772 20 6.5 20.4477 6.5 21C6.5 21.5523 6.94772 22 7.5 22Z'
        fill='currentColor'
      />
    </svg>
  );
}
