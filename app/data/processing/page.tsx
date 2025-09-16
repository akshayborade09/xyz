import { PageLayout } from '@/components/page-layout';

export default function DataProcessingPage() {
  return (
    <PageLayout
      title='Data Processing'
      description='Process and transform your data'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Data Processing</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Data Processing content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
