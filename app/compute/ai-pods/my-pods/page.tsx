import { PageLayout } from '@/components/page-layout';

export default function MyPodsPage() {
  return (
    <PageLayout title='My Pods' description='Manage your AI pods'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>My Pods</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the My Pods content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
