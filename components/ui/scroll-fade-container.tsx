'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollFadeContainerProps {
  children: React.ReactNode;
  className?: string;
  fadeHeight?: number;
  showTopFade?: boolean;
  showBottomFade?: boolean;
}

export function ScrollFadeContainer({
  children,
  className,
  fadeHeight = 20,
  showTopFade = true,
  showBottomFade = true,
}: ScrollFadeContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
    const updateScrollState = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        setScrollState({
          canScrollUp: scrollTop > 0,
          canScrollDown: scrollTop < scrollHeight - clientHeight - 1, // -1 for sub-pixel precision
        });
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      // Initial check
      updateScrollState();

      // Add scroll listener
      scrollElement.addEventListener('scroll', updateScrollState, {
        passive: true,
      });

      // Add resize listener to handle content changes
      const resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(scrollElement);

      return () => {
        scrollElement.removeEventListener('scroll', updateScrollState);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      {/* Top fade gradient */}
      {showTopFade && scrollState.canScrollUp && (
        <div
          className='absolute top-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-200'
          style={{
            height: `${fadeHeight}px`,
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)`,
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
          }}
        />
      )}

      {/* Bottom fade gradient */}
      {showBottomFade && scrollState.canScrollDown && (
        <div
          className='absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-200'
          style={{
            height: `${fadeHeight}px`,
            background: `linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)`,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className='h-full w-full overflow-y-auto smooth-scroll'
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
}
