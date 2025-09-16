'use client';

import type React from 'react';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { NavItem, NavSubItem } from '@/lib/navigation-data';

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: (href: string, e: React.MouseEvent) => void;
  variant?: 'default' | 'sidebar' | 'minimalist';
}

export function NavigationItem({
  item,
  isActive,
  isExpanded,
  onToggleExpand,
  variant = 'default',
}: NavItemProps) {
  const hasChildren = !!item.items && item.items.length > 0;

  if (variant === 'minimalist') {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex h-9 items-center px-4 text-sm font-medium rounded-none border-l-2',
          isActive
            ? 'border-l-green-500 bg-green-500/10 text-green-600'
            : 'border-l-transparent hover:border-l-muted-foreground hover:bg-accent/20 text-foreground'
        )}
        onClick={e => hasChildren && onToggleExpand(item.href, e)}
      >
        <span className='flex h-5 w-5 items-center justify-center'>
          {item.icon}
        </span>
        <span className='ml-3 truncate'>{item.title}</span>
        {hasChildren && (
          <span className='ml-auto'>
            {isExpanded ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </span>
        )}
      </Link>
    );
  }

  if (variant === 'sidebar') {
    return hasChildren ? (
      <Button
        variant='ghost'
        className='w-full justify-start font-medium'
        onClick={e => onToggleExpand(item.href, e)}
      >
        {isExpanded ? (
          <ChevronDown className='h-4 w-4 mr-2' />
        ) : (
          <ChevronRight className='h-4 w-4 mr-2' />
        )}
        {item.title}
      </Button>
    ) : (
      <Link
        href={item.href}
        className={cn(
          'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
        )}
      >
        {item.title}
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center px-4 py-2 text-sm font-medium rounded-md',
        isActive
          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )}
    >
      {item.icon}
      <span className='ml-3'>{item.title}</span>
      {hasChildren && <ChevronRight className='ml-auto h-4 w-4' />}
    </Link>
  );
}

export function SubNavigationItem({
  item,
  isActive,
  variant = 'default',
}: {
  item: NavSubItem;
  isActive: boolean;
  variant?: 'default' | 'sidebar' | 'minimalist';
}) {
  if (variant === 'sidebar') {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center w-full px-3 py-2 text-sm rounded-md',
          isActive
            ? 'bg-accent/80 text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
        )}
      >
        {item.title}
      </Link>
    );
  }

  if (variant === 'minimalist') {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex h-8 items-center text-sm rounded-none border-l-2 pl-4',
          isActive
            ? 'border-l-primary text-primary font-medium'
            : 'border-l-transparent text-muted-foreground hover:text-foreground hover:border-l-muted-foreground'
        )}
      >
        {item.title}
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={item.href}
      className={cn(
        'flex h-8 items-center text-sm rounded-md px-2',
        isActive
          ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )}
    >
      {item.title}
    </Link>
  );
}
