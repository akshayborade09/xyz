import { PageLayout } from '@/components/page-layout';

export default function FinanceCompliancePage() {
  return (
    <PageLayout
      title='Regulatory Compliance'
      description='AI solutions for financial regulatory compliance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Regulatory Compliance</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Regulatory Compliance content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
