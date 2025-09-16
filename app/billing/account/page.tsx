import { PageLayout } from '@/components/page-layout';

export default function BillingAccountPage() {
  return (
    <PageLayout
      title='Account Management'
      description='Manage your account settings and preferences'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Account Management</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Account Management content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
