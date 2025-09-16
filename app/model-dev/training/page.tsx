import { PageShell } from '@/components/page-shell';

export default function ModelTrainingPage() {
  return (
    <PageShell
      title='Model Training'
      description='Train custom AI models with your own data'
      tabs={[
        { title: 'Overview', href: '/model-dev/training' },
        { title: 'Training Jobs', href: '/model-dev/training/jobs' },
        { title: 'Datasets', href: '/model-dev/training/datasets' },
        {
          title: 'Hyperparameters',
          href: '/model-dev/training/hyperparameters',
        },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>AI Model Training</h2>
          <p className='text-muted-foreground mb-4'>
            Train custom AI models using your own data with our state-of-the-art
            infrastructure. Our platform supports various model architectures
            and training methods, from supervised learning to reinforcement
            learning.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Distributed Training</h3>
              <p className='text-sm text-muted-foreground'>
                Train large models faster with distributed computing resources.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Hyperparameter Optimization</h3>
              <p className='text-sm text-muted-foreground'>
                Automatically find the best parameters for your models.
              </p>
            </div>
            <div className='border rounded-lg p-4'>
              <h3 className='font-medium mb-2'>Experiment Tracking</h3>
              <p className='text-sm text-muted-foreground'>
                Track and compare training runs and model performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
