import { PageLayout } from '@/components/page-layout';

export default function BillingQuotasPage() {
  return (
    <PageLayout
      title='Quotas & Limits'
      description='View and manage your service quotas and limits'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Quotas & Limits</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Quotas & Limits content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
