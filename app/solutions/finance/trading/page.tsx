import { PageLayout } from '@/components/page-layout';

export default function FinanceTradingPage() {
  return (
    <PageLayout
      title='Trading & Investment'
      description='AI solutions for trading and investment'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Trading & Investment</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Trading & Investment content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
