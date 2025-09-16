'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavMenuLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavMenuLink({
  href,
  children,
  className,
  onClick,
}: NavMenuLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn('block w-full', isActive ? 'font-medium' : '', className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
