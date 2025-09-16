import { PageLayout } from '@/components/page-layout';

export default function ComputeNetworkingPage() {
  return (
    <PageLayout
      title='Networking'
      description='Manage your compute networking resources'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Networking</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Networking content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
