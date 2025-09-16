import { PageLayout } from '@/components/page-layout';

export default function ManufacturingQualityPage() {
  return (
    <PageLayout
      title='Quality Control'
      description='AI solutions for manufacturing quality control'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Quality Control</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Quality Control content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
