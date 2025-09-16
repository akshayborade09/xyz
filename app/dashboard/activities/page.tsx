import { PageLayout } from '@/components/page-layout';

export default function DashboardActivitiesPage() {
  return (
    <PageLayout
      title='Recent Activities'
      description='Track recent changes and operations'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Recent Activities</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Recent Activities content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
