import { PageLayout } from '@/components/page-layout';

export default function DashboardStatusPage() {
  return (
    <PageLayout
      title='System Status'
      description='Check the health of your services'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>System Status</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the System Status content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
