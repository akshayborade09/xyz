'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isPathActive } from '@/lib/navigation-data';

export function useNavigation() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Auto-expand the section that contains the current path
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};

    // Find all parent items that should be expanded based on the current path
    const findParentItems = (path: string) => {
      // This is a simplified example - you would need to traverse your navigation structure
      // to find all parent items that should be expanded
      return [path.split('/').slice(0, 2).join('/')];
    };

    const parentItems = findParentItems(pathname);

    parentItems.forEach(item => {
      if (item) {
        newExpandedItems[item] = true;
      }
    });

    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
  }, [pathname]);

  const toggleExpanded = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return {
    pathname,
    expandedItems,
    toggleExpanded,
    isActive: (href: string) => isPathActive(pathname, href),
  };
}
