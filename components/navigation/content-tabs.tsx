'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Updated ContentTabs with smooth animations - v2.0
interface Tab {
  title: string;
  href: string;
}

interface ContentTabsProps {
  tabs: Tab[];
  maxVisibleTabs?: number;
}

export function ContentTabs({ tabs, maxVisibleTabs = 5 }: ContentTabsProps) {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string>('');

  const visibleTabs = tabs.slice(0, maxVisibleTabs);
  const overflowTabs = tabs.slice(maxVisibleTabs);
  const hasOverflow = overflowTabs.length > 0;

  const getTabPosition = (href: string) => {
    if (!tabsRef.current) {
      return null;
    }

    const tab = tabsRef.current.querySelector(
      `[data-href="${href}"]`
    ) as HTMLElement;
    if (!tab) {
      return null;
    }

    const container = tabsRef.current;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    return {
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    };
  };

  // Initialize immediately when component mounts (without animation)
  useLayoutEffect(() => {
    const position = getTabPosition(pathname);
    if (position) {
      setTabUnderlineStyle(position);
      setIsInitialized(true);
      previousPathnameRef.current = pathname;

      // Enable animation after a small delay to ensure initial positioning is complete
      setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
    }
  }, [pathname]);

  // Handle tab changes with animation
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (previousPathnameRef.current === pathname) {
      return;
    }

    const animateToNewTab = () => {
      const newPosition = getTabPosition(pathname);
      if (newPosition) {
        setTabUnderlineStyle(newPosition);
        previousPathnameRef.current = pathname;
      }
    };

    // Animate to new tab position
    animateToNewTab();
  }, [pathname, isInitialized]);

  // Handle window resize
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const handleResize = () => {
      const position = getTabPosition(pathname);
      if (position) {
        setTabUnderlineStyle(position);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname, isInitialized]);

  const handleTabHover = (tab: Tab) => {
    setHoveredTab(tab.title);
  };

  const handleTabLeave = () => {
    setHoveredTab(null);
  };

  return (
    <div className='border-b'>
      <div ref={tabsRef} className='flex relative'>
        {/* Animated underline */}
        <div
          className={cn(
            'absolute bottom-0 h-0.5 bg-primary',
            shouldAnimate ? 'transition-all duration-300 ease-out' : ''
          )}
          style={{
            left: `${tabUnderlineStyle.left}px`,
            width: `${tabUnderlineStyle.width}px`,
          }}
        />

        {visibleTabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            data-href={tab.href}
            className={cn(
              'px-4 py-2 text-base font-medium transition-colors duration-200 relative',
              pathname === tab.href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              hoveredTab && hoveredTab !== tab.title ? 'opacity-75' : ''
            )}
            onMouseEnter={() => handleTabHover(tab)}
            onMouseLeave={handleTabLeave}
          >
            {tab.title}
          </Link>
        ))}

        {hasOverflow && (
          <DropdownMenu>
            <DropdownMenuTrigger className='px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground'>
              <MoreHorizontal className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {overflowTabs.map(tab => (
                <DropdownMenuItem key={tab.href} asChild>
                  <Link
                    href={tab.href}
                    className={cn(pathname === tab.href && 'font-medium')}
                  >
                    {tab.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
