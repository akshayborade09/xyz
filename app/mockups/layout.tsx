import type React from 'react';
export default function MockupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='h-full'>{children}</div>;
}
