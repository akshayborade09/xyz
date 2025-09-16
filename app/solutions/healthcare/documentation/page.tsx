import { PageLayout } from '@/components/page-layout';

export default function HealthcareDocumentationPage() {
  return (
    <PageLayout
      title='Clinical Documentation'
      description='AI solutions for clinical documentation'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Clinical Documentation</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Clinical Documentation content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
