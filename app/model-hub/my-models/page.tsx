import { PageShell } from '@/components/page-shell';

export default function MyModelsPage() {
  return (
    <PageShell
      title='My Models'
      description='Manage your custom AI models and deployments'
      tabs={[
        { title: 'All Models', href: '/model-hub/my-models' },
        { title: 'Deployed', href: '/model-hub/my-models/deployed' },
        { title: 'In Training', href: '/model-hub/my-models/training' },
        { title: 'Drafts', href: '/model-hub/my-models/drafts' },
      ]}
    >
      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Your AI Models</h2>
          <p className='text-muted-foreground mb-4'>
            This dashboard provides an overview of all your AI models, including
            custom-trained models, fine-tuned models, and models deployed to
            production environments.
          </p>

          <div className='bg-muted/40 rounded-lg p-8 text-center'>
            <h3 className='text-lg font-medium mb-2'>No models found</h3>
            <p className='text-muted-foreground mb-4'>
              You haven't created any models yet.
            </p>
            <div className='flex justify-center'>
              <button className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md'>
                Create New Model
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
