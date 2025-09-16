import React from 'react';

interface AiPodsIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function AiPodsIcon({
  className = '',
  width = 24,
  height = 24,
}: AiPodsIconProps) {
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
        d='M20.3333 6.11532V17.6667C20.3333 19.14 19.14 20.3333 17.6666 20.3333H6.33329C4.85996 20.3333 3.66663 19.14 3.66663 17.6667V6.33332C3.66663 4.85999 4.85996 3.66666 6.33329 3.66666H9.01929'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.2107 2.65333L16.5267 2.092L15.9653 0.408C15.7827 -0.136 14.8827 -0.136 14.7 0.408L14.1387 2.092L12.4547 2.65333C12.1827 2.744 11.9987 2.99867 11.9987 3.28533C11.9987 3.572 12.1827 3.82667 12.4547 3.91733L14.1387 4.47867L14.7 6.16267C14.7907 6.43467 15.0467 6.61867 15.3333 6.61867C15.62 6.61867 15.8747 6.43467 15.9667 6.16267L16.528 4.47867L18.212 3.91733C18.484 3.82667 18.668 3.572 18.668 3.28533C18.668 2.99867 18.4827 2.744 18.2107 2.65333Z'
        fill='currentColor'
      />
    </svg>
  );
}
