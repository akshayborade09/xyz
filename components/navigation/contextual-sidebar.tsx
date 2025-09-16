'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  getSectionFromPathname,
  getSectionTitle,
  getNavigationItemsForSection,
  isPathActive,
} from '@/lib/navigation-data';

/**
 * @deprecated
 * NOT CURRENTLY USED IN THE APPLICATION
 *
 * This component is not currently used in the main application.
 * It's kept for reference or potential future use but should not be modified
 * as part of regular application updates.
 *
 * Last reviewed: April 24, 2025
 */
export function ContextualSidebar() {
  const pathname = usePathname();

  // Determine which section we're in based on the pathname
  const section = getSectionFromPathname(pathname);

  if (!section) {
    return null;
  }

  const sectionTitle = getSectionTitle(section);
  const navigationItems = getNavigationItemsForSection(section);

  return (
    <div className='w-64 h-full border-r bg-background'>
      <div className='py-4'>
        <h2 className='px-4 text-lg font-semibold mb-2'>{sectionTitle}</h2>
        <nav className='space-y-1'>
          {navigationItems.map(item => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                  isPathActive(pathname, item.href)
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {item.icon}
                <span className='ml-3'>{item.title}</span>
                {item.items && <ChevronRight className='ml-auto h-4 w-4' />}
              </Link>

              {item.items && isPathActive(pathname, item.href) && (
                <div className='mt-1 ml-7 space-y-1 border-l pl-2'>
                  {item.items.map(subItem => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'flex h-8 items-center text-sm rounded-md px-2',
                        isPathActive(pathname, subItem.href)
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
