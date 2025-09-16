'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NavCategory } from '@/lib/navigation-data';

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
interface SideNavProps {
  section: string;
  navSections: Record<string, NavCategory>;
}

export function SideNav({ section, navSections }: SideNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const navSection = navSections[section];

  if (!navSection) {
    return null;
  }

  const toggleExpanded = (title: string) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className='w-64 border-r h-[calc(100vh-4rem)] hidden md:block'>
      <div className='p-4 border-b'>
        <h2 className='font-semibold text-lg'>{navSection.title}</h2>
      </div>
      <ScrollArea className='h-[calc(100vh-8rem)]'>
        <div className='p-2'>
          {navSection.items.map(item => (
            <div key={item.title} className='mb-2'>
              <div className='flex items-center'>
                {item.items ? (
                  <Button
                    variant='ghost'
                    className='w-full justify-start font-medium'
                    onClick={() => toggleExpanded(item.title)}
                  >
                    {expanded[item.title] ? (
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
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>

              {item.items && expanded[item.title] && (
                <div className='ml-4 mt-1 space-y-1'>
                  {item.items.map(subItem => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        'flex items-center w-full px-3 py-2 text-sm rounded-md',
                        isActive(subItem.href)
                          ? 'bg-accent/80 text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
