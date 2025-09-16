import { PageLayout } from '@/components/page-layout';

export default function SdkReferencePage() {
  return (
    <PageLayout title='SDK Reference' description='Browse SDK documentation'>
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>SDK Reference</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the SDK Reference content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
