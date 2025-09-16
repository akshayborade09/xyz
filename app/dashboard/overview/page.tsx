import { PageLayout } from '@/components/page-layout';

export default function DashboardOverviewPage() {
  return (
    <PageLayout
      title='Overview & Analytics'
      description='View your system performance at a glance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Overview & Analytics</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Overview & Analytics content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
