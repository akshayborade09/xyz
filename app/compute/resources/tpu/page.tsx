import { PageLayout } from '@/components/page-layout';

export default function TpuResourcesPage() {
  return (
    <PageLayout
      title='TPU Resources'
      description='Manage your TPU resources for specialized AI workloads'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>TPU Resources</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the TPU Resources content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
