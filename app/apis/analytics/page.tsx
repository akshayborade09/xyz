import { PageLayout } from '@/components/page-layout';

export default function ApiAnalyticsPage() {
  return (
    <PageLayout
      title='API Analytics'
      description='Track usage metrics and performance'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>API Analytics</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the API Analytics content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
