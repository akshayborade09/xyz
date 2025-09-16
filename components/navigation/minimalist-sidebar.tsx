'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Menu, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KrutrimLogo } from '@/components/ui/krutrim-logo';
import { LogoutButton } from '@/components/auth/logout-button';
import { useAuth } from '@/components/auth/auth-provider';
import { navigationStructure, isPathActive } from '@/lib/navigation-data';
import { useNavigation } from '@/hooks/use-navigation';

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
interface MinimalistSidebarProps {
  initialExpanded?: boolean;
}

export function MinimalistSidebar({
  initialExpanded = true,
}: MinimalistSidebarProps) {
  const { pathname } = useNavigation();
  const router = useRouter();
  const [expanded, setExpanded] = useState(initialExpanded);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevExpandedRef = useRef(expanded);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Add this inside the MinimalistSidebar component, near the top with other hooks
  const { logout } = useAuth();

  // Detect if we're on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle animation state
  useEffect(() => {
    if (prevExpandedRef.current !== expanded) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Match this with the longest transition duration

      prevExpandedRef.current = expanded;
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Find the active category based on the current path
  useEffect(() => {
    for (const category of navigationStructure) {
      for (const item of category.items) {
        if (isPathActive(pathname, item.href)) {
          setActiveCategory(category.title);
          return;
        }
      }
    }
    setActiveCategory(null);
  }, [pathname]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleMenuItemClick = (
    href: string,
    hasChildren: boolean,
    e: React.MouseEvent
  ) => {
    // If the item has children, toggle the expanded state
    if (hasChildren) {
      e.preventDefault(); // Prevent default but don't stop propagation

      // Toggle the expanded state
      setExpandedItems(prev => {
        const isCurrentlyExpanded = prev[href];

        // If we're opening this item, close all others
        if (!isCurrentlyExpanded) {
          const newState: Record<string, boolean> = {};
          newState[href] = true;
          return newState;
        } else {
          return {
            ...prev,
            [href]: false,
          };
        }
      });

      // Navigate to the href
      router.push(href);
    }
  };

  // Auto-expand the menu item for the active path
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};

    navigationStructure.forEach(category => {
      category.items.forEach(item => {
        if (item.items && isPathActive(pathname, item.href)) {
          newExpandedItems[item.href] = true;
        }
      });
    });

    setExpandedItems(prev => ({
      ...prev,
      ...newExpandedItems,
    }));
  }, [pathname]);

  const handleLogout = async () => {
    // call logout function
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant='ghost'
        size='icon'
        className='fixed top-3 left-3 z-50 lg:hidden'
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className='h-5 w-5' />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'h-screen flex-shrink-0 transition-all duration-300 ease-in-out',
          expanded ? 'w-64' : 'w-16'
        )}
      >
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background will-change-transform',
            expanded ? 'w-64' : 'w-16',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'transition-all duration-300 ease-in-out'
          )}
        >
          {/* Header */}
          <div className='flex h-16 items-center justify-between border-b px-4'>
            <div
              className={cn(
                'flex items-center',
                !expanded && 'justify-center w-full'
              )}
            >
              {expanded ? (
                <KrutrimLogo href='/dashboard' width={120} height={36} />
              ) : (
                <KrutrimLogo
                  href='/dashboard'
                  width={32}
                  height={32}
                  className='w-8 h-8'
                />
              )}
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='hidden lg:flex'
              onClick={toggleExpanded}
              disabled={isAnimating}
            >
              {expanded ? (
                <ChevronLeft className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className='flex-1 overflow-y-auto py-4'>
            <TooltipProvider delayDuration={300}>
              {navigationStructure.map(category => (
                <div key={category.title} className='mb-6 px-3'>
                  {expanded && category.title && (
                    <h3
                      className={cn(
                        'mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider',
                        'transition-opacity duration-200 ease-in-out',
                        expanded
                          ? 'opacity-100'
                          : 'opacity-0 h-0 overflow-hidden'
                      )}
                    >
                      {category.title}
                    </h3>
                  )}
                  <ul className='space-y-1'>
                    {category.items.map(item => {
                      const isItemActive = isPathActive(pathname, item.href);
                      const hasChildren = !!item.items && item.items.length > 0;

                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  'flex items-center rounded-md py-2 text-sm relative overflow-hidden',
                                  expanded ? 'px-2' : 'justify-center px-0',
                                  isItemActive
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium'
                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                )}
                                onClick={e =>
                                  handleMenuItemClick(item.href, hasChildren, e)
                                }
                              >
                                <div
                                  className={cn(
                                    'flex h-7 w-7 items-center justify-center rounded-md z-10',
                                    isItemActive && 'bg-background',
                                    'transition-all duration-200 ease-in-out'
                                  )}
                                >
                                  {item.icon}
                                </div>

                                {/* Text label with smooth transition */}
                                <div
                                  className={cn(
                                    'ml-2 flex-1 truncate whitespace-nowrap',
                                    'transition-all duration-200 ease-in-out',
                                    expanded
                                      ? 'opacity-100 translate-x-0 relative'
                                      : 'opacity-0 -translate-x-4 absolute pointer-events-none'
                                  )}
                                  style={{
                                    transitionDelay: expanded ? '100ms' : '0ms',
                                    width: expanded ? 'auto' : '0',
                                  }}
                                >
                                  {item.title}
                                </div>

                                {/* Chevron icon with smooth transition */}
                                {hasChildren && (
                                  <div
                                    className={cn(
                                      'transition-all duration-200 ease-in-out',
                                      expanded
                                        ? 'opacity-100 relative'
                                        : 'opacity-0 absolute pointer-events-none right-2'
                                    )}
                                    style={{
                                      transitionDelay: expanded
                                        ? '100ms'
                                        : '0ms',
                                    }}
                                  >
                                    <ChevronRight
                                      className={cn(
                                        'h-4 w-4 transition-transform duration-200 ease-in-out',
                                        expandedItems[item.href] && 'rotate-90'
                                      )}
                                    />
                                  </div>
                                )}
                              </Link>
                            </TooltipTrigger>
                            {!expanded && (
                              <TooltipContent side='right'>
                                {item.title}
                              </TooltipContent>
                            )}
                          </Tooltip>

                          {/* Sub-items with smooth height transition */}
                          {hasChildren && (
                            <div
                              className={cn(
                                'overflow-hidden transition-all duration-300 ease-in-out',
                                expandedItems[item.href]
                                  ? 'max-h-96 opacity-100'
                                  : 'max-h-0 opacity-0'
                              )}
                            >
                              <ul className='mt-1 ml-9 space-y-1 border-l pl-2'>
                                {item.items.map(subItem => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={cn(
                                        'flex h-8 items-center text-sm rounded-md px-2',
                                        isPathActive(pathname, subItem.href)
                                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium'
                                          : 'text-foreground/80 hover:text-foreground hover:bg-accent/50'
                                      )}
                                    >
                                      {subItem.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </TooltipProvider>
          </div>
          {/* Add a logout button at the bottom of the sidebar */}
          <div className='mt-auto p-4 border-t'>
            {expanded ? (
              <LogoutButton variant='outline' />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleLogout()}
                  >
                    <LogOut className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right'>Sign out</TooltipContent>
              </Tooltip>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
