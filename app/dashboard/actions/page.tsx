import { PageLayout } from '@/components/page-layout';

export default function DashboardActionsPage() {
  return (
    <PageLayout
      title='Quick Actions'
      description='Access frequently used operations'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Quick Actions</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Quick Actions content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
