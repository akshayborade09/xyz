import { PageLayout } from '@/components/page-layout';

export default function SupportLearningPage() {
  return (
    <PageLayout
      title='Learning Resources'
      description='Access learning materials and tutorials'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Learning Resources</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Learning Resources content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
