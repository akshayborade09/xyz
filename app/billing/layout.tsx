import type React from 'react';

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full'>
      <div className='flex-1'>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
}
