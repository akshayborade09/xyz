import { PageLayout } from '@/components/page-layout';

export default function ManufacturingSupplyChainPage() {
  return (
    <PageLayout
      title='Supply Chain Optimization'
      description='AI solutions for manufacturing supply chain optimization'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Supply Chain Optimization</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Supply Chain Optimization content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
