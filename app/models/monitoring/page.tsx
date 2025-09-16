import { PageLayout } from '@/components/page-layout';

export default function ModelMonitoringPage() {
  return (
    <PageLayout
      title='Model Monitoring'
      description='Monitor your AI models performance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Model Monitoring</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Model Monitoring content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
