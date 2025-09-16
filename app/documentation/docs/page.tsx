import { PageLayout } from '@/components/page-layout';

export default function DocsPage() {
  return (
    <PageLayout title='Docs' description='Browse documentation'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Documentation</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Documentation content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
