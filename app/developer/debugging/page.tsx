import { PageLayout } from '@/components/page-layout';

export default function DeveloperDebuggingPage() {
  return (
    <PageLayout
      title='Debugging Tools'
      description='Tools to help debug your applications'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Debugging Tools</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Debugging Tools content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
