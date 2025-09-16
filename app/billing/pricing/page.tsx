import { PageLayout } from '@/components/page-layout';

export default function PricingPage() {
  return (
    <PageLayout title='Pricing' description='View pricing information'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>Pricing</h3>
          <p className='text-sm text-muted-foreground'>
            This is a placeholder for the Pricing content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
