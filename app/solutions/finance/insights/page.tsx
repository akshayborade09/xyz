import { PageLayout } from '@/components/page-layout';

export default function FinanceInsightsPage() {
  return (
    <PageLayout
      title='Customer Insights'
      description='AI solutions for financial customer insights'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Customer Insights</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Customer Insights content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
