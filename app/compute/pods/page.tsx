import { PageLayout } from '@/components/page-layout';

export default function ComputePodsPage() {
  return (
    <PageLayout title='AI Pods' description='Manage your AI compute pods'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>AI Pods</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the AI Pods content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
