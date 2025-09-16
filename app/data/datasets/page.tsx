import { PageLayout } from '@/components/page-layout';

export default function DatasetsPage() {
  return (
    <PageLayout
      title='Datasets'
      description='Manage and organize your datasets'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Content Area</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Datasets content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
