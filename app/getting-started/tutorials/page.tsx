import { PageLayout } from '@/components/page-layout';

export default function TutorialsPage() {
  return (
    <PageLayout
      title='Tutorials'
      description='Learn with step-by-step tutorials'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Tutorials</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Tutorials content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
