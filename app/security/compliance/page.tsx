import { PageLayout } from '@/components/page-layout';

export default function SecurityCompliancePage() {
  return (
    <PageLayout
      title='Compliance Center'
      description='Manage compliance requirements for your applications'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Compliance Center</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Compliance Center content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
