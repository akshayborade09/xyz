'use client';

import React from 'react';

import type { ReactNode } from 'react';
import { ContentTabs } from '@/components/navigation/content-tabs';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  generateBreadcrumbs,
  type Breadcrumb as BreadcrumbType,
} from '@/lib/generate-breadcrumbs';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageShellProps {
  title: string;
  description?: string;
  tabs?: Array<{
    title: string;
    href: string;
  }>;
  children?: ReactNode;
  headerActions?: ReactNode;
  hideViewDocs?: boolean;
  customBreadcrumbs?: BreadcrumbType[];
}

export function PageShell({
  title,
  description,
  tabs,
  children,
  headerActions,
  hideViewDocs,
  customBreadcrumbs,
}: PageShellProps) {
  const pathname = usePathname();
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname);

  return (
    <div className='space-y-6'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb.href}-${index}`}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {!hideViewDocs && (
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/documentation'
                className='flex items-center gap-1 font-normal text-foreground'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='-0.5 -0.5 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='h-4 w-4'
                  strokeWidth='1'
                >
                  <path d='M14.375 1.9166666666666667H5.75a1.9166666666666667 1.9166666666666667 0 0 0 -1.9166666666666667 1.9166666666666667v15.333333333333334a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 1.9166666666666667h11.5a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 -1.9166666666666667V6.708333333333334Z'></path>
                  <path d='M13.416666666666668 1.9166666666666667v3.8333333333333335a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 1.9166666666666667h3.8333333333333335'></path>
                </svg>
                View Docs
              </Link>
            </Button>
          )}
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2'>
          <div>
            <h1 className='text-2xl font-medium tracking-tight'>{title}</h1>
            {description && (
              <p className='text-sm text-muted-foreground mt-2'>
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className='flex items-center gap-2 mt-2 sm:mt-0'>
              {headerActions}
            </div>
          )}
        </div>
      </div>
      {tabs && tabs.length > 0 && <ContentTabs tabs={tabs} />}
      <div className='mt-6'>{children}</div>
    </div>
  );
}
