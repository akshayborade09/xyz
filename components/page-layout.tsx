import { PageShell } from '@/components/page-shell';
import type { ReactNode } from 'react';
import type { Breadcrumb } from '@/lib/generate-breadcrumbs';

interface PageLayoutProps {
  title: string;
  description?: string;
  tabs?: Array<{
    title: string;
    href: string;
  }>;
  children?: ReactNode;
  headerActions?: ReactNode;
  customBreadcrumbs?: Breadcrumb[];
  hideViewDocs?: boolean;
}

export function PageLayout({
  title,
  description,
  tabs,
  children,
  headerActions,
  customBreadcrumbs,
  hideViewDocs,
}: PageLayoutProps) {
  return (
    <PageShell
      title={title}
      description={description}
      tabs={tabs}
      headerActions={headerActions}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={hideViewDocs}
    >
      {children}
    </PageShell>
  );
}
