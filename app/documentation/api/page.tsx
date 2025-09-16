import { PageLayout } from '@/components/page-layout';

export default function ApiReferencePage() {
  return (
    <PageLayout title='API Reference' description='Browse API documentation'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>API Reference</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the API Reference content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
