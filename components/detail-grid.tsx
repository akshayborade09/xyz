import type { ReactNode } from 'react';

interface DetailGridProps {
  children: ReactNode;
}

/**
 * @component DetailGrid
 * @description A responsive grid layout for displaying detail items
 * @status Active
 * @example
 * <DetailGrid>
 *   <DetailItem label="Name" value="example-vpc" />
 * </DetailGrid>
 */
export function DetailGrid({ children }: DetailGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {children}
    </div>
  );
}
