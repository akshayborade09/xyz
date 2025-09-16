import type { ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * @component DetailSection
 * @description A section for displaying detailed information with a title
 * @status Active
 * @example
 * <DetailSection title="VPC Details">
 *   <DetailGrid>...</DetailGrid>
 * </DetailSection>
 */
export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className='mb-8'>
      {title && (
        <h2 className='text-lg font-semibold mb-5 pb-2.5 border-b border-border'>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
