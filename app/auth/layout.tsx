import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Krutrim Cloud',
  description: 'Authentication pages for Krutrim Cloud Platform',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='min-h-screen bg-gray-50'>{children}</div>;
}
