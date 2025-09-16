import type React from 'react';

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full'>
      <div className='p-4 md:p-6'>
        <div className='mt-6'>{children}</div>
      </div>
    </div>
  );
}
