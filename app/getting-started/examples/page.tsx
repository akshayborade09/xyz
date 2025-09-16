import { PageLayout } from '@/components/page-layout';

export default function ExamplesPage() {
  return (
    <PageLayout
      title='Example Projects'
      description='Learn from example projects'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Example Projects</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Example Projects content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
