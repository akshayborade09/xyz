import type React from 'react';

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full'>
      <div className='p-4 md:p-6'>{children}</div>
    </div>
  );
}
