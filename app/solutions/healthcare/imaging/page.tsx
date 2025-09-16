import { PageLayout } from '@/components/page-layout';

export default function HealthcareImagingPage() {
  return (
    <PageLayout
      title='Medical Imaging Analysis'
      description='AI solutions for medical imaging analysis'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Medical Imaging Analysis</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Medical Imaging Analysis content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
