import type React from 'react';

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full'>
      <div className='p-4'>{children}</div>
    </div>
  );
}
