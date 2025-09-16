import { PageLayout } from '@/components/page-layout';

export default function ComputeMonitoringPage() {
  return (
    <PageLayout
      title='Performance Monitoring'
      description='Monitor your compute resources performance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Performance Monitoring</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Performance Monitoring content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
