import { PageLayout } from '@/components/page-layout';

export default function HealthcareCompliancePage() {
  return (
    <PageLayout
      title='Healthcare Compliance'
      description='AI solutions for healthcare compliance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Healthcare Compliance</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Healthcare Compliance content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
