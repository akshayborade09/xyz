import { PageLayout } from '@/components/page-layout';

export default function PolicyPage() {
  return (
    <PageLayout title='Policy' description='Manage your IAM policies'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Policy</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Policy content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
