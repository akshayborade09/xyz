import { PageLayout } from '@/components/page-layout';

export default function ModelTrainingPage() {
  return (
    <PageLayout
      title='Model Training'
      description='Train and fine-tune your AI models'
    >
      <div className='flex items-center justify-center h-[400px] border rounded-lg'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-2'>Model Training</h3>
          <p className='text-muted-foreground'>
            This is a placeholder for the Model Training content
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
