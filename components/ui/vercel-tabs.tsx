'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface VercelTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const VercelTabs = React.forwardRef<HTMLDivElement, VercelTabsProps>(
  ({ className, tabs, activeTab, onTabChange, size = 'md', ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(() => {
      if (activeTab) {
        const index = tabs.findIndex(tab => tab.id === activeTab);
        return index !== -1 ? index : 0;
      }
      return 0;
    });
    const [hoverStyle, setHoverStyle] = useState({});
    const [activeStyle, setActiveStyle] = useState({
      left: '0px',
      width: '0px',
    });
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Update active index when activeTab prop changes
    useEffect(() => {
      if (activeTab) {
        const index = tabs.findIndex(tab => tab.id === activeTab);
        if (index !== -1) {
          setActiveIndex(index);
        }
      }
    }, [activeTab, tabs]);

    // Handle hover effect
    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [hoveredIndex]);

    // Handle active indicator positioning
    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }, [activeIndex]);

    // Initialize active indicator position
    useEffect(() => {
      requestAnimationFrame(() => {
        const activeElement = tabRefs.current[activeIndex];
        if (activeElement) {
          const { offsetLeft, offsetWidth } = activeElement;
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      });
    }, [activeIndex]);

    const sizeClasses = {
      sm: {
        container: 'h-7',
        tab: 'px-2.5 py-1 text-xs h-7',
        spacing: 'space-x-1',
      },
      md: {
        container: 'h-8',
        tab: 'px-3 py-1.5 text-sm h-8',
        spacing: 'space-x-1.5',
      },
      lg: {
        container: 'h-10',
        tab: 'px-4 py-2 text-base h-10',
        spacing: 'space-x-2',
      },
    };

    const currentSize = sizeClasses[size];

    return (
      <div ref={ref} className={cn('relative border-b', className)} {...props}>
        <div className='relative'>
          {/* Hover Background Indicator */}
          {hoveredIndex !== null && hoveredIndex !== activeIndex && (
            <div
              className='absolute bottom-1 top-1 transition-all duration-200 ease-out bg-[#1f22250f] rounded-md'
              style={hoverStyle}
            />
          )}

          {/* Active Indicator - horizontal line style like ContentTabs */}
          <div
            className='absolute bottom-0 h-0.5 transition-all duration-300 ease-out bg-primary'
            style={activeStyle}
          />

          {/* Tabs Container */}
          <div
            className={cn('relative flex items-center', currentSize.spacing)}
          >
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className={cn(
                  'cursor-pointer transition-colors duration-200 font-medium flex items-center justify-center',
                  currentSize.tab,
                  index === activeIndex
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index);
                  onTabChange?.(tab.id);
                }}
              >
                <div className='whitespace-nowrap leading-none'>
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
VercelTabs.displayName = 'VercelTabs';

export { VercelTabs };
export type { Tab, VercelTabsProps };
