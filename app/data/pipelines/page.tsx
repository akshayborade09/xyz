import { PageLayout } from '@/components/page-layout';

export default function DataPipelinesPage() {
  return (
    <PageLayout
      title='Data Pipelines'
      description='Manage your data processing pipelines'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Data Pipelines</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Data Pipelines content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
