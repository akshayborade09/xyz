import { PageLayout } from '@/components/page-layout';

export default function DataGovernancePage() {
  return (
    <PageLayout
      title='Data Governance'
      description='Manage your data governance policies'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Data Governance</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Data Governance content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
