import type React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  rightContent,
}: PageHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
      <div>
        <h1 className='text-2xl font-medium'>{title}</h1>
        {description && (
          <p className='text-sm text-muted-foreground mt-1'>{description}</p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
