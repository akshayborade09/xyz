import type React from 'react';

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full'>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
