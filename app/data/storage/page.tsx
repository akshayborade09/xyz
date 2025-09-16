import { PageLayout } from '@/components/page-layout';

export default function DataStoragePage() {
  return (
    <PageLayout title='Object Storage' description='Manage your data storage'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Object Storage</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Object Storage content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
