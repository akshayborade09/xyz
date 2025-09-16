import { PageLayout } from '@/components/page-layout';

export default function QuickstartPage() {
  return (
    <PageLayout
      title='Quickstart Guides'
      description='Get started quickly with guides'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Quickstart Guides</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Quickstart Guides content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
