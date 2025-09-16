import { PageLayout } from '@/components/page-layout';

export default function HealthcarePatientCarePage() {
  return (
    <PageLayout
      title='Patient Care Optimization'
      description='AI solutions for patient care optimization'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Patient Care Optimization</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Patient Care Optimization content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
