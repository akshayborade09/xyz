import { PageLayout } from '@/components/page-layout';

export default function BillingTeamPage() {
  return (
    <PageLayout
      title='Team Management'
      description='Manage your team members and permissions'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Team Management</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Team Management content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
